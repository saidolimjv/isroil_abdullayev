"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import site from "@/content/site";
import Countdown from "./Countdown";
import HeroTimer from "./HeroTimer";

const e = site.event;

/* ---------------------------------- Ticket strip ---------------------------------- */

function TicketStrip() {
  const cells = [
    { top: e.dateLabel, bottom: e.dayLabel },
    { top: e.venue, bottom: e.city },
    { top: e.time, bottom: e.duration },
  ];
  return (
    <div className="flex w-full max-w-[520px] items-stretch overflow-hidden rounded-2xl border border-line bg-paper">
      {cells.map((c, i) => (
        <div
          key={c.top}
          className={"flex-1 px-2 py-2.5 sm:px-4 " + (i > 0 ? "border-l border-line" : "")}
        >
          <div className="whitespace-nowrap text-[13px] font-extrabold leading-tight text-ink sm:text-[15px]">
            {c.top}
          </div>
          <div className="mt-0.5 whitespace-nowrap text-[11px] text-muted sm:text-[12px]">
            {c.bottom}
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------- Hero -------------------------------------- */

export function Hero({ onRegister }) {
  return (
    <header className="glow-top relative flex min-h-[100svh] flex-col border-b border-line">
      <div className="wrap flex flex-1 flex-col items-center justify-start gap-4 pb-5 pt-4 text-center sm:gap-6 sm:pb-8 sm:pt-7">
        <TicketStrip />

        <h1 className="max-w-[18ch] text-[clamp(27px,7.4vw,52px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
          {site.hero.title}
        </h1>

        <p className="max-w-[46ch] text-[clamp(14px,3.6vw,19px)] leading-snug text-muted">
          {site.hero.subtitle}
        </p>

        <div className="relative min-h-0 w-full flex-1">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/45 blur-3xl"
          />
          <Image
            src={site.expert.photo}
            alt={site.expert.name}
            fill
            priority
            sizes="(max-width: 640px) 92vw, 440px"
            className="relative object-contain"
          />
        </div>

        <div className="w-full max-w-[420px] shrink-0">
          <button type="button" onClick={onRegister} className="btn-primary w-full">
            {site.hero.cta}
          </button>
          <div className="mt-3">
            <HeroTimer note={site.hero.timerNote} />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------ Outcomes ------------------------------------ */

export function Outcomes() {
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="wrap max-w-[860px]">
        <h2 className="section-title">{site.outcomes.title}</h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {site.outcomes.items.map((o) => (
            <li key={o.title} className="flex gap-4 py-5">
              <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-1 ring-ink/10" />
              <div>
                <div className="text-[18px] font-bold leading-snug text-ink sm:text-[20px]">{o.title}</div>
                <div className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-muted sm:text-[16px]">
                  {o.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------- Pain -------------------------------------- */

export function Pain() {
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="wrap max-w-[820px]">
        <h2 className="section-title">{site.pain.title}</h2>
        <ul className="mt-8 space-y-4">
          {site.pain.items.map((item) => (
            <li key={item} className="flex gap-3.5 text-[16px] leading-relaxed sm:text-[17px]">
              <span aria-hidden="true" className="mt-[9px] h-px w-5 shrink-0 bg-ink/30" />
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>
        <div className="card-dark mt-9 p-6 sm:p-8">
          <p className="text-[17px] font-bold leading-relaxed sm:text-[20px]">
            {site.pain.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ Program ------------------------------------- */

export function Program({ onRegister }) {
  return (
    <section id="dastur" className="border-b border-line py-14 sm:py-20">
      <div className="wrap">
        <h2 className="section-title">{site.program.title}</h2>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
          {site.program.note}
        </p>

        <ol className="mt-10 border-t border-line">
          {site.program.blocks.map((b) => (
            <li
              key={b.time}
              className="grid gap-3 border-b border-line py-6 sm:grid-cols-[110px_1fr] sm:gap-8"
            >
              <div>
                <span
                  className={
                    "inline-flex rounded-lg px-2.5 py-1 font-mono text-[15px] font-extrabold tabular-nums " +
                    (b.muted ? "bg-panel text-muted" : "bg-lime text-ink")
                  }
                >
                  {b.time}
                </span>
              </div>
              <div>
                <h3
                  className={
                    "text-[19px] font-bold leading-snug sm:text-[21px] " +
                    (b.muted ? "text-muted" : "text-ink")
                  }
                >
                  {b.title}
                </h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted sm:text-[16px]">
                  {b.text}
                </p>
                {b.tools ? (
                  <p className="mt-3 font-mono text-[13px] text-muted/80">{b.tools}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <button type="button" onClick={onRegister} className="btn-primary mt-10">
          {site.hero.cta}
        </button>
      </div>
    </section>
  );
}

/* --------------------------------------- Fit -------------------------------------- */

export function Fit() {
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="wrap">
        <h2 className="section-title">{site.fit.title}</h2>
        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          <div className="card p-6 sm:p-7">
            <h3 className="text-[18px] font-extrabold text-ink">{site.fit.yes.title}</h3>
            <ul className="mt-5 space-y-4">
              {site.fit.yes.items.map((i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink sm:text-[16px]">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-[12px] font-extrabold text-ink"
                  >
                    ✓
                  </span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-6 sm:p-7">
            <h3 className="text-[18px] font-extrabold text-paper/70">{site.fit.no.title}</h3>
            <ul className="mt-5 space-y-4">
              {site.fit.no.items.map((i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[15px] leading-relaxed text-paper/80 sm:text-[16px]"
                >
                  <span className="mt-0.5 shrink-0 text-paper/40" aria-hidden="true">
                    ✕
                  </span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card mt-4 border-lime bg-lime/15 p-6 sm:p-7">
          <h3 className="text-[19px] font-extrabold leading-snug text-ink sm:text-[21px]">
            {site.objection.title}
          </h3>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink/70 sm:text-[16px]">
            {site.objection.text}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------- Expert ------------------------------------- */

export function Expert() {
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="card overflow-hidden">
          <div className="relative aspect-square w-full bg-panel">
            <Image
              src={site.expert.photo}
              alt={site.expert.name}
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <h2 className="section-title">{site.expert.name}</h2>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {site.expert.facts.map((f) => (
              <div key={f.label} className="card px-5 py-5">
                <div className="text-[24px] font-extrabold leading-none text-ink sm:text-[28px]">
                  {f.value}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-muted">{f.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-7 space-y-4">
            {site.expert.bio.map((p) => (
              <p key={p} className="max-w-[62ch] text-[16px] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Takeaways + narx ---------------------------------- */

export function Offer({ onRegister }) {
  return (
    <section id="narx" className="border-b border-line py-14 sm:py-20">
      <div className="wrap grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <h2 className="section-title">{site.takeaways.title}</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {site.takeaways.items.map((i) => (
              <li key={i} className="flex gap-3.5 py-4 text-[16px] leading-relaxed text-ink">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-[12px] font-extrabold text-ink"
                >
                  ✓
                </span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-dark overflow-hidden self-start">
          <div className="p-7">
            <div className="text-[13px] text-paper/60">Ishtirok narxi</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold leading-none tracking-tight text-lime sm:text-[52px]">
                {e.price}
              </span>
              <span className="text-[18px] font-bold text-paper/70">{e.currency}</span>
            </div>

            <dl className="mt-7 space-y-3 text-[15px]">
              {[
                ["Sana", `${e.dateLabel}, ${e.dayLabel}`],
                ["Vaqt", e.time],
                ["Manzil", `${e.venue}, ${e.city}`],
                ["Format", "Offline"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-paper/10 pb-3">
                  <dt className="text-paper/55">{k}</dt>
                  <dd className="text-right font-bold text-paper">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 inline-flex rounded-full bg-lime px-4 py-2 text-[13px] font-extrabold text-ink">
              Joy soni cheklangan — atigi {e.seatsTotal} ta
            </div>

            <button type="button" onClick={onRegister} className="btn-invert mt-6 w-full">
              {site.hero.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------- FAQ -------------------------------------- */

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="wrap max-w-[820px]">
        <h2 className="section-title">Ko'p beriladigan savollar</h2>
        <div className="mt-9 border-t border-line">
          {site.faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[16px] font-bold leading-snug text-ink sm:text-[18px]">{f.q}</span>
                  <span
                    aria-hidden="true"
                    className={
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime text-[18px] leading-none text-ink transition-transform duration-200 " +
                      (isOpen ? "rotate-45" : "")
                    }
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-muted sm:text-[16px]">
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

/* ------------------------------------ Final CTA ----------------------------------- */

export function FinalCta({ onRegister }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="wrap">
        <div className="rounded-3xl bg-panel px-6 py-14 text-center sm:px-10 sm:py-20">
          <h2 className="section-title">Keyingisi — sizning biznesingiz</h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[16px] leading-relaxed text-muted sm:text-[18px]">
            {e.dateLabel}, {e.time}, {e.venue}. {e.duration} ichida biznesingizda AI-xodimlar
            qanday ishga tushishini o'z ko'zingiz bilan ko'rasiz.
          </p>
          <div className="mx-auto mt-9 max-w-[420px]">
            <Countdown target={e.startsAt} />
          </div>
          <div className="mt-8">
            <button type="button" onClick={onRegister} className="btn-primary">
              {site.hero.cta}
            </button>
          </div>
          <p className="mt-5 text-[14px] text-muted">
            {e.price} {e.currency} · {e.seatsTotal} ta joy
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------- Footer ------------------------------------ */

export function Footer() {
  return (
    <footer className="border-t border-line py-9">
      <div className="wrap">
        <p className="text-[14px] font-bold text-ink">
          © {new Date().getFullYear()} {site.footer.text}
        </p>
        <p className="mt-1.5 text-[13px] text-muted">
          {e.city}, {e.venue} · {e.dateLabel}, {e.time}
        </p>
        <p className="mt-4 max-w-[70ch] text-[12px] leading-relaxed text-muted/70">
          {site.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}

/* --------------------------- Mobil uchun pastki yopishqoq CTA ---------------------- */

export function StickyBar({ onRegister }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-extrabold leading-none text-ink">
            {e.price} <span className="text-[12px] font-bold text-muted">{e.currency}</span>
          </div>
          <div className="mt-1 truncate text-[11px] text-muted">
            {e.dateLabel} · {e.venue}
          </div>
        </div>
        <button
          type="button"
          onClick={onRegister}
          className="btn-primary ml-auto !w-auto !px-5 !py-3 !text-[13px]"
        >
          {site.hero.cta}
        </button>
      </div>
    </div>
  );
}
