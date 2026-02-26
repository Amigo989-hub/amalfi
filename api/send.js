// api/send.js

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
  // Healthcheck / Tilda URL check
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, mode: 'healthcheck' });
  }

  // Allow other methods so Tilda doesn't complain "URL not available"
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, mode: 'method_ok_for_tilda' });
  }

  let body = req.body || {};

  // If body comes as string: try JSON, else form-urlencoded
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = Object.fromEntries(new URLSearchParams(body));
    }
  }

  console.log('TILDA BODY KEYS:', Object.keys(body));
  console.log('TILDA BODY SAMPLE:', body);

  // Tilda test ping
  if (body && body.test) {
    return res.status(200).json({ ok: true, mode: 'tilda_test' });
  }

  const toEmail = pickEmail(body);

  if (!toEmail) {
    return res.status(400).json({
      error: 'Нет email в данных формы',
      received_keys: Object.keys(body),
    });
  }

  const formType = String(body.form_type || body['form_type'] || '').toLowerCase();
  const isReservation = formType === 'reservation';
  const isOrder = formType === 'order';

  // Если это не reservation и не order — НИЧЕГО не шлём, просто ок для Тильды
  if (!isReservation && !isOrder) {
    console.log('UNSUPPORTED form_type, SKIP SEND. form_type =', formType);
    return res.status(200).json({ ok: true, skipped: true, formType });
  }

  let subject = 'Bestätigung – Ristorante Amalfi';
  let htmlContent = '';

  if (isReservation) {
    subject = 'Reservierungsanfrage erhalten – Ristorante Amalfi';
    htmlContent = `
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
  } else if (isOrder) {
    subject = 'Bestellung eingegangen – Ristorante Amalfi';
    htmlContent = `
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
  }

  // Защита от случайной пустоты (на всякий)
  if (!htmlContent || !htmlContent.trim()) {
    console.error('EMPTY htmlContent FOR form_type =', formType);
    return res.status(500).json({ error: 'Empty email template for form_type ' + formType });
  }

  try {
    const payload = {
      from: 'Ristorante Amalfi <info@amalfi-dinkelsbuehl.de>', // домен должен быть верифицирован в Resend
      to: [toEmail],
      subject,
      html: htmlContent,
    };

    console.log('RESEND PAYLOAD:', payload);

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error('RESEND API ERROR:', error);
      return res
        .status(500)
        .json({ error: 'Email send failed', details: String(error.message || error) });
    }

    console.log('RESEND API SUCCESS:', data);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('RESEND EXCEPTION:', e);
    return res.status(500).json({ error: 'Email send failed (exception)' });
  }
};
