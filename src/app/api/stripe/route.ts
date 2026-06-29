import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const stripeCheckoutSchema = z.object({
  type: z.enum(["course", "subscription"]),
  planId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
});

const coursePrices: Record<string, number> = {
  "react-complete": 2999,
  "nextjs-mastery": 3999,
  "ethical-hacking": 4999,
  "discord-js-bot": 1999,
  "nodejs-backend": 2999,
  "kubernetes-docker": 3999,
  "penetration-testing": 5999,
  "network-security": 2999,
  "react-native-mobile": 3499,
  "python-django": 3499,
  "cloud-aws": 3999,
  "malware-analysis": 6999,
};

const planPrices: Record<string, number> = {
  starter: 999,
  pro: 2999,
  enterprise: 9999,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = stripeCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { type, planId, email, name } = parsed.data;

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe no está configurado. Agrega STRIPE_SECRET_KEY en .env" }, { status: 500 });
    }

    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(stripeKey);

    let session;

    if (type === "course") {
      const amount = coursePrices[planId];
      if (!amount) {
        return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
      }

      session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `Curso Premium - ${planId.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
              description: "Acceso de por vida al curso",
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL || "https://jrsystem7777.com"}/dashboard?upgraded=true`,
        cancel_url: `${process.env.NEXTAUTH_URL || "https://jrsystem7777.com"}/premium/checkout?course=${planId}`,
        metadata: {
          type: "course",
          courseSlug: planId,
          customerName: name,
          customerEmail: email,
        },
      });
    } else {
      const amount = planPrices[planId];
      if (!amount) {
        return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
      }

      session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `Plan ${planId.charAt(0).toUpperCase() + planId.slice(1)} - SYSTEM 777`,
              description: "Suscripción mensual premium",
            },
            unit_amount: amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL || "https://jrsystem7777.com"}/dashboard?subscribed=true`,
        cancel_url: `${process.env.NEXTAUTH_URL || "https://jrsystem7777.com"}/premium/checkout`,
        metadata: {
          type: "subscription",
          planId,
          customerName: name,
          customerEmail: email,
        },
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
