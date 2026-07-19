import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllPayments, updatePaymentStatus } from "@/lib/db";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const payments = await getAllPayments();
    return NextResponse.json({ payments });
  } catch (err: unknown) {
    console.error("Admin payments GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id y status son requeridos" }, { status: 400 });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updated = await updatePaymentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment: updated });
  } catch (err: unknown) {
    console.error("Admin payments PUT error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
