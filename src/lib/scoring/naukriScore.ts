import { ResumeData } from "@/types/resume";

export interface NaukriCheckItem {
  id: string;
  title: string;
  passed: boolean;
  impact: "High" | "Medium" | "Low";
  tip: string;
}

export interface NaukriScoreResult {
  score: number; // 0 - 100
  label: "Not Optimized" | "Moderately Optimized" | "Naukri Preferred";
  checklist: NaukriCheckItem[];
}

const INDIAN_TECH_HUBS = [
  "bangalore", "bengaluru", "hyderabad", "pune", "delhi", "ncr", "noida", 
  "gurgaon", "gurugram", "mumbai", "chennai", "kolkata", "ahmedabad"
];

/**
 * Calculates Naukri ATS Optimization score and returns recruiter search checklist.
 * Based on Naukri recruiter search indexing patterns and keyword density rules.
 */
export function calculateNaukriScore(resume: ResumeData): NaukriScoreResult {
  const checklist: NaukriCheckItem[] = [];

  // 1. Notice Period Check (Naukri recruiters' #1 filter for fast shortlisting)
  const notice = (resume.contact?.notice_period || "").trim().toLowerCase();
  const noticePassed = Boolean(
    notice && (
      notice.includes("immediate") || 
      notice.includes("day") || 
      notice.includes("month") || 
      notice.includes("serving")
    )
  );
  checklist.push({
    id: "notice_period",
    title: "Declared Notice Period",
    passed: noticePassed,
    impact: "High",
    tip: noticePassed 
      ? "Notice period is specified. Indian recruiters prioritize profiles with explicit notice periods (Immediate, 15-30 days)."
      : "Add your notice period (e.g. 'Immediate / 15 Days') in Contact details. Over 70% of Naukri recruiters filter by notice period.",
  });

  // 2. Phone with +91 Country Code Check
  const phone = (resume.contact?.phone || "").trim();
  const phonePassed = phone.includes("+91") || (phone.replace(/[^0-9]/g, "").length === 10);
  checklist.push({
    id: "phone_format",
    title: "+91 Mobile Number Verification",
    passed: phonePassed,
    impact: "High",
    tip: phonePassed 
      ? "Mobile number format is valid for Indian recruiter SMS & call routing."
      : "Format phone number with +91 country code (e.g. +91 98765 43210) for automated candidate parsers.",
  });

  // 3. Indian Tech Hub / City Filter
  const location = (resume.contact?.location || "").toLowerCase();
  const locationPassed = location.length > 2;
  const isMajorHub = INDIAN_TECH_HUBS.some((hub) => location.includes(hub));
  checklist.push({
    id: "location_hub",
    title: "City / Preferred Job Location",
    passed: locationPassed,
    impact: "Medium",
    tip: isMajorHub
      ? `Target city '${resume.contact?.location}' matches a top tier Indian IT hiring corridor.`
      : "Explicitly state your current city or preferred base (e.g. 'Bengaluru, India') for geographic radius filters.",
  });

  // 4. Categorized Skills Indexability (Naukri Keyword Density)
  const skills = resume.skills || [];
  let totalSkills = 0;
  skills.forEach((s) => {
    totalSkills += Array.isArray(s.items) ? s.items.length : 0;
  });
  const skillsPassed = skills.length >= 2 && totalSkills >= 8;
  checklist.push({
    id: "skills_density",
    title: "Comma-Separated Skills Indexing",
    passed: skillsPassed,
    impact: "High",
    tip: skillsPassed
      ? `Strong skill coverage (${totalSkills} skills across ${skills.length} categories) for search queries.`
      : "Include at least 8-12 technical skills across languages, frameworks, and databases so Naukri search bots tag you.",
  });

  // 5. Academic Cutoff & Marks (10th/12th/Degree percentages)
  const education = resume.education || [];
  const hasAcademicScores = education.some((edu) => 
    Boolean(edu.cgpa_or_percentage && edu.cgpa_or_percentage.trim().length > 0)
  );
  checklist.push({
    id: "academic_marks",
    title: "CGPA / Percentage Cutoff Clearance",
    passed: hasAcademicScores,
    impact: "Medium",
    tip: hasAcademicScores
      ? "Academic scores (CGPA/%) are declared for campus drive cutoff screening."
      : "Indian campus and fresher drives (TCS, Infosys, Wipro, Capgemini) mandate 60%+ / 6.5 CGPA criteria. Add your marks in Education.",
  });

  // 6. Professional Role Target / Summary
  const role = (resume.target_role || "").trim();
  const summary = (resume.summary || "").trim();
  const rolePassed = Boolean(role.length > 2 || summary.length > 30);
  checklist.push({
    id: "target_designation",
    title: "Target IT Designation & Headline",
    passed: rolePassed,
    impact: "Medium",
    tip: rolePassed
      ? `Designation specified: '${role || "Target Role Defined"}'.`
      : "Specify your exact target job designation (e.g. 'Junior Full Stack Developer' or 'Java Backend Engineer').",
  });

  // Calculate Naukri ATS score
  const passedCount = checklist.filter((c) => c.passed).length;
  const rawScore = Math.round((passedCount / checklist.length) * 100);

  let label: "Not Optimized" | "Moderately Optimized" | "Naukri Preferred" = "Not Optimized";
  if (rawScore >= 80) {
    label = "Naukri Preferred";
  } else if (rawScore >= 50) {
    label = "Moderately Optimized";
  }

  return {
    score: rawScore,
    label,
    checklist,
  };
}
