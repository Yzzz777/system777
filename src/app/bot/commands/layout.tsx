import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comandos de System 777",
  description: "Referencia pública de los comandos de System 777 con uso, descripción y filtros por categoría.",
  alternates: { canonical: "/bot/commands" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
