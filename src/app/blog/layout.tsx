import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos y notas de Ángel (Yzzz 777) sobre Discord bots, Linux, seguridad y desarrollo web.",
  alternates: { canonical: "/blog" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
