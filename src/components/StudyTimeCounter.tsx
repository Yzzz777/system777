"use client";

import { useState, useEffect } from "react";

interface StudyTimeCounterProps {
  startDate: Date;
}

function calcElapsed(startDate: Date) {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  if (diffMs <= 0) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;

  return { years, months, days, hours, minutes, seconds };
}

const units = [
  { key: "years", label: "AÑOS", color: "var(--brand)" },
  { key: "months", label: "MESES", color: "var(--data)" },
  { key: "days", label: "DÍAS", color: "#9b8cff" },
  { key: "hours", label: "HORAS", color: "var(--warn)" },
  { key: "minutes", label: "MIN", color: "#ff8f6b" },
  { key: "seconds", label: "SEG", color: "#ff6bb5" },
] as const;

export default function StudyTimeCounter({ startDate }: StudyTimeCounterProps) {
  const start = new Date(startDate);
  const [elapsed, setElapsed] = useState(() => calcElapsed(start));

  useEffect(() => {
    setElapsed(calcElapsed(start));
    const timer = setInterval(() => setElapsed(calcElapsed(start)), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start.getTime()]);

  const summary = `Lleva ${elapsed.years} años, ${elapsed.months} meses y ${elapsed.days} días aprendiendo.`;

  return (
    <div className="w-full" role="timer" aria-label="Tiempo aprendiendo">
      {/* El resumen cambia entre render de servidor y cliente (new Date()):
          sin suppress, React aborta la hidratación de la portada. */}
      <p suppressHydrationWarning className="sr-only">{summary}</p>
      <div aria-hidden className="flex items-stretch gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.key}
            className="flex min-w-0 flex-1 flex-col items-center rounded-[12px] border border-[var(--line)] bg-white/[0.02] px-1 py-2.5 sm:px-2 sm:py-3"
          >
            <span
              suppressHydrationWarning
              className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums leading-none sm:text-3xl"
              style={{ color: u.color }}
            >
              {String(elapsed[u.key]).padStart(2, "0")}
            </span>
            <span className="mt-1.5 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--text-3)] sm:text-[10px]">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
