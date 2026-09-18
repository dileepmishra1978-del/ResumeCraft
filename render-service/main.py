import os
import sys
import yaml
import tempfile
import subprocess
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure UTF-8 IO encoding
os.environ["PYTHONIOENCODING"] = "utf-8"

app = FastAPI(
    title="ResumeCraft RenderCV Service",
    description="Stateless RenderCV (Typst) PDF rendering microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_THEMES = [
    "classic",
    "engineeringresumes",
    "harvard",
    "sb2nov",
    "moderncv",
    "ember",
    "ink",
    "opal",
    "engineeringclassic"
]

class RenderRequest(BaseModel):
    theme: Optional[str] = Field(default="classic")
    yaml_content: Optional[str] = Field(default=None, description="Pre-formatted RenderCV YAML string")
    resume_data: Optional[Dict[str, Any]] = Field(default=None, description="JSON ResumeCraft payload")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "rendercv-renderer",
        "supported_themes": SUPPORTED_THEMES
    }

@app.get("/themes")
def get_themes():
    return {"themes": SUPPORTED_THEMES}

def sanitize_date(val: Any) -> Optional[str]:
    if not val:
        return None
    s = str(val).strip()
    if not s:
        return None
    if s.lower() in ("present", "current", "now", "today"):
        return "present"
    import re
    if re.match(r"^\d{4}(-\d{2})?(-\d{2})?$", s):
        return s
    try:
        from datetime import datetime
        for fmt in ("%b %Y", "%B %Y", "%m/%Y", "%m-%Y", "%Y/%m", "%d/%m/%Y", "%m/%d/%Y"):
            try:
                dt = datetime.strptime(s, fmt)
                return dt.strftime("%Y-%m")
            except ValueError:
                continue
    except Exception:
        pass
    year_match = re.search(r"\b(19\d\d|20\d\d)\b", s)
    if year_match:
        return year_match.group(1)
    return None

def json_to_rendercv_dict(data: Dict[str, Any], theme: str) -> Dict[str, Any]:
    """Converts a standard ResumeCraft JSON object into RenderCV v2.8 dictionary schema matching the live editor preview."""
    contact = data.get("contact", {})
    social_networks = []
    if contact.get("linkedin"):
        social_networks.append({"network": "LinkedIn", "username": contact["linkedin"].replace("https://linkedin.com/in/", "").replace("https://www.linkedin.com/in/", "").strip("/")})
    if contact.get("github"):
        social_networks.append({"network": "GitHub", "username": contact["github"].replace("https://github.com/", "").replace("https://www.github.com/", "").strip("/")})

    is_fresher = bool(
        data.get("fresher_mode") or theme in ["harvard", "sb2nov"]
    )

    if contact.get("notice_period"):
        loc = contact.get("location", "")
        contact_loc = f"{loc} (Notice: {contact['notice_period']})" if loc else f"Notice: {contact['notice_period']}"
    else:
        contact_loc = contact.get("location")

    # Education block
    edu_entries = []
    if data.get("education"):
        for edu in data["education"]:
            institution = edu.get("institution", "")
            deg = edu.get("degree", "")
            area = edu.get("area", "")
            board = edu.get("board_or_university", "")
            cgpa = edu.get("cgpa_or_percentage", "")

            deg_parts = []
            if deg:
                deg_parts.append(deg)
            if area:
                deg_parts.append(f"in {area}")
            if board:
                deg_parts.append(f"({board})")
            if cgpa:
                deg_parts.append(f"| CGPA: {cgpa}")

            entry = {
                "institution": institution,
                "degree": " ".join(deg_parts) if deg_parts else (deg or "Degree"),
                "area": area or "Engineering",
            }
            s_date = sanitize_date(edu.get("start_date"))
            if s_date:
                entry["start_date"] = s_date
            e_date = sanitize_date(edu.get("end_date"))
            if e_date:
                entry["end_date"] = e_date
            if edu.get("location"):
                entry["location"] = edu["location"]
            
            highlights = list(edu.get("highlights") or [])
            if highlights:
                entry["highlights"] = [h.replace("$", "\\$") for h in highlights]
            edu_entries.append(entry)

    # Experience block
    exp_entries = []
    if data.get("experience"):
        for exp in data["experience"]:
            entry = {
                "company": exp.get("company", ""),
                "position": exp.get("position", ""),
            }
            s_date = sanitize_date(exp.get("start_date"))
            if s_date:
                entry["start_date"] = s_date
            e_date = sanitize_date(exp.get("end_date"))
            if e_date:
                entry["end_date"] = e_date
            else:
                entry["end_date"] = "present"
            if exp.get("location"):
                entry["location"] = exp["location"]
            if exp.get("highlights"):
                entry["highlights"] = [h.replace("$", "\\$") for h in exp["highlights"]]
            exp_entries.append(entry)

    # Projects block
    proj_entries = []
    if data.get("projects"):
        for proj in data["projects"]:
            name = proj.get("name", "")
            tools = proj.get("tools")
            if tools and len(tools) > 0:
                name_with_tools = f"{name} | {', '.join(tools)}"
            else:
                name_with_tools = name

            entry = {
                "name": name_with_tools,
            }
            s_date = sanitize_date(proj.get("start_date"))
            if s_date:
                entry["start_date"] = s_date
            e_date = sanitize_date(proj.get("end_date"))
            if e_date:
                entry["end_date"] = e_date
            if proj.get("description"):
                entry["summary"] = proj["description"].replace("$", "\\$")
            if proj.get("link"):
                entry["link"] = proj["link"]
            if proj.get("highlights"):
                entry["highlights"] = [h.replace("$", "\\$") for h in proj["highlights"]]
            proj_entries.append(entry)

    # Skills block
    skill_entries = []
    if data.get("skills"):
        for s in data["skills"]:
            category = s.get("category", "Skills")
            items = s.get("items", [])
            if isinstance(items, list):
                items_str = ", ".join(items)
            else:
                items_str = str(items)
            skill_entries.append(f"**{category}:** {items_str}")

    # Certifications block
    cert_entries = []
    if data.get("certifications"):
        for cert in data["certifications"]:
            if isinstance(cert, str):
                cert_entries.append(cert)
            elif isinstance(cert, dict):
                name = cert.get("name", "")
                issuer = cert.get("issuer", "")
                date = cert.get("date", "")
                cert_entries.append(f"**{name}** - {issuer} ({date})" if issuer else name)

    # Build sections dictionary in desired order
    exp_title = "Internships & Experience" if is_fresher else "Work Experience"
    proj_title = "Academic & Technical Projects" if is_fresher else "Projects & Achievements"

    sections: Dict[str, Any] = {}
    if is_fresher:
        if edu_entries: sections["Education"] = edu_entries
        if proj_entries: sections[proj_title] = proj_entries
        if skill_entries: sections["Technical Skills & Proficiencies"] = skill_entries
        if exp_entries: sections[exp_title] = exp_entries
        if cert_entries: sections["Certifications & Accreditations"] = cert_entries
    else:
        if exp_entries: sections[exp_title] = exp_entries
        if edu_entries: sections["Education"] = edu_entries
        if proj_entries: sections[proj_title] = proj_entries
        if skill_entries: sections["Technical Skills & Proficiencies"] = skill_entries
        if cert_entries: sections["Certifications & Accreditations"] = cert_entries

    # Indian Declaration block
    decl = data.get("declaration")
    if decl and decl.get("enabled"):
        decl_text = decl.get("text") or "I hereby declare that all information given above is true, complete, and correct to the best of my knowledge and belief."
        date_str = decl.get("date") or "2026-09-18"
        place_str = decl.get("place") or contact.get("location") or "Bengaluru, India"
        sig_str = decl.get("signature_name") or contact.get("name") or "Applicant"
        sections["Declaration"] = [
            decl_text,
            f"**Date:** {date_str} | **Place:** {place_str}          **Candidate Signature:** {sig_str}"
        ]

    rendercv_theme = theme if theme in ("harvard", "sb2nov") else "engineeringresumes"

    design_dict: Dict[str, Any] = {
        "theme": rendercv_theme,
        "page": {
            "show_top_note": False,
            "show_footer": False,
            "top_margin": "0.42in",
            "bottom_margin": "0.42in",
            "left_margin": "0.5in",
            "right_margin": "0.5in"
        },
        "typography": {
            "font_family": {
                "body": "Source Sans 3" if rendercv_theme != "harvard" else "EB Garamond",
                "name": "Source Sans 3" if rendercv_theme != "harvard" else "EB Garamond",
                "headline": "Source Sans 3" if rendercv_theme != "harvard" else "EB Garamond",
                "connections": "Source Sans 3" if rendercv_theme != "harvard" else "EB Garamond",
                "section_titles": "Source Sans 3" if rendercv_theme != "harvard" else "EB Garamond",
            },
            "font_size": {
                "body": "9.8pt",
                "name": "22pt",
                "headline": "10.5pt",
                "connections": "9pt",
                "section_titles": "11pt"
            },
            "bold": {
                "name": True,
                "headline": True,
                "section_titles": True
            }
        },
        "header": {
            "alignment": "center",
            "space_below_name": "0.2cm",
            "space_below_headline": "0.25cm",
            "connections": {
                "separator": "|",
                "space_between_connections": "0.35cm"
            }
        },
        "section_titles": {
            "type": "with_full_line",
            "line_thickness": "0.5pt",
            "space_above": "0.3cm",
            "space_below": "0.15cm"
        },
        "sections": {
            "space_between_regular_entries": "0.22cm",
            "space_between_text_based_entries": "0.1cm"
        }
    }

    custom_design = data.get("design") or {}
    if custom_design.get("margins"):
        m = custom_design["margins"]
        if m.get("top"): design_dict["page"]["top_margin"] = m["top"]
        if m.get("bottom"): design_dict["page"]["bottom_margin"] = m["bottom"]
        if m.get("left"): design_dict["page"]["left_margin"] = m["left"]
        if m.get("right"): design_dict["page"]["right_margin"] = m["right"]

    if custom_design.get("font_size"):
        fs = custom_design["font_size"]
        design_dict["typography"]["font_size"]["body"] = fs if isinstance(fs, str) else fs.get("body", "9.8pt")
    if custom_design.get("line_spacing"):
        design_dict["typography"]["line_spacing"] = custom_design["line_spacing"]

    if custom_design.get("space_between_entries"):
        design_dict["sections"]["space_between_regular_entries"] = custom_design["space_between_entries"]

    cv_obj: Dict[str, Any] = {
        "name": contact.get("name") or "Your Name",
    }
    if data.get("target_role"):
        cv_obj["headline"] = data["target_role"].upper()
    elif data.get("title") and "resume" not in data["title"].lower():
        cv_obj["headline"] = data["title"].upper()

    if contact.get("email"):
        cv_obj["email"] = contact["email"].strip()
    if contact.get("location"):
        cv_obj["location"] = contact["location"].strip()
    if contact.get("phone"):
        raw_phone = contact["phone"].strip()
        try:
            import phonenumbers
            parsed = phonenumbers.parse(raw_phone, "US" if not raw_phone.startswith("+") else None)
            if phonenumbers.is_valid_number(parsed):
                cv_obj["phone"] = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        except Exception:
            pass
    if contact.get("website"):
        web = contact["website"].strip()
        if web.startswith("http://") or web.startswith("https://"):
            cv_obj["website"] = web
    if social_networks:
        cv_obj["social_networks"] = social_networks
    cv_obj["sections"] = sections

    return {
        "cv": cv_obj,
        "design": design_dict
    }

def compile_pdf_bytes(cv_dict: Dict[str, Any], signature_image: Optional[str] = None) -> tuple[bytes, int]:
    """Compiles a RenderCV dictionary into PDF bytes, calculates page count, and stamps digital signature if provided."""
    yaml_str = yaml.dump(cv_dict, sort_keys=False, allow_unicode=True)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_yaml_path = os.path.join(tmpdir, "cv.yaml")
        with open(input_yaml_path, "w", encoding="utf-8") as f:
            f.write(yaml_str)

        cmd = [
            sys.executable,
            "-m",
            "rendercv",
            "render",
            "cv.yaml",
            "--dont-generate-markdown",
            "--dont-generate-html",
            "--dont-generate-png"
        ]

        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"

        result = subprocess.run(
            cmd,
            cwd=tmpdir,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=env,
            timeout=45
        )
        if result.returncode != 0:
            raise RuntimeError(f"RenderCV compilation failed: {result.stderr or result.stdout}")

        output_dir = os.path.join(tmpdir, "rendercv_output")
        pdf_path = None
        if os.path.exists(output_dir):
            for f in os.listdir(output_dir):
                if f.endswith(".pdf"):
                    pdf_path = os.path.join(output_dir, f)
                    break

        if not pdf_path or not os.path.exists(pdf_path):
            raise RuntimeError("RenderCV succeeded but PDF file was not found")

        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()

        page_count = 1
        try:
            import pymupdf
            import base64
            doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
            page_count = len(doc)

            if signature_image and page_count > 0:
                try:
                    data_url = signature_image
                    if "," in data_url:
                        raw_b64 = data_url.split(",", 1)[1]
                    else:
                        raw_b64 = data_url
                    img_bytes = base64.b64decode(raw_b64)
                    last_page = doc[-1]
                    matches = last_page.search_for("Signature:") or last_page.search_for("Signature")
                    if matches:
                        rect = matches[-1]
                        sig_rect = pymupdf.Rect(rect.x1 + 4, rect.y0 - 12, rect.x1 + 84, rect.y1 + 4)
                        last_page.insert_image(sig_rect, stream=img_bytes)
                        pdf_bytes = doc.tobytes()
                except Exception as e:
                    logger.warning(f"Failed to embed signature into PDF: {e}")
        except Exception:
            pass

        return pdf_bytes, page_count

@app.post("/render")
def render_cv(request: RenderRequest):
    theme = request.theme or "classic"
    if theme not in SUPPORTED_THEMES:
        theme = "classic"

    if request.yaml_content:
        cv_dict = yaml.safe_load(request.yaml_content)
    elif request.resume_data:
        cv_dict = json_to_rendercv_dict(request.resume_data, theme)
    else:
        raise HTTPException(status_code=400, detail="Either yaml_content or resume_data must be provided")

    try:
        sig_img = None
        if request.resume_data and request.resume_data.get("declaration"):
            if request.resume_data["declaration"].get("enabled"):
                sig_img = request.resume_data["declaration"].get("signature_image")
        pdf_bytes, page_count = compile_pdf_bytes(cv_dict, signature_image=sig_img)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="resume.pdf"',
                "Content-Type": "application/pdf",
                "X-Page-Count": str(page_count),
                "Access-Control-Expose-Headers": "X-Page-Count",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AutoAdjustRequest(BaseModel):
    resume_data: Dict[str, Any]
    target_pages: Optional[int] = 1
    theme: Optional[str] = "classic"

REFLOW_TIERS = [
    {
        "name": "Standard",
        "font_size": "10pt",
        "margins": {"top": "0.75in", "bottom": "0.75in", "left": "0.75in", "right": "0.75in"},
        "line_spacing": "0.6em",
        "space_between_entries": "1.2em",
    },
    {
        "name": "Compact",
        "font_size": "9.8pt",
        "margins": {"top": "0.65in", "bottom": "0.65in", "left": "0.65in", "right": "0.65in"},
        "line_spacing": "0.55em",
        "space_between_entries": "1.0em",
    },
    {
        "name": "Tight",
        "font_size": "9.5pt",
        "margins": {"top": "0.55in", "bottom": "0.55in", "left": "0.55in", "right": "0.55in"},
        "line_spacing": "0.50em",
        "space_between_entries": "0.85em",
    },
    {
        "name": "Ultra-tight (Floor)",
        "font_size": "9.2pt",
        "margins": {"top": "0.50in", "bottom": "0.50in", "left": "0.50in", "right": "0.50in"},
        "line_spacing": "0.45em",
        "space_between_entries": "0.75em",
    },
]

@app.post("/auto-adjust")
def auto_adjust(request: AutoAdjustRequest):
    theme = request.theme or "classic"
    target_pages = request.target_pages or 1
    data = dict(request.resume_data)

    best_candidate = REFLOW_TIERS[0]
    best_page_count = 99

    for cand in REFLOW_TIERS:
        data["design"] = cand
        cv_dict = json_to_rendercv_dict(data, theme)
        try:
            _, page_count = compile_pdf_bytes(cv_dict)
            best_page_count = page_count
            best_candidate = cand
            if page_count <= target_pages:
                return {
                    "fitted": True,
                    "target_pages": target_pages,
                    "achieved_pages": page_count,
                    "design": cand,
                    "message": f"Successfully fit resume to {page_count} page using {cand['name']} spacing."
                }
        except Exception as e:
            print(f"Auto-adjust candidate error on {cand['name']}: {e}")
            continue

    return {
        "fitted": False,
        "target_pages": target_pages,
        "achieved_pages": best_page_count,
        "design": REFLOW_TIERS[-1],
        "message": f"Applied maximum safe compaction ({REFLOW_TIERS[-1]['font_size']} font, 0.5in margins). Content still spans {best_page_count} pages and needs trimming."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
