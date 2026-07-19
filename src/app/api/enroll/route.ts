import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { enrollUser, getUserEnrollment, getUserEnrollments, updateEnrollmentProgress } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Debes iniciar sesión para inscribirte" }, { status: 401 });
    }

    const body = await request.json();
    const { courseSlug } = body;

    if (!courseSlug) {
      return NextResponse.json({ error: "courseSlug requerido" }, { status: 400 });
    }

    const enrollment = await enrollUser(session.user.id, courseSlug);
    return NextResponse.json({ success: true, enrollment });
  } catch (err: unknown) {
    console.error("Enroll error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }

    const url = new URL(request.url);
    const courseSlug = url.searchParams.get("course");

    if (courseSlug) {
      const enrollment = await getUserEnrollment(session.user.id, courseSlug);
      return NextResponse.json({ enrollment });
    }

    const enrollments = await getUserEnrollments(session.user.id);
    return NextResponse.json({ enrollments });
  } catch (err: unknown) {
    console.error("Enroll GET error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }

    const body = await request.json();
    const { courseSlug, progress } = body;

    if (!courseSlug || progress === undefined) {
      return NextResponse.json({ error: "courseSlug y progress requeridos" }, { status: 400 });
    }

    await updateEnrollmentProgress(session.user.id, courseSlug, progress);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Enroll PUT error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
