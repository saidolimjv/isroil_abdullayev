/**
 * ISROIL SEMINAR — Google Sheets webhook
 *
 * Bu versiya ustunlarni SARLAVHA NOMI bo'yicha to'ldiradi.
 * Ya'ni ustunlar tartibini o'zgartirsangiz ham, yangi maydon qo'shilsa ham
 * hech narsa buzilmaydi — skriptni qayta yozish shart emas.
 * Jadval bo'sh bo'lsa, sarlavhalarni o'zi yaratadi.
 *
 * O'RNATISH / YANGILASH:
 * 1. Google Sheet oching → Kengaytmalar → Apps Script
 * 2. Ochilgan oynadagi BARCHA eski kodni o'chirib, shu faylni joylashtiring.
 * 3. SHEET_ID ni tekshiring (jadval manzilidagi /d/ va /edit orasidagi qator).
 * 4. Saqlang (Ctrl+S).
 * 5. MUHIM: Deploy → Manage deployments → qalam belgisi →
 *    Version: "New version" → Deploy.
 *    Agar shuni qilmasangiz, eski kod ishlashda davom etadi
 *    va yangi ustunlar (masalan "role") jadvalga TUSHMAYDI.
 *    Web app URL o'zgarmaydi.
 */

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

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
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
