import { NextResponse } from "next/server";
import { renderPdfWithRenderCV } from "@/lib/rendercv/client";
import { buildResumePdf } from "@/lib/pdf/vector-pdf";
import { ResumeData, RenderCVTheme } from "@/types/resume";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeData: ResumeData = body.resume_data || body.resume;
    const theme: RenderCVTheme = body.theme || resumeData?.template || "engineeringresumes";

    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 });
    }

    const safeTitle = (resumeData.contact?.name || "Resume")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    let pdfBuffer: ArrayBuffer;

    try {
      // 1. Attempt RenderCV microservice if available
      pdfBuffer = await renderPdfWithRenderCV(resumeData, theme);
    } catch {
      // 2. High-performance ATS vector PDF compiler fallback (works 100% on Vercel)
      const doc = buildResumePdf(resumeData, theme);
      pdfBuffer = doc.output("arraybuffer");
    }

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}_ATS_Resume.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Export PDF error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
