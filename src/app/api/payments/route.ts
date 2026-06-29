import { NextResponse } from "next/server";
import { createPayment, getAllPayments } from "@/lib/db";
import { z } from "zod";

export const runtime = "edge";

const paymentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  amount: z.coerce.number().min(0),
  method: z.enum(["banreservas", "paypal"]),
  reference: z.string().optional(),
  type: z.enum(["course", "subscription"]).default("subscription"),
  planOrCourse: z.string().optional(),
});

export async function GET() {
  try {
    const payments = await getAllPayments();
    return NextResponse.json({ payments });
  } catch (err: unknown) {
    console.error("Payments GET error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {
        name: formData.get("name") as string || "",
        email: formData.get("email") as string || "",
        phone: formData.get("phone") as string || "",
        amount: formData.get("amount") as string || "0",
        method: formData.get("method") as string || "banreservas",
        reference: formData.get("reference") as string || "",
        type: formData.get("type") as string || "subscription",
        planOrCourse: formData.get("planOrCourse") as string || "",
      };
    } else {
      const body = await request.json();
      data = {
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        amount: String(body.amount || 0),
        method: body.method || "banreservas",
        reference: body.reference || "",
        type: body.type || "subscription",
        planOrCourse: body.planOrCourse || "",
      };
    }

    const parsed = paymentSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const payment = await createPayment({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      amount: parsed.data.amount,
      method: parsed.data.method,
      reference: parsed.data.reference,
      type: parsed.data.type,
      planOrCourse: parsed.data.planOrCourse,
    });

    try {
      const { sendPaymentConfirmation } = await import("@/lib/email");
      await sendPaymentConfirmation({
        to: parsed.data.email,
        name: parsed.data.name,
        type: parsed.data.type === "course" ? "course" : "subscription",
        planOrCourse: parsed.data.planOrCourse,
        amount: parsed.data.amount,
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
        message: `${parsed.data.name} (${parsed.data.email}) ha enviado un pago de $${parsed.data.amount} por ${parsed.data.method === "paypal" ? "PayPal" : "Transferencia Banreservas"}. Referencia: ${parsed.data.reference || "N/A"}.`,
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
