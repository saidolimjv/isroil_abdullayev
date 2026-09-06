"use client";

import { useCallback, useState } from "react";
import { Hero, Outcomes, Offer, Footer, StickyBar } from "@/components/Sections";
import RegisterOverlay from "@/components/RegisterOverlay";

/**
 * Barcha landing variantlari (asosiy sahifa, v2, v3, ...) shu shell'dan
 * foydalanadi. Ular orasidagi FARQ — faqat hero sarlavha/subtitle.
 * Forma, rahmat ekrani, Pixel eventlari — hammasi UMUMIY va bitta joyda.
 */
export default function PageShell({ heroTitle, heroSubtitle }) {
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
        <Hero onRegister={openForm} title={heroTitle} subtitle={heroSubtitle} />
        <Outcomes />
        <Offer onRegister={openForm} />
        <Footer />
      </main>

      <StickyBar onRegister={openForm} />
      <RegisterOverlay open={open} onClose={closeForm} />
    </>
  );
}
