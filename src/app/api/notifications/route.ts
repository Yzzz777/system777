import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const notificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  link: z.string().optional(),
});

const notifications: { id: string; title: string; message: string; type: string; read: boolean; link?: string; createdAt: string }[] = [
  { id: "1", title: "Bienvenido a SYSTEM 777", message: "Tu cuenta ha sido creada exitosamente.", type: "success", read: false, createdAt: new Date().toISOString() },
  { id: "2", title: "Plan Premium", message: "Actualiza tu plan para acceder a todas las funcionalidades.", type: "info", read: false, link: "/premium/checkout", createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json({ notifications });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = notificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const notification = {
      id: Date.now().toString(),
      ...parsed.data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.push(notification);

    return NextResponse.json({ success: true, notification });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
