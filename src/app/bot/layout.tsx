import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System 777",
  description: "System 777: bot de Discord con moderación, protección, economía, niveles y tickets, corriendo 24/7 en VPS con estadísticas en vivo.",
  alternates: { canonical: "/bot" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
