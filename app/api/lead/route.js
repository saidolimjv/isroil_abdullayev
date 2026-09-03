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
    sendToAmo({ name, phone, format }),
    sendToTelegram({ name, phone, format }),
    sendToMeta({ name, phone, eventId, pageUrl, fbp, fbc, ua, ip }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(["amo", "telegram", "meta"][i], r.reason?.message || r.reason);
    }
  });

  return Response.json({ ok: true, eventId });
}

/* ------------------------------------ amoCRM ------------------------------------- */
// AMO_FORM_URL va field nomlarini eski loyihadagi qiymatlar bilan to'ldiring.

async function sendToAmo({ name, phone, format }) {
  const url = process.env.AMO_FORM_URL;
  if (!url) return "skipped";

  const data = new URLSearchParams();
  data.append(process.env.AMO_FIELD_NAME || "fields[name]", name);
  data.append(process.env.AMO_FIELD_PHONE || "fields[phone]", phone);
  if (process.env.AMO_FIELD_FORMAT) {
    data.append(process.env.AMO_FIELD_FORMAT, FORMAT_LABEL[format]);
  }
  if (process.env.AMO_FIELD_SOURCE) {
    data.append(process.env.AMO_FIELD_SOURCE, "AI Biznes Seminar 12.09");
  }
  // Amo formasi talab qiladigan qo'shimcha yashirin maydonlar (bo'lsa):
  // AMO_EXTRA="hash=xxx&form_id=123"
  if (process.env.AMO_EXTRA) {
    for (const [k, v] of new URLSearchParams(process.env.AMO_EXTRA)) data.append(k, v);
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data.toString(),
  });
  if (!res.ok) throw new Error("amo " + res.status);
  return "ok";
}

/* ----------------------------------- Telegram ------------------------------------ */

async function sendToTelegram({ name, phone, format }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "skipped";

  const text = [
    "🎯 Yangi lid — AI Biznes Seminar (12-sentabr)",
    "",
    `👤 Ism: ${name}`,
    `📞 Telefon: ${phone}`,
    `📍 Format: ${FORMAT_LABEL[format]}`,
    `🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error("telegram " + res.status);
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
        event_name: "Lead",
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
