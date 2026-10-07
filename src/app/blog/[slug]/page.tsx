import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getBlogPost } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const runtime = "edge";

type Params = { params: Promise<{ slug: string }> };

async function getPublishedPost(slug: string) {
  try {
    const post = await getBlogPost(slug);
    if (!post || post.published === false) return null;
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  const description: string = post.excerpt || `Artículo de ${post.author || "Ángel"} en el blog.`;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${slug}`,
      publishedTime: post.created_at,
      section: post.category || "General",
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const date = new Date(post.created_at);

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="bg-vignette" aria-hidden />
      <article className="relative mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Volver al blog
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="font-mono">
              {post.category || "General"}
            </Badge>
            <time
              dateTime={post.created_at}
              className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]"
            >
              <Clock aria-hidden className="h-3 w-3" />
              {date.toLocaleDateString("es-ES")}
            </time>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
              {post.excerpt}
            </p>
          )}
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
            por {post.author || "Ángel"}
          </p>
        </header>

        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt=""
            className="mt-6 max-h-80 w-full rounded-[10px] border border-[var(--line)] object-cover"
          />
        )}

        <div className="panel mt-6 whitespace-pre-wrap p-6 text-[15px] leading-relaxed text-[var(--text-2)] sm:p-8">
          {post.content || post.excerpt || "Sin contenido todavía."}
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(0,229,255,0.14)] pt-6">
          <p className="text-xs text-[var(--text-3)]">
            ¿Buscas documentación técnica?{" "}
            <Link href="/library" className="text-[var(--brand)] hover:underline">
              Ve a la biblioteca
            </Link>
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
          >
            Todos los artículos
            <ArrowLeft aria-hidden className="h-4 w-4 rotate-180" />
          </Link>
        </footer>
      </article>
    </div>
  );
}
