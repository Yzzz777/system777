import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNotifications, createNotification, markNotificationRead, markAllNotificationsRead } from "@/lib/db";
import { z } from "zod";

export const runtime = "edge";

const notificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const notifications = await getNotifications(session.user.id);
    const unreadCount = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unreadCount });
  } catch (err: unknown) {
    console.error("Notifications GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = notificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const notification = await createNotification({
      userId: parsed.data.userId,
      title: parsed.data.title,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true, notification });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationId } = body;

    if (action === "read" && notificationId) {
      await markNotificationRead(notificationId);
    } else if (action === "readAll") {
      await markAllNotificationsRead(session.user.id);
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
