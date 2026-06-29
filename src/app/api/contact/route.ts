import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db";
import { z } from "zod";

export const runtime = "edge";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await createContactMessage(parsed.data);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Contact error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
