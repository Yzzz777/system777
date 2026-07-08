import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function DiscordCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams(params).toString();
  redirect(`/api/auth/callback/discord${qs ? `?${qs}` : ""}`);
}
