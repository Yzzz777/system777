import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const meetingSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string(),
  duration: z.string().default("30"),
});

const meetings: {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  hostId: string;
  createdAt: string;
}[] = [];

export async function GET() {
  return NextResponse.json({ meetings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = meetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { title, description, date, time, duration } = parsed.data;
    const meetingId = Date.now().toString(36);
    const meetingLink = `https://zoom.us/j/system777?pwd=${Buffer.from(meetingId).toString("base64").slice(0, 16)}`;

    const meeting = {
      id: meetingId,
      title,
      description: description || "",
      date,
      time,
      duration: parseInt(duration),
      meetingLink,
      hostId: "current-user",
      createdAt: new Date().toISOString(),
    };

    meetings.push(meeting);

    try {
      const { sendMeetingInvite } = await import("@/lib/email");
      await sendMeetingInvite({
        to: "rksagmita@jrsystem7777.com",
        hostName: "System 777",
        title,
        date,
        time,
        duration: parseInt(duration),
        meetingLink,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return NextResponse.json({ success: true, meeting });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
