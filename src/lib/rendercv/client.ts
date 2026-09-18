import { ResumeData, RenderCVTheme } from "@/types/resume";

const RENDERCV_SERVICE_URL = process.env.RENDERCV_SERVICE_URL || "http://127.0.0.1:8000";

/**
 * Calls the RenderCV microservice over HTTP to compile a ResumeData object into an ATS PDF.
 */
export async function renderPdfWithRenderCV(
  resume: ResumeData,
  theme?: RenderCVTheme
): Promise<ArrayBuffer> {
  const chosenTheme = theme || resume.template || "engineeringresumes";

  const response = await fetch(`${RENDERCV_SERVICE_URL}/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme: chosenTheme,
      resume_data: resume,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RenderCV service error (${response.status}): ${errorText}`);
  }

  return await response.arrayBuffer();
}
