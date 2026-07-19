export async function onRequestGet(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  const match = cookie.match(/system777_session=([^;]+)/);
  if (!match) {
    return Response.json(null);
  }
  try {
    const data = JSON.parse(atob(match[1]));
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return Response.json(null);
    }
    return Response.json({
      user: {
        id: data.id,
        name: data.global_name || data.username,
        email: data.email,
        image: data.avatar ? "https://cdn.discordapp.com/avatars/" + data.id + "/" + data.avatar + ".png" : null,
        role: data.role || "STUDENT",
        username: data.username,
      },
      expires: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    });
  } catch {
    return Response.json(null);
  }
}
