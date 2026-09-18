import { NextResponse } from "next/server";
import { renderPdfWithRenderCV } from "@/lib/rendercv/client";
import { ResumeData } from "@/types/resume";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeData: ResumeData = body.resume_data || body.resume;
    const theme = body.theme || resumeData?.template || "engineeringresumes";

    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 });
    }

    const pdfBuffer = await renderPdfWithRenderCV(resumeData, theme);

    const safeTitle = (resumeData.contact?.name || "Resume")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

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
      { error: error.message || "Failed to compile ATS PDF via RenderCV" },
      { status: 500 }
    );
  }
}
