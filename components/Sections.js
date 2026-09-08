"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import site from "@/content/site";

const e = site.event;

/* ------------------------------- Umumiy bo'laklar ------------------------------- */

function SectionTitle({ children, className = "" }) {
  return (
    <h2
      className={
        "text-[25px] font-extrabold leading-[1.18] tracking-tight text-ink sm:text-[36px] " +
        className
      }
    >
      {children}
    </h2>
  );
}

function Check() {
  return (
    <span
      aria-hidden="true"
      className="mt-[3px] flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-lime text-[11px] font-extrabold text-limeInk"
    >
      ✓
    </span>
  );
}

/* -------------------------------------- Hero -------------------------------------- */

export function Hero({ onRegister, title, subtitle }) {
  const chips = [
    e.dateLabel,
    `${e.venue}, ${e.city}`,
    e.time,
    `${e.format} • ${e.duration}`,
  ];

  return (
    <header className="glow-top relative border-b border-line">
      <div className="wrap grid gap-8 pb-10 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-16 lg:pt-12">
        {/* Chap ustun: matn + CTA (mobil'da birinchi) */}
        <div>
          <p className="text-[12px] font-extrabold uppercase leading-snug tracking-[0.12em] text-lime sm:text-[13px]">
            {site.hero.preheadline}
          </p>

          <h1 className="mt-4 max-w-[19ch] text-[clamp(28px,7vw,50px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
            {title || site.hero.title}
          </h1>

          <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-muted sm:text-[17px]">
            {subtitle || site.hero.subtitle}
          </p>

          {/* Info chiplar */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-bold text-ink sm:text-[14px]"
              >
                {c}
              </li>
            ))}
          </ul>

          {/* Narx + CTA */}
          <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[34px] font-extrabold leading-none tracking-tight text-ink sm:text-[40px]">
              {e.price}
            </span>
            <span className="text-[16px] font-bold text-muted">{e.currency}</span>
          </div>

          <button
            type="button"
            onClick={() => onRegister("hero_cta_click")}
            className="btn-cta mt-5 w-full sm:w-auto"
          >
            {site.cta.hero}
          </button>

          <p className="mt-3 text-[13px] text-muted">{site.hero.microcopy}</p>
          <p className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-lime">
            <Check />
            {site.hero.trustLine}
          </p>
        </div>

        {/* O'ng ustun: rasm — mobilda CTA'dan keyin, balandligi cheklangan */}
        <div className="relative order-last">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/20 blur-3xl"
          />
          <Image
            src={site.expert.photo}
            alt={site.expert.name}
            width={800}
            height={800}
            priority
            sizes="(max-width: 1024px) 62vw, 460px"
            className="relative mx-auto h-auto w-[62%] max-w-[300px] object-contain lg:w-full lg:max-w-[460px]"
          />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------ Kim uchun ----------------------------------- */

export function ForWhom() {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle>{site.forWhom.title}</SectionTitle>
        <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {site.forWhom.cards.map((c) => (
            <div key={c.role} className="card p-5 sm:p-6">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-lime">
                {c.role}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[68ch] border-l-2 border-lime pl-4 text-[15px] leading-relaxed text-ink sm:text-[16px]">
          {site.forWhom.endCopy}
        </p>
      </div>
    </section>
  );
}

/* --------------------------------- Transformatsiya -------------------------------- */

const OUTCOME_ICONS = [
  <svg key="exit" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 16l4-4-4-4M14 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v5l3.2 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="grid" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="2" />
  </svg>,
];

export function Outcomes() {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle>{site.outcomes.title}</SectionTitle>
        <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {site.outcomes.items.map((o, i) => (
            <div key={o.title} className="card p-5 sm:p-6">
              <div className="icon-badge">
                <div className="h-5 w-5">{OUTCOME_ICONS[i]}</div>
              </div>
              <div className="mt-4 text-[17px] font-bold leading-snug text-ink sm:text-[18px]">
                {o.title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                {o.text}
              </p>
              {o.bullets ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {o.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-md bg-surface2 px-2 py-1 text-[12px] text-muted"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------- Dastur ------------------------------------- */

export function Program({ onRegister }) {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle className="max-w-[24ch]">{site.program.title}</SectionTitle>

        <ol className="mt-8 grid gap-3 md:grid-cols-2 md:gap-4">
          {site.program.steps.map((s) => (
            <li key={s.n} className="card flex gap-4 p-5">
              <span className="font-mono text-[15px] font-extrabold leading-none text-lime">
                {s.n}
              </span>
              <div>
                <h3 className="text-[16px] font-bold leading-snug text-ink sm:text-[17px]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => onRegister("mid_cta_click")}
          className="btn-cta mt-8"
        >
          {site.cta.mid}
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------- Sendly proof ---------------------------------- */

export function Proof() {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle>{site.proof.title}</SectionTitle>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-lime sm:text-[16px]">
          {site.proof.subtitle}
        </p>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card-dark p-6 sm:p-7">
            {site.proof.body.map((p) => (
              <p
                key={p}
                className="mb-3 max-w-[64ch] text-[15px] leading-relaxed text-ink last:mb-0 sm:text-[16px]"
              >
                {p}
              </p>
            ))}
            <ul className="mt-5 space-y-2.5">
              {site.proof.capabilities.map((c) => (
                <li key={c} className="flex gap-3 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                  <Check />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {site.proof.chips.map((c) => (
              <div key={c.big} className="card p-5">
                <div className="text-[18px] font-extrabold leading-tight text-lime">
                  {c.big}
                </div>
                <div className="mt-1.5 text-[13px] leading-snug text-muted">{c.small}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-[68ch] text-[15px] leading-relaxed text-ink sm:text-[16px]">
          {site.proof.closing}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------- Ekspert ------------------------------------ */

export function Expert() {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle>{site.expert.title}</SectionTitle>

        <div className="mt-7 grid gap-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-12">
          <div className="card overflow-hidden">
            <div className="relative aspect-square w-full bg-surface2">
              <Image
                src={site.expert.photo}
                alt={site.expert.name}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 92vw, 360px"
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <div className="text-[22px] font-extrabold text-ink sm:text-[26px]">
              {site.expert.name}
            </div>
            <ul className="mt-5 space-y-2.5">
              {site.expert.facts.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[64ch] text-[15px] leading-relaxed text-muted sm:text-[16px]">
              {site.expert.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Nima olib ketasiz ------------------------------ */

export function Takeaways() {
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap">
        <SectionTitle className="max-w-[26ch]">{site.takeaways.title}</SectionTitle>
        <ul className="mt-7 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {site.takeaways.items.map((i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink sm:text-[16px]">
              <Check />
              <span>{i}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[68ch] border-l-2 border-lime pl-4 text-[15px] leading-relaxed text-muted sm:text-[16px]">
          {site.takeaways.closing}
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------- FAQ -------------------------------------- */

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap max-w-[840px]">
        <SectionTitle>{site.faq.title}</SectionTitle>
        <div className="mt-7 border-t border-line">
          {site.faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-5 py-4 text-left"
                >
                  <span className="text-[15px] font-bold leading-snug text-ink sm:text-[17px]">
                    {f.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime text-[18px] leading-none text-limeInk transition-transform duration-200 " +
                      (isOpen ? "rotate-45" : "")
                    }
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <p className="max-w-[64ch] pb-4 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                    {f.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ Narx bloki ---------------------------------- */

export function PriceBlock({ onRegister }) {
  const rows = [
    ["Sana", `${e.dateLabel}, ${e.dayLabel}`],
    ["Vaqt", e.time],
    ["Manzil", `${e.venue}, ${e.city}`],
    ["Format", `${e.format} • ${e.duration}`],
  ];

  return (
    <section className="border-b border-line py-12 sm:py-16">
      <div className="wrap max-w-[720px]">
        <SectionTitle className="text-center">{site.priceBlock.title}</SectionTitle>

        <div className="card-dark mt-8 p-6 sm:p-8">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-[44px] font-extrabold leading-none tracking-tight text-ink sm:text-[54px]">
              {e.price}
            </span>
            <span className="text-[18px] font-bold text-muted">{e.currency}</span>
          </div>

          <dl className="mt-7 space-y-3 text-[15px]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex justify-center">
            <span className="rounded-full bg-lime px-4 py-2 text-center text-[13px] font-extrabold text-limeInk">
              {site.priceBlock.scarcity}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onRegister("final_cta_click")}
            className="btn-cta mt-6 w-full"
          >
            {site.cta.final}
          </button>

          <p className="mt-3 text-center text-[13px] leading-relaxed text-muted">
            {site.priceBlock.microcopy}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------- Footer ------------------------------------ */

export function Footer() {
  return (
    <footer className="py-8">
      <div className="wrap">
        <p className="text-[14px] font-bold text-ink">
          © {new Date().getFullYear()} {site.footer.text}
        </p>
        <p className="mt-1.5 text-[13px] text-muted">
          {e.city}, {e.venue} · {e.dateLabel}, {e.time}
        </p>
        <p className="mt-3 max-w-[70ch] text-[12px] leading-relaxed text-muted/70">
          {site.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------- Mobil pastki yopishqoq CTA -------------------------- */

export function StickyBar({ onRegister }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-extrabold leading-none text-ink">
            {e.price} <span className="text-[12px] font-bold text-muted">{e.currency}</span>
          </div>
          <div className="mt-1 truncate text-[11px] text-muted">
            {e.dateLabel} • {e.venue}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRegister("sticky_cta_click")}
          className="btn-cta ml-auto !w-auto !px-5 !py-3 !text-[13px]"
        >
          {site.cta.sticky}
        </button>
      </div>
    </div>
  );
}
