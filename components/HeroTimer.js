"use client";

import { useEffect, useState } from "react";

const TOTAL = 120; // 2 daqiqa

export default function HeroTimer({ note }) {
  const [left, setLeft] = useState(TOTAL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const id = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(
    left % 60
  ).padStart(2, "0")}`;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <span aria-hidden="true" className="text-[18px]">
          ⏱
        </span>
        <span className="font-mono text-[24px] font-extrabold tabular-nums tracking-wide text-violet sm:text-[26px]">
          {ready ? mmss : "02:00"}
        </span>
      </div>
      <p className="mt-1.5 text-[13px] text-muted">{note}</p>
    </div>
  );
}
