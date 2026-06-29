import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const usersResult = await sql`SELECT COUNT(*) as count FROM users`;
    const messagesResult = await sql`SELECT COUNT(*) as count FROM contact_messages`;
    const enrollmentsResult = await sql`SELECT COUNT(*) as count FROM enrollments`;

    return NextResponse.json({
      totalUsers: Number(usersResult[0]?.count || 0),
      totalMessages: Number(messagesResult[0]?.count || 0),
      totalEnrollments: Number(enrollmentsResult[0]?.count || 0),
      totalCourses: 20,
      totalRevenue: "$0",
      pageViews: "N/A",
    });
  } catch (err: unknown) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
