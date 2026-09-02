"use client";

import { useState, useEffect } from "react";

interface StudyTimeCounterProps {
  startDate: Date;
}

export default function StudyTimeCounter({ startDate }: StudyTimeCounterProps) {
  const [elapsed, setElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const start = new Date(startDate);

    const calc = () => {
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      if (diffMs <= 0) return;

      const totalSeconds = Math.floor(diffMs / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const totalHours = Math.floor(totalMinutes / 60);
      const hours = totalHours % 24;
      const totalDays = Math.floor(totalHours / 24);

      // Calcular meses/años reales
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      setElapsed({ years, months, days, hours, minutes, seconds });
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  if (!isMounted) {
    return (
      <div className="flex items-center gap-3 sm:gap-5">
        {["AÑOS", "MESES", "DÍAS", "HORAS", "MIN", "SEG"].map((label) => (
          <div key={label} className="text-center">
            <div className="text-2xl sm:text-4xl font-black text-gray-700">—</div>
            <div className="text-[10px] sm:text-xs text-gray-700 mt-1">{label}</div>
          </div>
        ))}
      </div>
    );
  }

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
      {units.map((u, i) => (
        <div key={u.label} className="text-center">
          <div className="text-2xl sm:text-4xl font-black tabular-nums" style={{ color: u.color }}>
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[9px] sm:text-[11px] text-gray-500 mt-1 tracking-wider">{u.label}</div>
          {i < units.length - 1 && (
            <span className="hidden sm:block absolute -ml-3 mt-0 text-gray-700 text-lg font-bold" style={{ marginLeft: "-4px" }}></span>
          )}
        </div>
      ))}
    </div>
  );
}
