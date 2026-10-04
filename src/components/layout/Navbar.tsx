"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "@/components/Providers";
import { siteConfig, navLinks } from "@/lib/config";
import { cn } from "@/lib/utils";
import SharinganEgg from "@/components/layout/SharinganEgg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const eggClicks = useRef(0);
  const eggTimer = useRef<number | undefined>(undefined);

  const onLogoClick = () => {
    eggClicks.current += 1;
    window.clearTimeout(eggTimer.current);
    if (eggClicks.current >= 3) {
      eggClicks.current = 0;
      window.dispatchEvent(new CustomEvent("system777:sharingan"));
      return;
    }
    eggTimer.current = window.setTimeout(() => {
      eggClicks.current = 0;
    }, 900);
  };

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
    <>
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
        <Link href="/" onClick={onLogoClick} className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] transition-colors group-hover:border-[rgba(0,255,136,0.35)]">
            <Image
              src="/logo.webp"
              alt=""
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-cover"
            />
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
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            if (!link.children) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  data-nav-link={link.href}
                  className="relative rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      data-nav-pill
                      className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-[var(--line-strong)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn("relative", active && "text-[var(--text)]")}
                  >
                    {link.label}
                  </span>
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
                  data-nav-link={link.href}
                  onClick={() => setExpanded((prev) => (prev === link.label ? null : link.label))}
                  className={cn(
                    "relative flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-white/5 hover:text-[var(--text)]",
                    active && "text-[var(--text)]"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      data-nav-pill
                      className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-[var(--line-strong)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "relative h-3 w-3 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 w-52 overflow-hidden rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-2)]">
                    {link.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setExpanded(null)}
                          aria-current={childActive ? "page" : undefined}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-white/5 hover:text-[var(--text)]",
                            childActive
                              ? "bg-white/[0.07] text-[var(--text)]"
                              : "text-[var(--text-2)]"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sesión */}
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Menú de cuenta"
                className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] bg-white/[0.03] px-3 py-2 text-[13px] text-[var(--text-2)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--text)]"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-[var(--brand-dim)] text-[11px] font-bold text-[var(--brand)]">
                    {(session.user?.name || session.user?.email || "U")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[110px] truncate">
                  {session.user?.name || session.user?.email}
                </span>
                <ChevronDown aria-hidden className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="px-2 py-1.5">
                  <span className="block truncate text-[13px] font-semibold text-[var(--text)]">
                    {session.user?.name || session.user?.email}
                  </span>
                  {session.user?.name &&
                    session.user?.email &&
                    session.user.name !== session.user.email && (
                      <span className="mt-0.5 block truncate font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-3)]">
                        {session.user.email}
                      </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/bot/dashboard" />}>
                  <LayoutDashboard aria-hidden />
                  Panel de System 777
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                  <LogOut aria-hidden />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/login" />}>
              <LayoutDashboard aria-hidden />
              Entrar
            </Button>
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
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    data-nav-link={link.href}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-[15px] transition-colors hover:bg-white/5 hover:text-[var(--text)]",
                      active
                        ? "bg-white/[0.06] text-[var(--text)]"
                        : "text-[var(--text-2)]"
                    )}
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
                            className={cn(
                              "block rounded-lg px-3 py-2 text-[13.5px] transition-colors hover:bg-white/5 hover:text-[var(--text)]",
                              pathname === child.href
                                ? "text-[var(--text)]"
                                : "text-[var(--text-3)]"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            {session ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  render={
                    <Link href="/bot/dashboard" onClick={() => setOpen(false)} />
                  }
                >
                  Panel de System 777
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button className="w-full" render={<Link href="/login" onClick={() => setOpen(false)} />}>
                Entrar con Discord
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
    <SharinganEgg />
    </>
  );
}
