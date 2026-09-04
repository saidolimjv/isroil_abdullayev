"use client";

import { useCallback, useState } from "react";
import { Hero, Outcomes, Offer, Footer, StickyBar } from "@/components/Sections";
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
        <Outcomes />
        <Offer onRegister={openForm} />
        <Footer />
      </main>

      <StickyBar onRegister={openForm} />
      <RegisterOverlay open={open} onClose={closeForm} />
    </>
  );
}

