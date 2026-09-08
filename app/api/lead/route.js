import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sha256 = (v) =>
  crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex");

const EVENT_PARAMS = {
  content_name: "seminar_20sep",
  value: 200000,
  currency: "UZS",
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const clean = (v, n = 120) => String(v || "").slice(0, n);

  const name = clean(body.name, 80).trim();
  // E.164, faqat raqam: "998901987654"
  const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
  const phoneRaw = clean(body.phone_raw, 32);
  const role = clean(body.role, 24);
  const roleLabel = clean(body.role_label, 64);
  const variant = clean(body.variant, 8) || "v1";
  const pageUrl = clean(body.pageUrl, 300);
  const fbp = clean(body.fbp);
  const fbc = clean(body.fbc);

  const attribution = {
    utm_source: clean(body.utm_source),
    utm_medium: clean(body.utm_medium),
    utm_campaign: clean(body.utm_campaign),
    utm_content: clean(body.utm_content),
    utm_term: clean(body.utm_term),
    audience: clean(body.audience),
  };

  if (name.length < 2 || phone.length < 12) {
    return Response.json({ ok: false, error: "validation" }, { status: 400 });
  }

  // Ikkita ALOHIDA event_id — ikkalasi ham browser+server o'rtasida bir xil
  const eventId = crypto.randomUUID();
  const isQualified = !!role && role !== "other";
  const qualifiedEventId = isQualified ? crypto.randomUUID() : null;

  const ua = req.headers.get("user-agent") || "";
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";

  const shared = { name, phone, pageUrl, fbp, fbc, ua, ip, role };

  const jobs = [
    sendToGoogleSheets({
      name,
      phone,
      phoneRaw,
      role,
      roleLabel,
      variant,
      pageUrl,
      attribution,
      eventId,
    }),
    sendToMeta({ ...shared, eventName: "CompleteRegistration", eventId }),
  ];
  if (qualifiedEventId) {
    jobs.push(
      sendToMeta({ ...shared, eventName: "QualifiedLead", eventId: qualifiedEventId })
    );
  }

  const results = await Promise.allSettled(jobs);
  const labels = ["sheets", "meta:CompleteRegistration", "meta:QualifiedLead"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(labels[i], r.reason?.message || r.reason);
    }
  });

  return Response.json({ ok: true, eventId, qualifiedEventId });
}

/* -------------------------------- Google Sheets ----------------------------------- */

async function sendToGoogleSheets({
  name,
  phone,
  phoneRaw,
  role,
  roleLabel,
  variant,
  pageUrl,
  attribution,
  eventId,
}) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return "skipped";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    body: JSON.stringify({
      name,
      phone,
      phone_raw: phoneRaw,
      role,
      role_label: roleLabel,
      variant,
      pageUrl,
      event_id: eventId,
      submittedAt: new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
      ...attribution,
    }),
  });
  if (!res.ok) throw new Error("sheets " + res.status);
  return "ok";
}

/* --------------------------- Meta Conversions API (CAPI) -------------------------- */

async function sendToMeta({
  name,
  phone,
  eventName,
  eventId,
  pageUrl,
  fbp,
  fbc,
  ua,
  ip,
  role,
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1386235712953904";
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return "skipped";

  const userData = {
    // phone allaqachon E.164 raqamlari: "998901987654"
    ph: [sha256(phone)],
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
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // brauzerdagi fbq bilan bir xil → dedup
        action_source: "website",
        event_source_url: pageUrl,
        user_data: userData,
        custom_data: { ...EVENT_PARAMS, content_category: role },
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
  if (!res.ok) throw new Error(eventName + " " + res.status + " " + (await res.text()));
  return "ok";
}
