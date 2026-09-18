import { NextResponse } from "next/server";
import { z } from "zod";
import { rewriteBulletPoint } from "@/lib/ai/gemini";

const rewriteSchema = z.object({
  bullet: z.string().min(3, "Bullet text too short"),
  role: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = rewriteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { bullet, role, company } = validated.data;
    const variations = await rewriteBulletPoint(bullet, role, company);

    return NextResponse.json({ variations });
  } catch (error: any) {
    console.error("AI rewrite error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to rewrite bullet point" },
      { status: 500 }
    );
  }
}
