import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Historial real de cambios y roadmap público de jrsystem7777.com y System 777, generado a partir de los commits del repositorio.",
  alternates: { canonical: "/changelog" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
