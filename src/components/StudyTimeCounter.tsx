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
    const updateTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();

      if (diffMs <= 0) {
        setElapsed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

      const fullDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(fullDays / 365);
      const remainingDays = fullDays % 365;
      const months = Math.floor(remainingDays / 30);
      const days = remainingDays % 30;

      setElapsed({ years, months, days, hours, minutes, seconds });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  if (!isMounted) return null;

  const { years, months, days, hours, minutes, seconds } = elapsed;

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-[#00FF88]">{years}</div>
        <div className="text-sm text-gray-400">AÑOS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#00C8FF]">{months}</div>
        <div className="text-sm text-gray-400">MESES</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#7C3AED]">{days}</div>
        <div className="text-sm text-gray-400">DÍAS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#FFD93D]">{hours}</div>
        <div className="text-sm text-gray-400">HORAS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#FF6B6B]">{minutes}</div>
        <div className="text-sm text-gray-400">MINUTOS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[#EB459E]">{seconds}</div>
        <div className="text-sm text-gray-400">SEGUNDOS</div>
      </div>
    </div>
  );
}