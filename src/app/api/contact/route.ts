import { NextResponse } from "next/server";

export const runtime = "edge";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_CONTACT_WEBHOOK || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message || message.length < 2) {
      return NextResponse.json({ error: "Nombre y mensaje requeridos" }, { status: 400 });
    }

    if (DISCORD_WEBHOOK_URL) {
      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: "Mensaje desde jrsystem7777.com",
              description: message,
              color: 0x00FF88,
              fields: [
                { name: "Nombre", value: name, inline: true },
                { name: "Pagina", value: "Contacto Web", inline: true },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "System 777 — Contact Form" },
            }],
          }),
        });
      } catch (e) {
        console.error("Discord webhook error:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
