import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature") || "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret no configurado" }, { status: 500 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
    }

    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(stripeKey);

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signature verification failed";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email || session.customer_details?.email;
      const name = session.metadata?.customerName || session.customer_details?.name;
      const type = session.metadata?.type;

      if (email && name) {
        try {
          const { sendPaymentConfirmation } = await import("@/lib/email");
          await sendPaymentConfirmation({
            to: email,
            name,
            type: type === "course" ? "course" : "subscription",
            planOrCourse: type === "course" ? session.metadata?.courseSlug : session.metadata?.planId,
            amount: (session.amount_total || 0) / 100,
          });
        } catch (emailErr) {
          console.error("Error sending confirmation email:", emailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook error";
    console.error("Webhook error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
