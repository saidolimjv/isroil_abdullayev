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

/** Sayt bitta sahifadan iborat — Sheets'da manba ustuni uchun */
function currentVariant() {
  return "main";
}

export default function RegisterOverlay({ open, onClose }) {
  const t = site.form;
  // "qualify" → "form" → "success"  |  "qualify" → "declined"
  const [step, setStep] = useState("qualify");
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
    setStep("qualify");
    setNetError("");
    setSending(false);
    setSubmitted(false);
    setTouched({});
    setRoleOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => {
      if (step === "form") nameRef.current?.focus();
    }, 120);
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

  /**
   * Maska bilan ishlaganda Backspace ajratgichni o'chirsa, raqamlar
   * o'zgarmaydi va maska uni qayta qo'yadi — natijada raqam o'chmay qoladi.
   * Shuning uchun: matn qisqargan, lekin raqamlar bir xil bo'lsa,
   * oxirgi raqamni o'zimiz olib tashlaymiz.
   */
  function handlePhoneChange(ev) {
    const next = ev.target.value;
    const nextDigits = extractDigits(next);
    const shrunk = next.length < formatNational(phone).length;

    if (shrunk && nextDigits === digits) {
      setPhone(digits.slice(0, -1));
      return;
    }
    setPhone(nextDigits);
  }

  async function submit() {
    setSubmitted(true);
    if (sending || !isComplete) return;
    setNetError("");
    setSending(true);
    track("form_submit", { role });

    // Event ID'larni SHU YERDA yaratamiz — shunda serverdan javob kutmasdan
    // piksel eventini yuborib, keyingi ekranni darhol ko'rsata olamiz.
    // Server ham aynan shu ID'larni ishlatadi, ya'ni dedup buzilmaydi.
    const eventId = makeId();
    const qualified = !!role && role !== "other";
    const qualifiedEventId = qualified ? makeId() : null;

    const payload = {
      name: name.trim(),
      phone: toE164Digits(digits),
      phone_raw: formatFull(digits),
      role,
      role_label: roleLabel,
      variant: currentVariant(),
      pageUrl: window.location.href,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      event_id: eventId,
      qualified_event_id: qualifiedEventId,
      ...readAttribution(),
    };

    // So'rovni yuboramiz, lekin UI uni kutib turmaydi.
    // keepalive: sahifa almashsa ham so'rov yo'lda davom etadi.
    const request = fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    request.catch(() => {});

    if (typeof window.fbq === "function") {
      const params = {
        content_name: "seminar_20sep",
        content_category: role,
        value: 200000,
        currency: "UZS",
      };
      window.fbq("track", "CompleteRegistration", params, { eventID: eventId });
      if (qualifiedEventId) {
        window.fbq("trackCustom", "QualifiedLead", params, {
          eventID: qualifiedEventId,
        });
      }
    }

    track("lead_success", { role });

    // Server sekin javob bersa ham (Google Sheets 2-10s), foydalanuvchi
    // ko'pi bilan 1.2 soniya kutadi.
    await Promise.race([
      request.catch(() => null),
      new Promise((r) => setTimeout(r, 1200)),
    ]);

    setSending(false);
    setStep("success");
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

        {step === "qualify" ? (
          <div className="flex flex-1 flex-col justify-center py-4">
            <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[32px]">
              {site.qualify.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {site.qualify.intro}
            </p>
            <p className="mt-1 text-[15px] font-bold text-ink">
              {site.event.dateLabel} · {site.event.time}
            </p>

            <p className="mt-7 text-center text-[20px] font-extrabold leading-snug text-ink sm:text-[22px]">
              Toshkentga kelib, ishtirok eta olasizmi?
            </p>

            <button
              type="button"
              onClick={() => {
                track("qualify_yes");
                setStep("form");
                setTimeout(() => nameRef.current?.focus(), 80);
              }}
              className="btn-cta mt-6 w-full"
            >
              {site.qualify.yes}
            </button>

            <button
              type="button"
              onClick={() => {
                track("qualify_no");
                setStep("declined");
              }}
              className="mt-3 min-h-[48px] w-full rounded-full border border-line bg-surface px-7 py-4 text-[15px] font-bold text-muted transition-colors hover:text-ink"
            >
              {site.qualify.no}
            </button>
          </div>
        ) : step === "declined" ? (
          <div className="flex flex-1 flex-col justify-center py-6 text-center">
            <div className="text-[56px] leading-none" aria-hidden="true">
              {site.declined.emoji}
            </div>
            <h2 className="mt-5 text-[26px] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[30px]">
              {site.declined.title}
            </h2>
            {site.declined.body.map((t) => (
              <p
                key={t}
                className="mx-auto mt-4 max-w-[430px] text-[15px] leading-relaxed text-muted"
              >
                {t}
              </p>
            ))}
            <button type="button" onClick={onClose} className="btn-cta mt-7 w-full">
              {site.declined.button}
            </button>
          </div>
        ) : step === "form" ? (
          <div className="flex flex-1 flex-col justify-center py-4">
            <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[34px]">
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.subtitle}</p>

            <div className="mt-5 rounded-2xl border border-lime/40 bg-lime/10 px-5 py-3.5 text-center text-[16px] font-extrabold text-lime">
              {t.priceNote}
            </div>

            {/* 1. Ism */}
            <div className="mt-7">
              <label htmlFor="name" className="mb-2 block text-sm text-muted">
                {t.nameLabel}
              </label>
              <input
                id="name"
                ref={nameRef}
                type="text"
                name="ism-qol"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
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
                  name="tel-qol"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  maxLength={16}
                  value={formatNational(phone)}
                  onChange={handlePhoneChange}
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

/** Barcha brauzerlarda ishlaydigan noyob ID */
function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12)
  );
}

function getCookie(key) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}
