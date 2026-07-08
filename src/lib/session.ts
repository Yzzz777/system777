export function getSession(): { id: string; username: string; global_name: string; avatar: string; email: string; accessToken: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/system777_session=([^;]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(atob(match[1]));
    if (data.expiresAt && Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

export function logout() {
  document.cookie = "system777_session=; Path=/; Max-Age=0";
  window.location.href = "/login";
}
