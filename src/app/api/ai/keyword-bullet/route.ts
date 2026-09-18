import { NextResponse } from "next/server";
import { z } from "zod";
import { generateKeywordBullet } from "@/lib/ai/gemini";

const keywordBulletSchema = z.object({
  keyword: z.string().min(1, "Keyword required"),
  position: z.string().min(1, "Position title required"),
  company: z.string().optional(),
  current_highlights: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = keywordBulletSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { keyword, position, company, current_highlights } = validated.data;
    const bullet = await generateKeywordBullet(keyword, position, company, current_highlights);

    return NextResponse.json({ bullet });
  } catch (error: any) {
    console.error("AI keyword bullet error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate keyword bullet" },
      { status: 500 }
    );
  }
}
