import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sha256 = (v) =>
  crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex");

const FORMAT_LABEL = {
  offline: "Toshkentda offline qatnashadi",
  online: "Onlayn qatnashmoqchi",
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").replace(/[^\d+]/g, "").slice(0, 16);
  const format = body.format === "online" ? "online" : "offline";
  const pageUrl = String(body.pageUrl || "");
  const fbp = String(body.fbp || "");
  const fbc = String(body.fbc || "");

  if (name.length < 2 || phone.replace(/\D/g, "").length < 12) {
    return Response.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const eventId = crypto.randomUUID();
  const ua = req.headers.get("user-agent") || "";
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";

  const results = await Promise.allSettled([
    sendToGoogleSheets({ name, phone, format, pageUrl }),
    sendToMeta({ name, phone, eventId, pageUrl, fbp, fbc, ua, ip }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(["sheets", "meta"][i], r.reason?.message || r.reason);
    }
  });

  return Response.json({ ok: true, eventId });
}

/* -------------------------------- Google Sheets ----------------------------------- */
// Google Apps Script Web App orqali. O'rnatish uchun README dagi "Google Sheets"
// bo'limiga qarang — bitta link (GOOGLE_SHEETS_WEBHOOK_URL) kifoya, API key kerak emas.

async function sendToGoogleSheets({ name, phone, format, pageUrl }) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return "skipped";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // redirect: "follow" — Apps Script /exec ko'pincha 302 bilan javob beradi
    redirect: "follow",
    body: JSON.stringify({
      name,
      phone,
      format: FORMAT_LABEL[format],
      pageUrl,
      submittedAt: new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
    }),
  });
  if (!res.ok) throw new Error("sheets " + res.status);
  return "ok";
}

/* --------------------------- Meta Conversions API (CAPI) -------------------------- */

async function sendToMeta({ name, phone, eventId, pageUrl, fbp, fbc, ua, ip }) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1386235712953904";
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return "skipped";

  const userData = {
    ph: [sha256(phone.replace(/\D/g, ""))],
    fn: [sha256(name.split(" ")[0])],
    country: [sha256("uz")],
  };
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // brauzerdagi fbq bilan bir xil — dublikat bo'lmaydi
        action_source: "website",
        event_source_url: pageUrl,
        user_data: userData,
        custom_data: {
          content_name: "AI Biznes Seminar",
          value: 197000,
          currency: "UZS",
        },
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("meta " + res.status + " " + (await res.text()));
  return "ok";
}
