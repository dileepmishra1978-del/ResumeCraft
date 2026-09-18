import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const DEFAULT_RESUME: import("@/types/resume").ResumeData = {
  id: "default-resume",
  title: "Software Engineer Resume",
  target_role: "Fullstack Engineer",
  template: "engineeringresumes",
  contact: {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 206 555 0100",
    location: "Seattle, WA",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/alexrivera"
  },
  experience: [
    {
      id: "exp-1",
      company: "TechScale Inc.",
      position: "Senior Software Engineer",
      start_date: "2022-03",
      end_date: "present",
      location: "Seattle, WA",
      highlights: [
        "Architected distributed microservices handling 1.5M+ daily requests, reducing p99 latency by 38%",
        "Engineered real-time data streaming pipeline using Next.js, WebSockets, and Redis for 40,000 concurrent users",
        "Mentored team of 6 junior engineers and instituted automated CI/CD reducing release cycle from 3 days to 45 minutes"
      ]
    },
    {
      id: "exp-2",
      company: "CloudCore Systems",
      position: "Software Engineer",
      start_date: "2020-07",
      end_date: "2022-02",
      location: "San Francisco, CA",
      highlights: [
        "Built responsive client portals in React and TypeScript increasing user onboarding completion by 24%",
        "Optimized PostgreSQL queries and Redis caching, cutting average database response time from 240ms to 42ms"
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Washington",
      area: "Computer Science",
      degree: "B.S.",
      start_date: "2016-09",
      end_date: "2020-06",
      location: "Seattle, WA",
      highlights: ["Dean's List (all semesters)", "Capstone: Neural network optimization for edge hardware"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "PulseEngine - Realtime Analytics",
      description: "Open-source high-throughput telemetry collector",
      tools: ["Go", "Next.js", "ClickHouse", "Docker"],
      link: "https://github.com/alexrivera/pulse-engine",
      highlights: [
        "Achieved 1,200+ GitHub stars and adoption by 30+ production companies",
        "Processes 50,000 events/sec on a single $20/mo server instance"
      ]
    }
  ],
  skills: [
    {
      id: "sk-1",
      category: "Languages & Frameworks",
      items: ["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "SQL"]
    },
    {
      id: "sk-2",
      category: "Cloud & Infrastructure",
      items: ["AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Supabase", "Git"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023"
    }
  ]
};
