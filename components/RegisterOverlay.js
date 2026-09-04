"use client";

import { useEffect, useRef, useState } from "react";
import site from "@/content/site";

const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/+Z8fi8cYQmjdmNjli";

const HOLD_SECONDS = 120; // 2 daqiqa

function maskPhone(raw) {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  let out = p[0];
  if (p[1]) out += " " + p[1];
  if (p[2]) out += "-" + p[2];
  if (p[3]) out += "-" + p[3];
  return out;
}

export default function RegisterOverlay({ open, onClose }) {
  const t = site.form;
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [format, setFormat] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);
  const nameRef = useRef(null);

  // Ochilganda holatni tozalash + fokus + orqa fon skrollini to'xtatish
  useEffect(() => {
    if (!open) return;
    setStep("form");
    setError("");
    setSending(false);
    setSecondsLeft(HOLD_SECONDS);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => nameRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(id);
    };
  }, [open]);

  // 2 daqiqalik taymer — 0 ga tushsa hech narsa o'zgarmaydi, shunchaki to'xtaydi
  useEffect(() => {
    if (!open || step !== "form") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const digits = phone.replace(/\D/g, "");
  const isComplete = name.trim().length >= 2 && digits.length === 9 && !!format;
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  async function submit() {
    if (sending) return;
    if (name.trim().length < 2) return setError(t.errors.name);
    if (digits.length !== 9) return setError(t.errors.phone);
    if (!format) return setError(t.errors.format);
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: "+998" + digits,
          format,
          pageUrl: window.location.href,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
        }),
      });
      const data = await res.json().catch(() => ({}));

      // Meta Pixel — CAPI bilan bir xil eventID (dublikat hisoblanmasligi uchun)
      if (typeof window.fbq === "function") {
        window.fbq(
          "track",
          "CompleteRegistration",
          { content_name: "AI Biznes Seminar", value: 197000, currency: "UZS" },
          data.eventId ? { eventID: data.eventId } : undefined
        );
      }
      setStep("success");
    } catch (e) {
      setError(t.errors.network);
    } finally {
      setSending(false);
    }
  }

  const firstName = name.trim().split(" ")[0] || "";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="overlay-enter mx-auto flex min-h-full w-full max-w-[560px] flex-col px-5 pb-10 pt-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-full p-2 text-muted transition-colors hover:text-ink"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {step === "form" ? (
          <div className="flex flex-1 flex-col justify-center py-4">
            <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[36px]">
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.subtitle}</p>

            <div className="mt-7">
              <label htmlFor="name" className="mb-2 block text-sm text-muted">
                {t.nameLabel}
              </label>
              <input
                id="name"
                ref={nameRef}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full rounded-2xl border border-line bg-surface px-5 py-4 text-[17px] text-ink placeholder:text-muted/60 focus:border-lime focus:outline-none"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="phone" className="mb-2 block text-sm text-muted">
                {t.phoneLabel}
              </label>
              <div className="flex gap-2">
                <div className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-line bg-surface px-4 text-[17px] font-bold text-ink">
                  <span aria-hidden="true">🇺🇿</span> +998
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  placeholder="XX XXX-XX-XX"
                  className="w-full rounded-2xl border border-line bg-surface px-5 py-4 text-[17px] tracking-wide text-ink placeholder:text-muted/60 focus:border-lime focus:outline-none"
                />
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="mb-2.5 text-sm text-muted">{t.formatLabel}</legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { key: "offline", label: t.formatOffline },
                  { key: "online", label: t.formatOnline },
                ].map((o) => {
                  const active = format === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => setFormat(o.key)}
                      aria-pressed={active}
                      className={
                        "rounded-2xl border px-5 py-4 text-left text-[16px] font-bold transition-colors " +
                        (active
                          ? "border-lime bg-lime text-limeInk"
                          : "border-line bg-surface text-muted hover:text-ink")
                      }
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error ? (
              <p role="alert" className="mt-4 text-sm font-semibold text-ink">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={sending || !isComplete}
              className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
            >
              {sending ? t.sending : t.submit}
            </button>

            <p className="mt-4 text-center text-[13px] text-muted">
              {t.timerNote}{" "}
              <span className="font-mono font-bold tabular-nums text-red-600">{mmss}</span>
            </p>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-muted/70">
              {t.consent}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center py-6 text-center">
            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full bg-lime">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 12.5l5.2 5.2L20 7"
                  stroke="#10130A"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mt-7 text-[28px] font-extrabold uppercase leading-[1.15] tracking-tight text-ink sm:text-[34px]">
              {firstName ? `${firstName}, ` : ""}
              {site.success.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[420px] text-[16px] leading-relaxed text-muted">
              {site.success.text}
            </p>

            <div className="mt-6 flex justify-center gap-4 text-2xl text-ink" aria-hidden="true">
              <span>↓</span>
              <span>↓</span>
              <span>↓</span>
              <span>↓</span>
              <span>↓</span>
            </div>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full"
            >
              {site.success.button}
            </a>
            <p className="mt-4 text-[13px] leading-relaxed text-muted/80">
              {site.success.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getCookie(key) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}
