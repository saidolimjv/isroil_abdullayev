"use client";

import { useEffect, useRef, useState } from "react";
import site from "@/content/site";
import { track, readAttribution } from "@/lib/analytics";
import {
  extractDigits,
  formatNational,
  formatFull,
  toE164Digits,
  validatePhone,
} from "@/lib/phone";

const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/+Z8fi8cYQmjdmNjli";

// Ism: harflar (lotin + kirill), bo'sh joy, apostrof va defis
const NAME_RE = /^[\p{L}\s'’-]+$/u;

/** pathname → variant nomi */
function currentVariant() {
  if (typeof window === "undefined") return "v1";
  const p = window.location.pathname.replace(/\/+$/, "");
  if (p === "/v2") return "v2";
  if (p === "/v3") return "v3";
  return "v1";
}

export default function RegisterOverlay({ open, onClose }) {
  const t = site.form;
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [netError, setNetError] = useState("");
  const [sending, setSending] = useState(false);
  const nameRef = useRef(null);
  const roleBoxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setNetError("");
    setSending(false);
    setSubmitted(false);
    setTouched({});
    setRoleOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => nameRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(id);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (ev) => {
      if (ev.key !== "Escape") return;
      if (roleOpen) setRoleOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, roleOpen]);

  // Dropdown tashqarisiga bosilganda yopish
  useEffect(() => {
    if (!roleOpen) return;
    const onDown = (ev) => {
      if (roleBoxRef.current && !roleBoxRef.current.contains(ev.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [roleOpen]);

  if (!open) return null;

  const digits = extractDigits(phone);
  const phoneCheck = validatePhone(phone);
  const nameOk = name.trim().length >= 2 && NAME_RE.test(name.trim());
  const isComplete = nameOk && phoneCheck.ok && !!role;

  // Xato faqat blur'dan keyin yoki submit bosilgandan keyin ko'rsatiladi
  const showName = touched.name || submitted;
  const showPhone = touched.phone || submitted;
  const showRole = touched.role || submitted;

  const nameError = !showName
    ? ""
    : name.trim().length < 2
    ? t.errors.name
    : !NAME_RE.test(name.trim())
    ? t.errors.nameChars
    : "";

  const phoneError = !showPhone
    ? ""
    : phoneCheck.ok
    ? ""
    : {
        empty: t.errors.phoneEmpty,
        short: t.errors.phoneShort,
        code: t.errors.phoneCode,
        fake: t.errors.phoneFake,
      }[phoneCheck.reason];

  const roleError = showRole && !role ? t.errors.role : "";
  const roleLabel = site.roles.find((r) => r.value === role)?.label || "";

  async function submit() {
    setSubmitted(true);
    if (sending || !isComplete) return;
    setNetError("");
    setSending(true);
    track("form_submit", { role });

    try {
      const attribution = readAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: toE164Digits(digits), // "998901987654"
          phone_raw: formatFull(digits), // "+998 (90) 198-76-54"
          role,
          role_label: roleLabel,
          variant: currentVariant(),
          pageUrl: window.location.href,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          ...attribution,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (typeof window.fbq === "function") {
        // 1) Standart konversiya — server CAPI bilan bir xil event_id
        window.fbq(
          "track",
          "CompleteRegistration",
          {
            content_name: "seminar_20sep",
            content_category: role,
            value: 200000,
            currency: "UZS",
          },
          data.eventId ? { eventID: data.eventId } : undefined
        );

        // 2) Sifatli lead — ALOHIDA event_id, faqat role !== "other" bo'lsa
        if (data.qualifiedEventId) {
          window.fbq(
            "trackCustom",
            "QualifiedLead",
            {
              content_name: "seminar_20sep",
              content_category: role,
              value: 200000,
              currency: "UZS",
            },
            { eventID: data.qualifiedEventId }
          );
        }
      }

      track("lead_success", { role });
      setStep("success");
    } catch (err) {
      setNetError(t.errors.network);
    } finally {
      setSending(false);
    }
  }

  const fieldBase =
    "w-full rounded-2xl border bg-surface px-5 py-4 text-[17px] text-ink placeholder:text-muted/60 focus:outline-none";

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
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {step === "form" ? (
          <div className="flex flex-1 flex-col justify-center py-4">
            <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[34px]">
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.subtitle}</p>

            {/* 1. Ism */}
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
                onChange={(ev) => setName(ev.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                placeholder={t.namePlaceholder}
                aria-invalid={!!nameError}
                className={
                  fieldBase +
                  (nameError ? " border-red-500" : " border-line focus:border-lime")
                }
              />
              {nameError ? <FieldError>{nameError}</FieldError> : null}
            </div>

            {/* 2. Telefon */}
            <div className="mt-5">
              <label htmlFor="phone" className="mb-2 block text-sm text-muted">
                {t.phoneLabel}
              </label>
              <div className="flex gap-2">
                <div
                  aria-hidden="true"
                  className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-line bg-surface px-4 text-[17px] font-bold text-ink"
                >
                  <span>🇺🇿</span> +998
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={16}
                  value={formatNational(phone)}
                  onChange={(ev) => setPhone(extractDigits(ev.target.value))}
                  onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
                  placeholder={t.phonePlaceholder}
                  aria-invalid={!!phoneError}
                  className={
                    fieldBase +
                    " tracking-wide" +
                    (phoneError ? " border-red-500" : " border-line focus:border-lime")
                  }
                />
              </div>
              {phoneError ? <FieldError>{phoneError}</FieldError> : null}
            </div>

            {/* 3. Faoliyat turi — custom dropdown */}
            <div className="mt-5" ref={roleBoxRef}>
              <span className="mb-2 block text-sm text-muted">{t.roleLabel}</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleOpen((v) => !v)}
                  onBlur={() => setTouched((s) => ({ ...s, role: true }))}
                  aria-haspopup="listbox"
                  aria-expanded={roleOpen}
                  aria-invalid={!!roleError}
                  className={
                    fieldBase +
                    " flex items-center justify-between text-left" +
                    (roleError ? " border-red-500" : " border-line focus:border-lime")
                  }
                >
                  <span className={role ? "text-ink" : "text-muted/60"}>
                    {roleLabel || t.rolePlaceholder}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={
                      "shrink-0 text-lime transition-transform duration-200 " +
                      (roleOpen ? "rotate-180" : "")
                    }
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {roleOpen ? (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
                  >
                    {site.roles.map((r) => {
                      const active = r.value === role;
                      return (
                        <li key={r.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setRole(r.value);
                              setRoleOpen(false);
                              setTouched((s) => ({ ...s, role: true }));
                            }}
                            className={
                              "flex min-h-[48px] w-full items-center px-5 py-3 text-left text-[16px] transition-colors " +
                              (active
                                ? "bg-lime font-bold text-limeInk"
                                : "text-ink hover:bg-surface2")
                            }
                          >
                            {r.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              {roleError ? <FieldError>{roleError}</FieldError> : null}
            </div>

            {netError ? (
              <p role="alert" className="mt-4 text-sm font-semibold text-ink">
                {netError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={sending || !isComplete}
              className="btn-cta mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? t.sending : t.submit}
            </button>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-muted/70">
              {t.consent}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center py-6 text-center">
            <div className="mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full bg-lime">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12.5l5.2 5.2L20 7" stroke="#10130A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="mt-7 text-[26px] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[32px]">
              {site.success.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[420px] text-[16px] leading-relaxed text-ink">
              {site.success.text}
            </p>
            <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-relaxed text-muted">
              {site.success.telegramNote}
            </p>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta mt-5 w-full"
            >
              {site.success.button}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldError({ children }) {
  return (
    <p role="alert" className="mt-2 text-[13px] font-medium text-red-500">
      {children}
    </p>
  );
}

function getCookie(key) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}
