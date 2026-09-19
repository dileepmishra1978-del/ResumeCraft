import { NextResponse } from "next/server";
import { ResumeData } from "@/types/resume";
import { optimize1PageFit } from "@/lib/pdf/vector-pdf";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeData: ResumeData = body.resume_data || body.resume;
    const targetPages: number = body.target_pages || 1;
    const theme = body.theme || resumeData?.template || "classic";

    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 });
    }

    try {
      const serviceUrl = process.env.RENDERCV_SERVICE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${serviceUrl}/auto-adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_data: resumeData,
          target_pages: targetPages,
          theme,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        return NextResponse.json(result);
      }
    } catch {
      // Microservice offline / Vercel serverless environment
    }

    // High-performance native 1-Page Fit optimizer
    const result = optimize1PageFit(resumeData, targetPages);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Auto adjust error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to auto adjust resume" },
      { status: 500 }
    );
  }
}
