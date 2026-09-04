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

`public/isroil.webp` — hero va ekspert bloklarida ishlatiladi.
Almashtirish uchun shu nomdagi faylni ustiga yozing (kvadrat, kamida 800×800).

## 5. Integratsiyalar

`app/api/lead/route.js` bitta so'rovda ikkita ishni bajaradi:

1. **Google Sheets** — `GOOGLE_SHEETS_WEBHOOK_URL` orqali jadvalga qator qo'shadi
2. **Meta CAPI** — `CompleteRegistration` eventini serverdan yuboradi

Brauzerdagi `fbq('track','CompleteRegistration')` va serverdagi CAPI **bir xil `event_id`** ishlatadi —
Meta ularni bitta konversiya deb hisoblaydi (dublikat bo'lmaydi).

Ikkalasi ham `Promise.allSettled` bilan yuboriladi: bittasi ishlamay qolsa ham
foydalanuvchi rahmat ekranini ko'radi va lid yo'qolmaydi.

### Google Sheets o'rnatish

To'liq qadamlar — repo ildizidagi **`google-apps-script.js`** faylida yozilgan.
Qisqacha:

1. Google Sheet oching, birinchi qatorga sarlavha yozing: `Sana | Ism | Telefon | Format | Sahifa`
2. Kengaytmalar → Apps Script → `google-apps-script.js` matnini joylashtiring
3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone
4. Chiqqan URL'ni (oxiri `/exec`) `GOOGLE_SHEETS_WEBHOOK_URL` sifatida Vercel'ga qo'shing

### Telegram kanal tugmasi

`NEXT_PUBLIC_TELEGRAM_URL` — bu lidlarni yig'ish bilan bog'liq emas, shunchaki
rahmat ekranidagi "TELEGRAMGA O'TISH" tugmasi qaysi kanalga olib borishini belgilaydi.

## 6. Voronka

```
Bosh sahifa
   └─ "SEMINARGA YOZILISH" → InitiateCheckout (Pixel)
        └─ To'liq ekran forma: ism + telefon + (kela olaman / onlayn)
             └─ CompleteRegistration (Pixel + CAPI) → Google Sheets
                  └─ Rahmat ekrani → Telegram kanalga o'tish
```

Formada 2 daqiqalik taymer ishlaydi (joy band qilinganini bildiradi).
Nolga tushganda hech narsa o'zgarmaydi — shunchaki to'xtaydi.

Forma tugmasi ("Davom etish") ism, telefon va format — uchtasi ham to'liq
kiritilmaguncha bosilmaydi, shunday qilib `CompleteRegistration` eventi
faqat to'liq ma'lumot bilan yuboriladi.
