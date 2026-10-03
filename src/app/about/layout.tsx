import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Ángel (Yzzz 777): autodidacta desde 2023, desarrollo web, bots, Linux y seguridad aplicada. Sin títulos ni métricas inventadas.",
  alternates: { canonical: "/about" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
