import os
import requests
import pymupdf

SAMPLE_RESUME = {
    "contact": {
        "name": "Alex Morgan",
        "email": "alex.morgan@example.com",
        "phone": "+1 512 555 0199",
        "location": "Austin, TX",
        "website": "https://alexmorgan.dev",
        "linkedin": "https://linkedin.com/in/alexmorgan",
        "github": "https://github.com/alexmorgan"
    },
    "experience": [
        {
            "company": "TechCorp Systems",
            "position": "Senior Software Engineer",
            "location": "San Francisco, CA",
            "start_date": "2022-03",
            "end_date": "present",
            "highlights": [
                "Architected distributed microservices platform processing 45M requests daily with 99.99% uptime.",
                "Optimized database query pipelines reducing average p99 latency from 320ms to 48ms.",
                "Mentored 6 junior engineers and established engineering design review standards."
            ]
        },
        {
            "company": "CloudScale Inc",
            "position": "Software Engineer",
            "location": "Austin, TX",
            "start_date": "2020-01",
            "end_date": "2022-02",
            "highlights": [
                "Built customer onboarding workflow adopted by 120k active business accounts.",
                "Implemented automated CI/CD pipelines cutting deployment time by 60%."
            ]
        }
    ],
    "education": [
        {
            "institution": "University of Texas at Austin",
            "area": "Computer Science",
            "degree": "B.S.",
            "start_date": "2016-08",
            "end_date": "2020-05",
            "location": "Austin, TX",
            "highlights": ["Dean's Honor List", "Algorithms Teaching Assistant"]
        }
    ],
    "skills": [
        {
            "category": "Languages",
            "items": ["TypeScript", "Python", "Go", "SQL", "Rust"]
        },
        {
            "category": "Frameworks",
            "items": ["React", "Next.js", "FastAPI", "Node.js", "Docker"]
        }
    ]
}

THEMES = [
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

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "template-previews"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

for theme in THEMES:
    print(f"Generating preview for {theme}...")
    try:
        resp = requests.post(
            "http://127.0.0.1:8000/render",
            json={"resume_data": SAMPLE_RESUME, "theme": theme},
            timeout=30
        )
        if resp.status_code != 200:
            print(f"Failed to render {theme}: {resp.status_code}")
            continue

        doc = pymupdf.open(stream=resp.content, filetype="pdf")
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=150)
        out_path = os.path.join(OUTPUT_DIR, f"{theme}.png")
        pix.save(out_path)
        print(f"Saved {theme}.png")
    except Exception as e:
        print(f"Error on {theme}: {e}")

print("Done generating previews.")
