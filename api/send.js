const { Resend } = require("resend");

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

  for (const [k, v] of Object.entries(body || {})) {
    if (!v) continue;
    if (/e[\s-]?mail/i.test(k)) return String(v).trim();
  }

  for (const v of Object.values(body || {})) {
    if (!v) continue;
    const s = String(v).trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return s;
  }

  return "";
}

module.exports = async (req, res) => {
  // healthcheck
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, mode: "healthcheck" });
  }

  // allow other methods for tilda URL checks
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, mode: "method_ok_for_tilda" });
  }

  let body = req.body || {};

  // if body comes as string
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = Object.fromEntries(new URLSearchParams(body));
    }
  }

  console.log("TILDA BODY KEYS:", Object.keys(body));
  console.log("TILDA BODY SAMPLE:", body);

  // tilda test ping
  if (body && body.test) {
    return res.status(200).json({ ok: true, mode: "tilda_test" });
  }

  const toEmail = pickEmail(body);

  if (!toEmail) {
    return res.status(400).json({
      error: "Нет email в данных формы",
      received_keys: Object.keys(body),
    });
  }

  const formType = String(body.form_type || body["form_type"] || "").toLowerCase();
  const isReservation = formType === "reservation";
  const isOrder = formType === "order";

  let subject = "Bestätigung – Ristorante Amalfi";
  let html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
      <p>Vielen Dank! Wir haben Ihre Anfrage erhalten.</p>
      <p style="margin-top:20px;">Ristorante Amalfi<br>Dinkelsbühl</p>
    </div>
  `;

  if (isReservation) {
    subject = "Reservierungsanfrage erhalten – Ristorante Amalfi";
    html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
        <p>Vielen Dank für Ihre Reservierungsanfrage.</p>
        <p>
          Wir haben Ihre Anfrage erhalten und prüfen diese schnellstmöglich.
          Die Reservierung ist erst nach unserer persönlichen Bestätigung verbindlich.
        </p>
        <p style="margin-top:20px;">Ristorante Amalfi<br>Dinkelsbühl</p>
      </div>
    `;
  } else if (isOrder) {
    subject = "Bestellung eingegangen – Ristorante Amalfi";
    html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
        <p>Vielen Dank für Ihre Bestellung!</p>
        <p>
          Wir haben Ihre Bestellung erhalten und bearbeiten diese umgehend.
          Sollten Rückfragen bestehen, melden wir uns telefonisch oder per E-Mail.
        </p>
        <p style="margin-top:20px;">Ristorante Amalfi<br>Dinkelsbühl</p>
      </div>
    `;
  }

  try {
    await resend.emails.send({
      from: "Ristorante Amalfi <onboarding@resend.dev>", // для теста
      to: toEmail,
      subject,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("RESEND ERROR:", e);
    return res.status(500).json({ error: "Email send failed" });
  }
};
