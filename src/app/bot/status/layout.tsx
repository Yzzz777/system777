import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estado del bot",
  description: "Estado en vivo de System 777: ping, uptime, servidores, usuarios y comandos desde la API pública.",
  alternates: { canonical: "/bot/status" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
