"use client";

import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";

interface BlogPostProps {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}

export default function BlogPost({ title, category, author, date, readTime, content }: BlogPostProps) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Blog
        </Link>

        <article className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">{category}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="h-3 w-3" /> {readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white sm:text-4xl mb-4">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-white/5">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          <div className="max-w-none">
            {paragraphs.map((p, i) => {
              if (p.startsWith("## ")) {
                return <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-4">{p.replace("## ", "")}</h2>;
              }
              if (p.startsWith("### ")) {
                return <h3 key={i} className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3">{p.replace("### ", "")}</h3>;
              }
              if (p.startsWith("```")) {
                const code = p.replace(/```\w*\n?/g, "").replace(/```/g, "");
                return <pre key={i} className="rounded-xl bg-black/50 border border-white/5 p-4 overflow-x-auto text-sm text-gray-300 my-4"><code>{code}</code></pre>;
              }
              if (p.startsWith("- ") || p.startsWith("1. ")) {
                const items = p.split("\n").filter(l => l.trim());
                return (
                  <ul key={i} className="space-y-2 my-4">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                        <Tag className="mt-1 h-3 w-3 shrink-0 text-[#00FF88]" />
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/^[-\d.]+\s*/, "").replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#00FF88]">$1</code>') }} />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (p.startsWith("⚠️")) {
                return <div key={i} className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 my-4 text-yellow-300 text-sm">{p}</div>;
              }
              return <p key={i} className="text-gray-300 leading-relaxed my-4 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: p.replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#00FF88]">$1</code>') }} />;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
