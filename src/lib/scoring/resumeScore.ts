import { ResumeData } from "@/types/resume";

/**
 * 150+ high-impact resume action verbs (past and present tense)
 * commonly recommended by top recruiters, career centers, and ATS benchmarks.
 */
export const ACTION_VERBS = new Set([
  // Leadership & Management
  "accelerated", "accelerate", "achieved", "achieve", "administered", "administer",
  "spearheaded", "spearhead", "orchestrated", "orchestrate", "architected", "architect",
  "directed", "direct", "championed", "champion", "founded", "found", "headed", "head",
  "guided", "guide", "mentored", "mentor", "managed", "manage", "supervised", "supervise",
  "oversaw", "oversee", "delegated", "delegate", "steered", "steer", "navigated", "navigate",
  // Engineering & Technical
  "engineered", "engineer", "developed", "develop", "built", "build", "designed", "design",
  "programmed", "program", "coded", "code", "deployed", "deploy", "configured", "configure",
  "integrated", "integrate", "automated", "automate", "refactored", "refactor", "optimized",
  "optimize", "debugged", "debug", "migrated", "migrate", "scaled", "scale", "implemented",
  "implement", "upgraded", "upgrade", "modernized", "modernize", "modeled", "model",
  // Execution & Delivery
  "launched", "launch", "delivered", "deliver", "executed", "execute", "produced", "produce",
  "established", "establish", "created", "create", "authored", "author", "formulated", "formulate",
  "generated", "generate", "initiated", "initiate", "instituted", "institute", "pioneered", "pioneer",
  // Analysis & Strategy
  "analyzed", "analyze", "evaluated", "evaluate", "audited", "audit", "identified", "identify",
  "benchmarked", "benchmark", "quantified", "quantify", "researched", "research", "diagnosed", "diagnose",
  "discovered", "discover", "forecasted", "forecast", "mapped", "map", "measured", "measure",
  // Improvement & Financial Impact
  "increased", "increase", "reduced", "reduce", "decreased", "decrease", "saved", "save",
  "boosted", "boost", "elevated", "elevate", "expanded", "expand", "maximized", "maximize",
  "minimized", "minimize", "transformed", "transform", "revamped", "revamp", "streamlined", "streamline",
  "capitalized", "capitalize", "negotiated", "negotiate", "secured", "secure", "captured", "capture",
  // Communication & Collaboration
  "collaborated", "collaborate", "partnered", "partner", "presented", "present", "published", "publish",
  "trained", "train", "coached", "coach", "facilitated", "facilitate", "negotiated", "negotiate",
  "advocated", "advocate", "consulted", "consult", "liaised", "liaise", "coordinated", "coordinate"
]);

// Metric detection pattern (numbers, percentages, currency, multipliers, scale units)
const METRIC_REGEX = /(\d+|%|\$|€|£|₹|\b\d+k\b|\b\d+m\b|\b\d+x\b)/i;

export interface ScoreSubcategory {
  label: string;
  points: number;
  maxPoints: number;
  tip?: string;
}

export interface ResumeScoreResult {
  score: number;
  label: "Needs work" | "Good" | "Excellent";
  colorClass: string;
  breakdown: ScoreSubcategory[];
}

/**
 * Deterministically scores a resume on a 0-100 scale.
 * Pure function: runs synchronously in < 2ms without AI API costs or network latency.
 */
export function calculateResumeScore(resume: ResumeData): ResumeScoreResult {
  const breakdown: ScoreSubcategory[] = [];

  // 1. Contact Information Completeness (10 pts)
  let contactPoints = 0;
  const contact = resume.contact || ({} as any);
  if (contact.email?.trim()) contactPoints += 3.5;
  if (contact.phone?.trim()) contactPoints += 3.5;
  if (contact.location?.trim()) contactPoints += 3;
  contactPoints = Math.round(contactPoints);
  breakdown.push({
    label: "Contact details",
    points: contactPoints,
    maxPoints: 10,
    tip: contactPoints < 10 ? "Include your email, phone, and city/state for recruiters." : undefined,
  });

  // 2. Professional Summary (10 pts)
  let summaryPoints = 0;
  const summaryText = (resume.summary || "").trim();
  const summaryWordCount = summaryText ? summaryText.split(/\s+/).length : 0;
  if (summaryWordCount >= 20 && summaryWordCount <= 60) {
    summaryPoints = 10;
  } else if (summaryWordCount > 0 && summaryWordCount < 20) {
    summaryPoints = 5;
  } else if (summaryWordCount > 60) {
    summaryPoints = 6;
  }
  breakdown.push({
    label: "Professional summary",
    points: summaryPoints,
    maxPoints: 10,
    tip: summaryPoints < 10 ? "Add a 20-60 word career summary highlighting your core expertise." : undefined,
  });

  // 3. Work Experience Bullets Impact (40 pts)
  const experiences = resume.experience || [];
  let expPoints = 0;
  const totalEntries = experiences.length;

  if (totalEntries > 0) {
    let entryScoreAccumulator = 0;
    experiences.forEach((exp) => {
      const bullets = exp.highlights || [];
      let entryScore = 0;

      // >= 2 bullets check (up to 40% of entry score)
      if (bullets.length >= 2) {
        entryScore += 4;
      } else if (bullets.length === 1) {
        entryScore += 2;
      }

      // Check action verbs and metrics per bullet
      let verbHits = 0;
      let metricHits = 0;

      bullets.forEach((bullet) => {
        const clean = bullet.trim();
        const firstWord = clean.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "").toLowerCase();
        if (firstWord && ACTION_VERBS.has(firstWord)) {
          verbHits++;
        }
        if (METRIC_REGEX.test(clean)) {
          metricHits++;
        }
      });

      const bulletCount = bullets.length || 1;
      const verbRatio = Math.min(1, verbHits / bulletCount);
      const metricRatio = Math.min(1, metricHits / bulletCount);

      // Add verb and metric scores (up to 6 points)
      entryScore += (verbRatio * 3) + (metricRatio * 3);
      entryScoreAccumulator += Math.min(10, entryScore);
    });

    // Prorate across total entries up to 40 points
    const avgEntryScore = entryScoreAccumulator / totalEntries;
    expPoints = Math.round((avgEntryScore / 10) * 40);
  }

  breakdown.push({
    label: "Experience bullet impact",
    points: expPoints,
    maxPoints: 40,
    tip: expPoints < 32 ? "Start each bullet with an action verb and include a number, %, or metric." : undefined,
  });

  // 4. Bullet Character Length / Readability (10 pts)
  let lengthPoints = 10;
  let hasOverlongBullet = false;
  experiences.forEach((exp) => {
    (exp.highlights || []).forEach((b) => {
      if (b.length > 220) {
        hasOverlongBullet = true;
      }
    });
  });
  if (hasOverlongBullet) {
    lengthPoints = 4;
  }
  breakdown.push({
    label: "Bullet conciseness",
    points: lengthPoints,
    maxPoints: 10,
    tip: hasOverlongBullet ? "Trim bullets exceeding 220 characters to maintain clean ATS readability." : undefined,
  });

  // 5. Skills Section Breadth (10 pts)
  const skills = resume.skills || [];
  let totalSkillItems = 0;
  skills.forEach((s) => {
    totalSkillItems += Array.isArray(s.items) ? s.items.length : 0;
  });
  let skillsPoints = 0;
  if (skills.length >= 2 && totalSkillItems >= 5) {
    skillsPoints = 10;
  } else if (totalSkillItems >= 3) {
    skillsPoints = 6;
  } else if (totalSkillItems > 0) {
    skillsPoints = 3;
  }
  breakdown.push({
    label: "Skills breadth",
    points: skillsPoints,
    maxPoints: 10,
    tip: skillsPoints < 10 ? "Include at least 5 skills across 2 or more distinct categories." : undefined,
  });

  // 6. Page Length Heuristic (10 pts)
  // Calculate total career span in years
  let totalYears = 0;
  experiences.forEach((exp) => {
    const startYear = parseInt((exp.start_date || "").slice(0, 4), 10);
    const endYear = exp.end_date?.toLowerCase() === "present"
      ? new Date().getFullYear()
      : parseInt((exp.end_date || "").slice(0, 4), 10);
    if (!isNaN(startYear) && !isNaN(endYear) && endYear >= startYear) {
      totalYears += (endYear - startYear);
    }
  });

  // Simple heuristic: <= 6 years experience should fit 1 page (~30 total lines)
  let pagePoints = 10;
  const totalBullets = experiences.reduce((acc, e) => acc + (e.highlights?.length || 0), 0);
  if (totalYears <= 6 && totalBullets > 12) {
    pagePoints = 6;
  }
  breakdown.push({
    label: "Length & page fit",
    points: pagePoints,
    maxPoints: 10,
    tip: pagePoints < 10 ? "Keep total experience bullets under 12 for a tight 1-page resume." : undefined,
  });

  // 7. Education Completeness (10 pts)
  const education = resume.education || [];
  let eduPoints = 0;
  if (education.length > 0) {
    const primary = education[0];
    if (primary.institution?.trim()) eduPoints += 4;
    if (primary.degree?.trim()) eduPoints += 3;
    if (primary.area?.trim()) eduPoints += 3;
  }
  breakdown.push({
    label: "Education completeness",
    points: eduPoints,
    maxPoints: 10,
    tip: eduPoints < 10 ? "Ensure your degree, institution, and field of study are all specified." : undefined,
  });

  // Total Score (0-100)
  const totalScore = Math.min(100, Math.max(0, breakdown.reduce((acc, b) => acc + b.points, 0)));

  let label: "Needs work" | "Good" | "Excellent" = "Needs work";
  let colorClass = "text-red-500 stroke-red-500";
  if (totalScore >= 80) {
    label = "Excellent";
    colorClass = "text-teal-600 stroke-teal-600";
  } else if (totalScore >= 50) {
    label = "Good";
    colorClass = "text-amber-500 stroke-amber-500";
  }

  return {
    score: totalScore,
    label,
    colorClass,
    breakdown,
  };
}
