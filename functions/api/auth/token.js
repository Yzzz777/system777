export async function onRequestGet(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  const match = cookie.match(/system777_session=([^;]+)/);
  if (!match) return Response.json({ token: null });
  try {
    const data = JSON.parse(atob(match[1]));
    return Response.json({ token: data.accessToken || null });
  } catch {
    return Response.json({ token: null });
  }
}
