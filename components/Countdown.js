"use client";

import { useEffect, useState } from "react";

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    kun: Math.floor(ms / 86400000),
    soat: Math.floor((ms / 3600000) % 24),
    daqiqa: Math.floor((ms / 60000) % 60),
    soniya: Math.floor((ms / 1000) % 60),
  };
}

export default function Countdown({ target, label = "Seminargacha qoldi" }) {
  const [left, setLeft] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLeft(diff(target));
    setReady(true);
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (ready && !left) {
    return (
      <p className="text-sm font-bold text-ink">
        Ro'yxatdan o'tish yopildi
      </p>
    );
  }

  const cells = [
    ["kun", left?.kun],
    ["soat", left?.soat],
    ["daqiqa", left?.daqiqa],
    ["soniya", left?.soniya],
  ];

  return (
    <div>
      <p className="mb-3 text-[13px] text-muted">{label}</p>
      <div className="flex gap-2">
        {cells.map(([name, value]) => (
          <div
            key={name}
            className="min-w-[64px] flex-1 rounded-xl border border-line bg-paper px-2 py-2.5 text-center sm:min-w-[76px]"
          >
            <div className="font-mono text-[26px] font-extrabold leading-none tabular-nums text-ink sm:text-[30px]">
              {ready ? String(value).padStart(2, "0") : "\u2013\u2013"}
            </div>
            <div className="mt-1.5 text-[11px] text-muted">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
