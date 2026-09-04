/**
 * ISROIL SEMINAR — Google Sheets webhook
 *
 * O'RNATISH:
 * 1. Yangi yoki mavjud Google Sheet oching.
 * 2. Birinchi qatorga sarlavhalarni qo'ying:
 *    Sana | Ism | Telefon | Format | Sahifa
 * 3. Yuqoridagi menyudan: Kengaytmalar → Apps Script
 * 4. Ochilgan oynadagi barcha kodni o'chirib, shu faylning
 *    to'liq matnini joylashtiring.
 * 5. Saqlang (loyihaga istalgan nom bering, masalan "Seminar webhook").
 * 6. Deploy → New deployment → charxli belgi → Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Deploy tugmasini bosing.
 * 7. Google "unsafe" ogohlantirish chiqarishi mumkin — bu normal,
 *    chunki skript hali tekshiruvdan o'tmagan. "Advanced" →
 *    "Go to [loyiha nomi] (unsafe)" → "Allow" bosing.
 * 8. Chiqqan "Web app URL" (oxiri /exec bilan tugaydi) — shuni
 *    nusxalab, Vercel'ga GOOGLE_SHEETS_WEBHOOK_URL nomi bilan qo'shing.
 *
 * Kodni keyinchalik o'zgartirsangiz: Deploy → Manage deployments →
 * qalam belgisi → Version: New version → Deploy (URL o'zgarmaydi).
 */

function doPost(e) {
  // Diqqat: SHEET_ID ni o'z jadvalingiz manzilidagi
  // /d/ va /edit orasidagi uzun qatorga almashtiring.
  var SHEET_ID = "1bW1G3G6Ew0WFCIn6337OS6UfWok8YHn3ZcxZwcTTq0I";
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || "",
    data.phone || "",
    data.format || "",
    data.pageUrl || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
