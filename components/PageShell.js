"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Hero,
  ForWhom,
  Outcomes,
  Program,
  Expert,
  Takeaways,
  Faq,
  PriceBlock,
  Footer,
  StickyBar,
} from "@/components/Sections";
import RegisterOverlay from "@/components/RegisterOverlay";
import { track, captureAttribution } from "@/lib/analytics";

export default function PageShell() {
  const [open, setOpen] = useState(false);

  // UTM parametrlarini sessiyaga saqlaymiz (lead bilan birga yuboriladi)
  useEffect(() => {
    captureAttribution();
  }, []);

  const openForm = useCallback((source) => {
    track(source || "cta_click");
    track("form_open");
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <>
      <main>
        <Hero onRegister={openForm} />
        <ForWhom />
        <Outcomes />
        <Program onRegister={openForm} />
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
