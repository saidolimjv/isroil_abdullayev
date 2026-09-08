/**
 * ISROIL SEMINAR — Google Sheets webhook
 *
 * O'RNATISH:
 * 1. Google Sheet oching. Birinchi qatorga sarlavhalarni qo'ying:
 *    Sana | Ism | Telefon | Sahifa | utm_source | utm_medium | utm_campaign |
 *    utm_content | utm_term | audience | phone_raw | role | role_label |
 *    variant | event_id
 *
 *    (Yangi ustunlar mavjudlaridan KEYIN qo'shiladi — eski qatorlar buzilmaydi.)
 * 2. Kengaytmalar → Apps Script
 * 3. Ochilgan oynadagi barcha kodni o'chirib, shu faylning matnini joylashtiring.
 * 4. SHEET_ID ni o'z jadvalingiznikiga almashtiring (manzildagi /d/ va /edit orasidagi qator).
 * 5. Saqlang → Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. "unsafe" ogohlantirish chiqsa: Advanced → Go to ... (unsafe) → Allow
 * 7. Chiqqan "Web app URL" (/exec bilan tugaydi) ni Vercel'ga
 *    GOOGLE_SHEETS_WEBHOOK_URL nomi bilan qo'shing.
 *
 * Kodni keyin o'zgartirsangiz: Deploy → Manage deployments → qalam →
 * Version: New version → Deploy (URL o'zgarmaydi).
 */

function doPost(e) {
  var SHEET_ID = "1bW1G3G6Ew0WFCIn6337OS6UfWok8YHn3ZcxZwcTTq0I";
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || "",
    data.phone || "",
    data.pageUrl || "",
    data.utm_source || "",
    data.utm_medium || "",
    data.utm_campaign || "",
    data.utm_content || "",
    data.utm_term || "",
    data.audience || "",
    data.phone_raw || "",
    data.role || "",
    data.role_label || "",
    data.variant || "",
    data.event_id || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
