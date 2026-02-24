import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function pickEmail(body) {
  const direct =
    body.Email ||
    body.email ||
    body["E-mail"] ||
    body["E-Mail"] ||
    body["Ihre E-Mail"] ||
    body["Ihr E-Mail"] ||
    body["E Mail"] ||
    body.mail;

  if (direct) return String(direct).trim();

  // fallback: искать по ключам
  for (const [k, v] of Object.entries(body || {})) {
    if (!v) continue;
    if (/e[\s-]?mail/i.test(k)) return String(v).trim();
  }

  // fallback: искать по значению
  for (const v of Object.values(body || {})) {
    if (!v) continue;
    const s = String(v).trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return s;
  }

  return "";
}

function pickName(body) {
  return (
    body["Ihr Name"] ||
    body.Name ||
    body["Vor- und Nachname"] ||
    body["Vor- Nachname"] ||
    body["Full Name"] ||
    ""
  );
}

export const config = {
  api: {
    bodyParser: { sizeLimit: "1mb" },
  },
};

export default async function handler(req, res) {
  // ✅ healthcheck (Тильда/браузер часто дергают GET)
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, mode: "healthcheck" });
  }

  // ✅ остальные методы — тоже 200, чтобы “URL available”
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, mode: "method_ok_for_tilda" });
  }

  let body = req.body || {};

  // иногда приходит строкой
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = Object.fromEntries(new URLSearchParams(body));
    }
  }

  console.log("TILDA BODY KEYS:", Object.keys(body));
  console.log("TILDA BODY SAMPLE:", body);

  // ✅ тестовый пинг Тильды
  if (body && body.test) {
    return res.status(200).json({ ok: true, mode: "tilda_test" });
  }

  const toEmail = pickEmail(body);
  const name = pickName(body);

  if (!toEmail) {
    return res.status(400).json({
      error: "Нет email в данных формы",
      received_keys: Object.keys(body),
    });
  }

  const formType = body.form_type || body["form_type"] || "";
  const date = body.Datum || body.Date || "";
  const time = body.Uhrzeit || body.Time || "";
  const guests = body["Anzahl der Personen"] || body.Personen || body["Gäste"] || "";
  const order = body["Ihre Bestellung"] || body.Bestellung || "";

  const subject =
    formType === "reservation"
      ? "Ihre Reservierung – Ristorante Amalfi"
      : formType === "order"
      ? "Ihre Bestellung – Ristorante Amalfi"
      : "Bestätigung – Ristorante Amalfi";

  const details = [
    date ? `<p><b>Datum:</b> ${date}</p>` : "",
    time ? `<p><b>Uhrzeit:</b> ${time}</p>` : "",
    guests ? `<p><b>Personen:</b> ${guests}</p>` : "",
    order ? `<p><b>Bestellung:</b><br>${String(order).replace(/\n/g, "<br>")}</p>` : "",
  ].join("");

  try {
    await resend.emails.send({
      from: "Ristorante Amalfi <onboarding@resend.dev>",
      to: toEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5; color:#222;">
          <h2 style="margin:0 0 10px;">Vielen Dank${name ? `, ${name}` : ""}!</h2>
          <p style="margin:0 0 12px;">
            Ihre Anfrage ist bei uns eingegangen und wurde automatisch bestätigt.
            Wir melden uns nur, falls Rückfragen bestehen.
          </p>
          ${details}
          <p style="margin:16px 0 0;">Ristorante Amalfi<br>Dinkelsbühl</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("RESEND ERROR:", e);
    return res.status(500).json({ error: "Email send failed" });
  }
}
