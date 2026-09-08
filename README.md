# AI Biznes Seminar — Isroil Abdullayev (20-sentabr, MFaktor, Toshkent)

Next.js 14 + Tailwind. Conversion-focused landing + 2 bosqichli lead forma.

**Seminar parametrlari (final):** 20-sentabr • 10:00–13:00 • 3 soat • Offline •
MFaktor, Toshkent • 200 000 so'm • maksimal 100 ta joy.

## 1. Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev                  # http://localhost:3000
```

## 2. GitHub → Vercel

```bash
git add .
git commit -m "CRO redesign"
git push
```

Vercel'da: **Framework Preset: Next.js**, Root Directory `./`,
`.env.example` dagi kalitlarni Environment Variables ga qo'shing → **Redeploy**.

> Env qo'shgandan keyin Redeploy shart, aks holda yangi qiymat olinmaydi.

## 3. Matnni o'zgartirish

Barcha matn — **`content/site.js`**. Kodga tegmasdan tahrirlanadi:
sana, narx, joy soni, sarlavhalar, kartalar, dastur, FAQ, forma.

## 4. Landing strukturasi

Hero → Kim uchun → 3 transformatsiya → 3 soatda nima qilamiz (7 qadam) →
Sendly proof → Ekspert → Nima olib ketasiz → FAQ → Narx bloki → Footer.

## 5. Bitta sahifa

Sayt bitta `/` sahifadan iborat. A/B variantlar (`/v2`, `/v3`) va
`?audience=` personalizatsiyasi olib tashlangan — sarlavha universal.

UTM parametrlari (`utm_source`, `utm_medium`, ...) hamon o'qiladi va
lead bilan birga Google Sheets'ga yuboriladi.

## 7. Rasm

`public/isroil.webp` — hero va ekspert bloklarida. Almashtirish uchun shu
nomdagi faylni ustiga yozing (kvadrat, fon shaffof, kamida 800×800).

## 8. Integratsiyalar

`app/api/lead/route.js` bitta so'rovda ikkita ishni bajaradi:

1. **Google Sheets** — `GOOGLE_SHEETS_WEBHOOK_URL` orqali jadvalga qator qo'shadi
   (sana, ism, telefon, sahifa, utm_source/medium/campaign/content/term, audience)
2. **Meta CAPI** — `CompleteRegistration` eventini serverdan yuboradi

Brauzerdagi `fbq('track','CompleteRegistration')` va serverdagi CAPI
**bir xil `event_id`** ishlatadi — Meta ularni bitta konversiya deb hisoblaydi.

Ikkalasi `Promise.allSettled` bilan yuboriladi: bittasi ishlamay qolsa ham
foydalanuvchi rahmat ekranini ko'radi va lid yo'qolmaydi.

### Google Sheets o'rnatish
Qadamlar `google-apps-script.js` faylida. Jadval sarlavhalari:
`Sana | Ism | Telefon | Sahifa | utm_source | utm_medium | utm_campaign | utm_content | utm_term | audience`

## 9. Tracking

`lib/analytics.js` — bitta helper. Meta'ga `trackCustom`, GA4 bo'lsa `gtag('event')`:

`hero_cta_click` · `mid_cta_click` · `sticky_cta_click` · `final_cta_click` ·
`form_open` · `form_submit` · `lead_success`

**MUHIM:** standart Meta konversiyasi (`CompleteRegistration`) FAQAT
muvaffaqiyatli lead yuborilgandan keyin fire bo'ladi. CTA bosilganda emas.

UTM va `audience` sessiyaga saqlanadi (birinchi tegib o'tgan manba saqlanadi)
va lead bilan birga backendga yuboriladi.

## 10. Voronka

```
Landing → CTA (hero / mid / sticky / final)
   └─ form_open → to'liq ekran forma: ism + telefon
        └─ form_submit → /api/lead
             └─ Google Sheets + Meta CAPI
                  └─ lead_success → rahmat ekrani → Telegram kanal
```

Forma tugmasi ism va telefon to'liq kiritilmaguncha bosilmaydi —
`CompleteRegistration` faqat to'liq ma'lumot bilan yuboriladi.
