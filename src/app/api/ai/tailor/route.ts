import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeAndTailorJob } from "@/lib/ai/gemini";

const tailorSchema = z.object({
  resume_text: z.string().min(20, "Resume text too short"),
  job_description: z.string().min(20, "Job description too short"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = tailorSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { resume_text, job_description } = validated.data;
    const analysis = await analyzeAndTailorJob(resume_text, job_description);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("AI tailor error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to tailor resume" },
      { status: 500 }
    );
  }
}
