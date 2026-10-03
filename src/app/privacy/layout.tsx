import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Política de privacidad de jrsystem7777.com: qué datos se recogen y cómo se usan.",
  alternates: { canonical: "/privacy" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
