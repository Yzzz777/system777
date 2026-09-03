import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; guildId: string }> }
) {
  const { userId, guildId } = await params;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const BOT_API = process.env.BOT_API_URL || 'http://localhost:3000';
  try {
    await fetch(`${BOT_API}/api/ip-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, guildId, ip, userAgent, ts: Date.now() }),
    });
  } catch {
    console.log(`[IP-TRACK] ${userId} @ ${guildId} — IP: ${ip}`);
  }

  return new NextResponse(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System 777 — Verificación</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
    .card{background:rgba(20,20,30,.9);border:1px solid rgba(88,101,242,.3);border-radius:16px;padding:40px;max-width:420px;text-align:center;backdrop-filter:blur(20px)}
    .icon{font-size:48px;margin-bottom:16px}
    h1{font-size:22px;color:#5865f2;margin-bottom:8px}
    p{font-size:14px;color:#949ba4;line-height:1.6;margin-bottom:16px}
    .status{display:inline-block;background:rgba(87,242,135,.15);color:#57f287;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600}
    .footer{margin-top:20px;font-size:11px;color:#4e5058}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🛡️</div>
    <h1>System 777</h1>
    <p>Tu verificación ha sido registrada correctamente. Gracias por confirmar tu identidad.</p>
    <div class="status">✓ Verificado</div>
    <div class="footer">System 777 · jrsystem7777.com</div>
  </div>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
