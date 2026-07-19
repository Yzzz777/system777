import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNotifications, createNotification, markNotificationRead, markAllNotificationsRead } from "@/lib/db";
import { z } from "zod";



const notificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCookie(cookie: string): any {
  try { return JSON.parse(atob(cookie)); } catch { return null; }
}

async function getUserId(req: NextRequest): Promise<string | null> {
  const session = await auth().catch(() => null);
  if (session?.user?.id) return session.user.id;
  const cookie = req.cookies.get("system777_session")?.value;
  if (cookie) {
    const data = parseCookie(cookie);
    if (data?.user?.id) return String(data.user.id);
    if (data?.id) return String(data.id);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const notifications = await getNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unreadCount });
  } catch (err: unknown) {
    console.error("Notifications GET error:", err);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
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

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationId } = body;

    if (action === "read" && notificationId) {
      await markNotificationRead(notificationId);
    } else if (action === "readAll") {
      await markAllNotificationsRead(userId);
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
