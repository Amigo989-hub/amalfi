// api/send-order.js
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
    return res.status(200).json({ ok: true, mode: 'healthcheck', type: 'order' });
  }

  // Для Тильды — любые не-POST считаем "OK"
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, mode: 'method_ok_for_tilda', type: 'order' });
  }

  let body = req.body || {};

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = Object.fromEntries(new URLSearchParams(body));
    }
  }

  console.log('[ORDER] TILDA BODY KEYS:', Object.keys(body));
  console.log('[ORDER] TILDA BODY SAMPLE:', body);

  // Тестовый пинг Тильды
  if (body && body.test) {
    return res.status(200).json({ ok: true, mode: 'tilda_test', type: 'order' });
  }

  const toEmail = pickEmail(body);

  if (!toEmail) {
    return res.status(400).json({
      error: 'Нет email в данных формы (order)',
      received_keys: Object.keys(body),
    });
  }

  const subject = 'Bestellung eingegangen – Ristorante Amalfi';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
      <p>Vielen Dank für Ihre Bestellung!</p>
      <p>
        Wir haben Ihre Bestellung erhalten und bearbeiten diese umgehend.
        Sollten Rückfragen bestehen, melden wir uns telefonisch oder per E-Mail.
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

    console.log('[ORDER] RESEND PAYLOAD:', payload);

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('[ORDER] RESEND API ERROR:', error);
      return res
        .status(500)
        .json({ error: 'Email send failed (order)', details: String(error.message || error) });
    }

    console.log('[ORDER] RESEND API SUCCESS:', data);

    return res.status(200).json({ ok: true, type: 'order' });
  } catch (e) {
    console.error('[ORDER] RESEND EXCEPTION:', e);
    return res.status(500).json({ error: 'Email send failed (order, exception)' });
  }
};