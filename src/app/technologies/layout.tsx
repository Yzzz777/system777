import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tecnologías",
  description: "Stack real de Yzzz 777: JavaScript, TypeScript, Python, React, Next.js, Node.js, PostgreSQL, Linux, Docker, Cloudflare y más, con autoevaluación honesta.",
  alternates: { canonical: "/technologies" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
