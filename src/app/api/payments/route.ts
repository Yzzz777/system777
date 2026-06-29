import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const paymentSchema = z.object({
  type: z.enum(["course", "subscription"]),
  planOrCourse: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  amount: z.number().min(0),
  reference: z.string().min(1),
});

const payments: {
  id: string;
  type: string;
  planOrCourse: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  reference: string;
  status: string;
  createdAt: string;
}[] = [];

export async function GET() {
  return NextResponse.json({ payments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const data = parsed.data;
    const payment = {
      id: Date.now().toString(36),
      ...data,
      phone: data.phone || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    payments.push(payment);

    try {
      const { sendPaymentConfirmation } = await import("@/lib/email");
      await sendPaymentConfirmation({
        to: data.email,
        name: data.name,
        type: data.type === "course" ? "course" : "subscription",
        planOrCourse: data.planOrCourse,
        amount: data.amount,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    try {
      const { sendWhatsAppNotification } = await import("@/lib/email");
      await sendWhatsAppNotification({
        to: "rksagmita@jrsystem7777.com",
        name: "Admin",
        subject: "Nuevo pago recibido",
        message: `${data.name} (${data.email}) ha enviado un pago de $${data.amount} por ${data.type === "course" ? "curso" : "plan"} ${data.planOrCourse}. Referencia: ${data.reference}. Teléfono: ${data.phone || "N/A"}.`,
      });
    } catch (emailErr) {
      console.error("Email notification error:", emailErr);
    }

    return NextResponse.json({ success: true, payment });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
