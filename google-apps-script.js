/**
 * ISROIL SEMINAR — Google Sheets webhook
 *
 * Ustunlarni SARLAVHA NOMI bo'yicha to'ldiradi: tartibni o'zgartirsangiz ham,
 * yangi maydon qo'shilsa ham buzilmaydi. Yetishmaydigan ustun o'zi qo'shiladi.
 *
 * ============ O'RNATISH ============
 * 1. Google Sheet → Kengaytmalar → Apps Script
 * 2. Eski kodni BUTUNLAY o'chirib, shu faylni joylashtiring
 * 3. Ctrl+S (saqlash)
 * 4. Deploy → "Manage deployments" (YANGI deployment EMAS!)
 *      → qalam belgisi (✏️) → Version: "New version" → Deploy
 *
 * ⚠️ ENG KO'P UCHRAYDIGAN XATO:
 * "New deployment" bosilsa, Google YANGI URL yaratadi. Vercel'dagi
 * GOOGLE_SHEETS_WEBHOOK_URL esa eski URL'ga ishora qilib turaveradi —
 * natijada jadvalga hamon ESKI kod yozadi. Shuning uchun har doim
 * "Manage deployments → New version" ishlating: URL o'zgarmaydi.
 *
 * ============ TEKSHIRISH ============
 * Web app URL'ini (/exec bilan tugaydigan) brauzerda oching.
 * Javobda "version": "2026-09-12-v3" chiqishi kerak.
 * Boshqa narsa chiqsa yoki xato bersa — eski kod jonli, qayta deploy qiling.
 */

var VERSION = "2026-09-12-v3";

var SHEET_ID = "1bW1G3G6Ew0WFCIn6337OS6UfWok8YHn3ZcxZwcTTq0I";

// Chapdan o'ngga ustunlar tartibi. Jadval bo'sh bo'lsa shular yaratiladi.
// Chap ustun — jadvaldagi sarlavha, o'ng — saytdan keladigan maydon nomi.
var COLUMNS = [
  ["Sana", "submittedAt"],
  ["Ism", "name"],
  ["Telefon", "phone"],
  ["Telefon (format)", "phone_raw"],
  ["Faoliyat turi", "role_label"],
  ["Faoliyat (kod)", "role"],
  ["Sahifa", "pageUrl"],
  ["Variant", "variant"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["audience", "audience"],
  ["event_id", "event_id"],
];

/**
 * Brauzerda /exec manzilini ochsangiz — qaysi versiya JONLI ekanini ko'rsatadi.
 * Agar bu yerda "2026-09-12-v3" chiqmasa, demak eski kod ishlayapti
 * va "New version" bilan qayta deploy qilish kerak.
 */
function doGet() {
  return json({
    ok: true,
    version: VERSION,
    columns: COLUMNS.map(function (c) { return c[0]; }),
  });
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 1) Sarlavha qatorini o'qiymiz; jadval bo'sh bo'lsa — yaratamiz
    var lastCol = sheet.getLastColumn();
    var headers =
      sheet.getLastRow() === 0 || lastCol === 0
        ? []
        : sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    if (headers.join("").trim() === "") {
      headers = COLUMNS.map(function (c) { return c[0]; });
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    // 2) Sarlavha → maydon xaritasi
    var fieldByHeader = {};
    COLUMNS.forEach(function (c) { fieldByHeader[normalize(c[0])] = c[1]; });

    // 3) Qatorni sarlavhalar bo'yicha yig'amiz
    var row = headers.map(function (h) {
      var key = fieldByHeader[normalize(h)] || normalize(h);
      var val = data[key];
      return val === undefined || val === null ? "" : val;
    });

    // 4) Jadvalda yo'q, lekin saytdan kelgan maydonlar — oxiriga yangi ustun
    COLUMNS.forEach(function (c) {
      var header = c[0], key = c[1];
      var exists = headers.some(function (h) { return normalize(h) === normalize(header); });
      if (!exists && data[key] !== undefined && data[key] !== null && data[key] !== "") {
        sheet.getRange(1, headers.length + 1).setValue(header).setFontWeight("bold");
        headers.push(header);
        row.push(data[key]);
      }
    });

    sheet.appendRow(row);

    return json({ ok: true, version: VERSION });
  } catch (err) {
    return json({ ok: false, version: VERSION, error: String(err) });
  }
}

function normalize(s) {
  return String(s).trim().toLowerCase();
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
