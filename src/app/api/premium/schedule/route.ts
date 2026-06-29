import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const scheduleSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string(),
  topic: z.string().min(3),
  notes: z.string().optional(),
});

const bookings: {
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  notes: string;
  zoomLink: string;
  createdAt: Date;
}[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = scheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, date, time, topic, notes } = parsed.data;

    const conflict = bookings.find((b) => b.date === date && b.time === time);
    if (conflict) {
      return NextResponse.json({ error: "Este horario ya está ocupado. Elige otro." }, { status: 409 });
    }

    const zoomLink = `https://zoom.us/j/system777?pwd=${Buffer.from(date + time).toString("base64").slice(0, 16)}`;

    bookings.push({ name, email, date, time, topic, notes: notes || "", zoomLink, createdAt: new Date() });

    try {
      const { sendZoomConfirmation } = await import("@/lib/email");
      await sendZoomConfirmation({ to: email, name, date, time, topic, zoomLink });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      booking: { date, time, topic, zoomLink },
      message: "Clase agendada. Recibirás un correo con los detalles.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
