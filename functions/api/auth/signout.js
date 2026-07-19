export async function onRequestPost(context) {
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": "system777_session=; Path=/; HttpOnly; Max-Age=0",
    },
  });
}
export async function onRequestGet(context) {
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": "system777_session=; Path=/; HttpOnly; Max-Age=0",
    },
  });
}
