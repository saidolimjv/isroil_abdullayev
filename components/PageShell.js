"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Hero,
  ForWhom,
  Outcomes,
  Program,
  Proof,
  Expert,
  Takeaways,
  Faq,
  PriceBlock,
  Footer,
  StickyBar,
} from "@/components/Sections";
import RegisterOverlay from "@/components/RegisterOverlay";
import site from "@/content/site";
import { track, captureAttribution, getAudience } from "@/lib/analytics";

/**
 * Barcha variantlar (/, /v2, /v3) shu shell'dan foydalanadi.
 * - `variant` — hero sarlavhasi A/B testi (A | B | C)
 * - ?audience=owner|manager|sales — sarlavha/subtitle personalizatsiyasi
 * Qolgan hamma narsa bitta kod bazasida.
 */
export default function PageShell({ variant = "A" }) {
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState("general");

  // URL'dan audience va utm'larni o'qiymiz (hydration'dan keyin)
  useEffect(() => {
    captureAttribution();
    setAudience(getAudience());
  }, []);

  const openForm = useCallback((source) => {
    track(source || "cta_click", { variant });
    track("form_open", { variant });
    setOpen(true);
  }, [variant]);

  const closeForm = useCallback(() => setOpen(false), []);

  // Ustuvorlik: audience personalizatsiyasi > A/B variant > default
  const aud = site.audiences[audience];
  const title = aud?.title || site.headlineTests[variant]?.title || site.hero.title;
  const subtitle = aud?.subtitle || site.hero.subtitle;

  return (
    <>
      <main>
        <Hero onRegister={openForm} title={title} subtitle={subtitle} />
        <ForWhom />
        <Outcomes />
        <Program onRegister={openForm} />
        <Proof />
        <Expert />
        <Takeaways />
        <Faq />
        <PriceBlock onRegister={openForm} />
        <Footer />
      </main>

      <StickyBar onRegister={openForm} />
      <RegisterOverlay open={open} onClose={closeForm} />
    </>
  );
}
