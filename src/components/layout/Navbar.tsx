"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Terminal, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "@/components/Providers";
import { siteConfig, navLinks } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(null);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setExpanded(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      ref={navRef}
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-[var(--line)] bg-[rgba(5,5,10,0.88)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-[rgba(5,5,10,0.35)] backdrop-blur-sm"
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] transition-colors group-hover:border-[rgba(0,255,136,0.35)]">
            <Terminal aria-hidden className="h-4 w-4 text-[var(--brand)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-bold tracking-tight text-[var(--text)]">
              {siteConfig.name}
            </span>
            <span className="mt-0.5 hidden font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--text-3)] sm:block">
              {siteConfig.owner.name}
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const isOpen = expanded === link.label;
            if (!link.children) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[13.5px] text-[var(--text-2)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setExpanded(link.label)}
                onMouseLeave={() => setExpanded(null)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setExpanded((prev) => (prev === link.label ? null : link.label))}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] text-[var(--text-2)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {link.label}
                  <ChevronDown
                    aria-hidden
                    className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 w-52 overflow-hidden rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-2)]">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setExpanded(null)}
                        className="block rounded-lg px-3 py-2 text-[13.5px] text-[var(--text-2)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sesión */}
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/bot/dashboard"
                className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-white/[0.03] px-3 py-2 text-[13px] text-[var(--text-2)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--text)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-dim)] text-[11px] font-bold text-[var(--brand)]">
                  {(session.user?.name || session.user?.email || "U")[0]?.toUpperCase()}
                </span>
                <span className="max-w-[110px] truncate">
                  {session.user?.name || session.user?.email}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Cerrar sesión"
                className="rounded-[10px] border border-[var(--line)] p-2 text-[var(--text-3)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--text)]"
              >
                <LogOut aria-hidden className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-ghost !px-4 !py-2 !text-[13px]">
              <LayoutDashboard aria-hidden className="h-3.5 w-3.5" />
              Entrar
            </Link>
          )}
        </div>

        {/* Móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="rounded-[10px] border border-[var(--line)] bg-white/[0.03] p-2 text-[var(--text-2)] transition-colors hover:text-[var(--text)] lg:hidden"
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
        </button>
      </nav>

      {/* Panel móvil */}
      <div
        className={cn(
          "overflow-hidden border-t border-[var(--line)] bg-[var(--bg)] transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[calc(100dvh-4rem)] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] text-[var(--text-2)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <ul className="mb-1 ml-3 space-y-0.5 border-l border-[var(--line)] pl-3">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-2 text-[13.5px] text-[var(--text-3)] transition-colors hover:text-[var(--text)]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            {session ? (
              <div className="space-y-2">
                <Link
                  href="/bot/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-white/[0.04] px-3 py-3 text-center text-sm text-[var(--text)]"
                >
                  Panel de System 777
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-sm text-[var(--err)]"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-[var(--brand)] px-3 py-3 text-center text-sm font-semibold text-[#04120b]"
              >
                Entrar con Discord
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
