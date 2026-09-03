# AI Biznes Seminar — Isroil Abdullayev (12-sentabr, MFaktor)

Next.js 14 + Tailwind. Bitta sahifa + 2 bosqichli ro'yxatdan o'tish (forma → Telegram).

## 1. Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev                  # http://localhost:3000
```

## 2. GitHub → Vercel

```bash
git init
git add .
git commit -m "AI seminar landing"
git branch -M main
git remote add origin https://github.com/USERNAME/isroil-seminar.git
git push -u origin main
```

Vercel'da: **Add New → Project → repo'ni tanlang**

- **Framework Preset:** Next.js (qo'lda tekshiring)
- **Root Directory:** `./` (agar repo ichida papka bo'lsa — `isroil-seminar`)
- **Environment Variables:** `.env.example` dagi barcha kalitlarni qo'shing
- Deploy

> Env o'zgaruvchini qo'shgandan keyin **Redeploy** qilish shart, aks holda yangi qiymat olinmaydi.

## 3. Matnni o'zgartirish

Barcha matn — **`content/site.js`**. Kodga tegmasdan tahrirlash mumkin:
sana, manzil, narx, joy soni, dastur, FAQ, forma va rahmat ekrani.

Countdown `event.startsAt` dan oladi (Toshkent vaqti, `+05:00`).

## 4. Rasm

`public/isroil.jpg` — hero va ekspert bloklarida ishlatiladi.
Almashtirish uchun shu nomdagi faylni ustiga yozing (kvadrat, kamida 800×800).

## 5. Integratsiyalar

`app/api/lead/route.js` bitta so'rovda uchta ishni bajaradi:

1. **amoCRM** — `AMO_FORM_URL` + field nomlari orqali lid yaratadi
2. **Telegram** — guruhga xabar yuboradi
3. **Meta CAPI** — `Lead` eventini serverdan yuboradi

Brauzerdagi `fbq('track','Lead')` va serverdagi CAPI **bir xil `event_id`** ishlatadi —
Meta ularni bitta konversiya deb hisoblaydi (dublikat bo'lmaydi).

Uchtasi ham `Promise.allSettled` bilan yuboriladi: bittasi ishlamay qolsa ham
foydalanuvchi rahmat ekranini ko'radi va lid yo'qolmaydi.

### amoCRM maydonlari

Eski loyihadagi (`isroil-sayt`) `.env` dan `AMO_FORM_URL` va field ID larni ko'chiring.
Agar amo formasi boshqa nom kutsa, `AMO_FIELD_NAME` / `AMO_FIELD_PHONE` ni o'zgartiring.

## 6. Voronka

```
Bosh sahifa
   └─ "SEMINARGA YOZILISH" → InitiateCheckout (Pixel)
        └─ To'liq ekran forma: ism + telefon + (kela olaman / onlayn)
             └─ Lead (Pixel + CAPI) → amoCRM + Telegram bildirishnoma
                  └─ Rahmat ekrani → Telegram kanalga o'tish
```

Formada 2 daqiqalik taymer ishlaydi (joy band qilinganini bildiradi).
Nolga tushganda hech narsa o'zgarmaydi — shunchaki to'xtaydi.
