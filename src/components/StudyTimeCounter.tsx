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

export default function StudyTimeCounter({ startDate }: StudyTimeCounterProps) {
  const [elapsed, setElapsed] = useState(() => calcElapsed(new Date(startDate)));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(calcElapsed(new Date(startDate)));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  const { years, months, days, hours, minutes, seconds } = elapsed;

  const units = [
    { value: years, label: "AÑOS", color: "#00FF88" },
    { value: months, label: "MESES", color: "#00C8FF" },
    { value: days, label: "DÍAS", color: "#7C3AED" },
    { value: hours, label: "HORAS", color: "#FFD93D" },
    { value: minutes, label: "MIN", color: "#FF6B6B" },
    { value: seconds, label: "SEG", color: "#EB459E" },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="text-2xl sm:text-4xl font-black tabular-nums" style={{ color: u.color }}>
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[9px] sm:text-[11px] text-gray-500 mt-1 tracking-wider">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
