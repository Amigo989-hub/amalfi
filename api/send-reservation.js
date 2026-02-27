// api/send-reservation.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function pickEmail(body) {
  const direct =
    body.Email ||
    body.email ||
    body['E-mail'] ||
    body['E-Mail'] ||
    body['Ihre E-Mail'] ||
    body['Ihr E-Mail'] ||
    body['E Mail'] ||
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

  return '';
}

module.exports = async (req, res) => {
  // Healthcheck
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, mode: 'healthcheck', type: 'reservation' });
  }

  // Для Тильды — любые не-POST считаем "OK"
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, mode: 'method_ok_for_tilda', type: 'reservation' });
  }

  let body = req.body || {};

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = Object.fromEntries(new URLSearchParams(body));
    }
  }

  console.log('[RESERVATION] TILDA BODY KEYS:', Object.keys(body));
  console.log('[RESERVATION] TILDA BODY SAMPLE:', body);

  // Тестовый пинг Тильды
  if (body && body.test) {
    return res.status(200).json({ ok: true, mode: 'tilda_test', type: 'reservation' });
  }

  const toEmail = pickEmail(body);

  if (!toEmail) {
    return res.status(400).json({
      error: 'Нет email в данных формы (reservation)',
      received_keys: Object.keys(body),
    });
  }

  const subject = 'Reservierungsanfrage erhalten – Ristorante Amalfi';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
      <p>Vielen Dank für Ihre Reservierungsanfrage.</p>
      <p>
        Wir haben Ihre Anfrage erhalten und prüfen diese schnellstmöglich.
        Die Reservierung ist erst nach unserer persönlichen Bestätigung verbindlich.
      </p>
      <p style="margin-top:20px;">
        Ristorante Amalfi<br>
        Dinkelsbühl
      </p>
    </div>
  `;

  try {
    const payload = {
      from: 'Ristorante Amalfi <info@amalfi-dinkelsbuehl.de>', // домен должен быть верифицирован в Resend
      to: [toEmail],
      subject,
      html: htmlContent,
    };

    console.log('[RESERVATION] RESEND PAYLOAD:', payload);

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('[RESERVATION] RESEND API ERROR:', error);
      return res
        .status(500)
        .json({ error: 'Email send failed (reservation)', details: String(error.message || error) });
    }

    console.log('[RESERVATION] RESEND API SUCCESS:', data);

    return res.status(200).json({ ok: true, type: 'reservation' });
  } catch (e) {
    console.error('[RESERVATION] RESEND EXCEPTION:', e);
    return res.status(500).json({ error: 'Email send failed (reservation, exception)' });
  }
};
