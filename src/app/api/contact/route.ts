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

    if (!DISCORD_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "Canal de contacto no configurado todavía." },
        { status: 503 }
      );
    }

    try {
      const res = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "Mensaje desde jrsystem7777.com",
            description: String(message).slice(0, 2000),
            color: 0x00E5FF,
            fields: [
              { name: "Nombre", value: String(name).slice(0, 100), inline: true },
              { name: "Pagina", value: "Contacto Web", inline: true },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "System 777 — Contact Form" },
          }],
        }),
      });

      if (!res.ok) {
        console.error("Discord webhook failed:", res.status);
        return NextResponse.json(
          { error: "No se pudo enviar el mensaje. Inténtalo de nuevo." },
          { status: 502 }
        );
      }
    } catch (e) {
      console.error("Discord webhook error:", e);
      return NextResponse.json(
        { error: "Error de red al enviar el mensaje." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
