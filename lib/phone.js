import {
  ALLOWED_OPERATOR_CODES,
  BLACKLISTED_SUBSCRIBER_NUMBERS,
} from "@/content/site";

/**
 * Foydalanuvchi kiritgan yoki paste qilgan matndan 9 ta milliy raqamni ajratadi.
 * Quyidagilarning hammasi to'g'ri o'qiladi:
 *   "+998901234567", "998901234567", "901234567", "90 123 45 67", "(90) 123-45-67"
 */
export function extractDigits(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  // Xalqaro prefiks bilan kelgan bo'lsa (998...), uni olib tashlaymiz.
  // Faqat 9 raqamdan uzun bo'lsa kesamiz — aks holda "998..." bilan
  // boshlanadigan haqiqiy raqamni buzib yuborishimiz mumkin emas,
  // chunki O'zbekistonda mobil kod "99" bo'lishi mumkin ("998" emas).
  if (d.length > 9 && d.startsWith("998")) d = d.slice(3);
  return d.slice(0, 9);
}

/**
 * "901234567" → "90 123-45-67"
 * Qavslar ATAYLAB ishlatilmaydi: yopuvchi qavs oxirida turganda
 * Backspace uni o'chiradi, lekin raqamlar o'zgarmagani uchun maska
 * uni qayta qo'yardi va raqamni o'chirib bo'lmay qolardi.
 * Bu formatda ajratgich hech qachon oxirda turmaydi.
 */
export function formatNational(digits) {
  const d = extractDigits(digits);
  if (!d) return "";
  const code = d.slice(0, 2);
  const a = d.slice(2, 5);
  const b = d.slice(5, 7);
  const c = d.slice(7, 9);

  let out = code;
  if (a) out += " " + a;
  if (b) out += "-" + b;
  if (c) out += "-" + c;
  return out;
}

/** Foydalanuvchiga ko'rinadigan to'liq format: "+998 90 123-45-67" */
export function formatFull(digits) {
  const f = formatNational(digits);
  return f ? "+998 " + f : "";
}

/** E.164, + belgisisiz: "998901234567" */
export function toE164Digits(digits) {
  return "998" + extractDigits(digits);
}

/* --------------------------- Soxta raqamni aniqlash --------------------------- */

function isAllSame(s) {
  return new Set(s).size === 1;
}

function isSequential(s, step) {
  for (let i = 1; i < s.length; i++) {
    if (Number(s[i]) - Number(s[i - 1]) !== step) return false;
  }
  return true;
}

function hasLongRun(s, maxRun) {
  let run = 1;
  for (let i = 1; i < s.length; i++) {
    run = s[i] === s[i - 1] ? run + 1 : 1;
    if (run > maxRun) return true;
  }
  return false;
}

/**
 * Kod (2 raqam) dan keyingi 7 raqamni tekshiradi.
 * true qaytsa — raqam soxta shablonga o'xshaydi.
 */
export function isFakeSubscriber(seven) {
  if (seven.length !== 7) return false;
  if (BLACKLISTED_SUBSCRIBER_NUMBERS.includes(seven)) return true; // f
  if (isAllSame(seven)) return true;                                // a
  if (isSequential(seven, 1)) return true;                          // b
  if (isSequential(seven, -1)) return true;                         // c
  if (hasLongRun(seven, 4)) return true;                            // d (5+ ketma-ket)
  // (e) "faqat 2 xil raqam" qoidasi OLIB TASHLANDI — u 901818881 kabi
  // haqiqiy raqamlarni ham bloklardi.
  return false;
}

/**
 * To'liq validatsiya.
 * @returns {{ok: boolean, reason?: "empty"|"short"|"code"|"fake"}}
 */
export function validatePhone(raw) {
  const d = extractDigits(raw);
  if (!d) return { ok: false, reason: "empty" };
  if (d.length < 9) return { ok: false, reason: "short" };
  if (!ALLOWED_OPERATOR_CODES.includes(d.slice(0, 2))) {
    return { ok: false, reason: "code" };
  }
  if (isFakeSubscriber(d.slice(2))) return { ok: false, reason: "fake" };
  return { ok: true };
}
