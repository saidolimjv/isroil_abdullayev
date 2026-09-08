"use client";

/**
 * Bitta joydan analitika. Meta Pixel'ga custom event, GA4'ga (agar bo'lsa) event.
 *
 * MUHIM: standart Meta "Lead" / "CompleteRegistration" eventi FAQAT
 * muvaffaqiyatli lead yuborilgandan keyin fire bo'ladi (RegisterOverlay ichida).
 * Bu yerdagi eventlar — faqat kuzatuv uchun custom eventlar.
 */
export function track(name, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, params);
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (e) {
    // Analitika hech qachon saytni sindirmasligi kerak
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const STORAGE_KEY = "isroil_attr";

/** URL'dagi utm va audience parametrlarini o'qib, sessiyaga saqlaydi. */
export function captureAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const sp = new URLSearchParams(window.location.search);
    const fresh = {};
    UTM_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) fresh[k] = v.slice(0, 120);
    });
    const audience = sp.get("audience");
    if (audience) fresh.audience = audience.slice(0, 40);

    const prev = readAttribution();
    // Birinchi tegib o'tgan manba saqlanadi, yangilari ustiga yozilmaydi
    const merged = { ...fresh, ...prev };
    if (Object.keys(merged).length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    return {};
  }
}

export function readAttribution() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/** ?audience=... qiymatini qaytaradi (faqat ruxsat etilganlar). */
export function getAudience() {
  if (typeof window === "undefined") return "general";
  try {
    const a = new URLSearchParams(window.location.search).get("audience");
    return ["owner", "manager", "sales"].includes(a) ? a : "general";
  } catch (e) {
    return "general";
  }
}
