import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos",
  description: "Términos de uso de jrsystem7777.com.",
  alternates: { canonical: "/terms" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
