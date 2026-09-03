"use client";

import { useCallback, useState } from "react";
import {
  Hero,
  Pain,
  Program,
  Fit,
  Expert,
  Offer,
  Faq,
  FinalCta,
  Footer,
  StickyBar,
} from "@/components/Sections";
import RegisterOverlay from "@/components/RegisterOverlay";

export default function Page() {
  const [open, setOpen] = useState(false);

  const openForm = useCallback(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_name: "AI Biznes Seminar",
      });
    }
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <>
      <main className="pb-24 lg:pb-0">
        <Hero onRegister={openForm} />
        <Pain />
        <Program onRegister={openForm} />
        <Fit />
        <Expert />
        <Offer onRegister={openForm} />
        <Faq />
        <FinalCta onRegister={openForm} />
        <Footer />
      </main>

      <StickyBar onRegister={openForm} />
      <RegisterOverlay open={open} onClose={closeForm} />
    </>
  );
}
