"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

type CountdownTimerProps = {
  targetDate: string;
  headingFont?: string;
};

export function CountdownTimer({ targetDate, headingFont }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isPast =
    mounted &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const fontStyle = headingFont
    ? { fontFamily: `${headingFont}, Georgia, serif` }
    : { fontFamily: "var(--font-playfair), Georgia, serif" };

  if (isPast) {
    return (
      <div className="text-center py-6">
        <p className="text-2xl opacity-70" style={fontStyle}>
          ¡El gran día ha llegado! 🎉
        </p>
      </div>
    );
  }

  const units = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center py-8">
      <p className="text-xs tracking-[0.35em] uppercase opacity-40 mb-5">
        Cuenta regresiva al gran día
      </p>
      <div className="flex items-start justify-center gap-2 sm:gap-4">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-start gap-2 sm:gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-black/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-3 min-w-[58px] sm:min-w-[72px]">
                <p
                  className="text-3xl sm:text-4xl font-bold tabular-nums leading-none text-center"
                  style={fontStyle}
                  suppressHydrationWarning
                >
                  {mounted ? String(value).padStart(2, "0") : "00"}
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-widest opacity-45 mt-2">{label}</p>
            </div>
            {i < units.length - 1 ? (
              <p className="text-2xl font-bold opacity-30 mt-2.5" style={fontStyle}>
                :
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
