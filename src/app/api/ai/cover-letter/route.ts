import { NextResponse } from "next/server";
import { z } from "zod";
import { generateCoverLetter } from "@/lib/ai/gemini";

const coverLetterSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
  contact_name: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  position_highlight: z.string().optional(),
  education_highlight: z.string().optional(),
  key_skills: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = coverLetterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const {
      company_name,
      job_title,
      contact_name,
      contact_email,
      contact_phone,
      position_highlight,
      education_highlight,
      key_skills,
    } = validated.data;

    const letter = await generateCoverLetter({
      companyName: company_name,
      jobTitle: job_title,
      contactName: contact_name,
      contactEmail: contact_email,
      contactPhone: contact_phone,
      positionHighlight: position_highlight,
      educationHighlight: education_highlight,
      keySkills: key_skills,
    });

    return NextResponse.json({ cover_letter: letter });
  } catch (error: any) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
