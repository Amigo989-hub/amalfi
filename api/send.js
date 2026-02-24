import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function pickEmail(body) {
  return (
    body.Email ||
    body.email ||
    body["E-mail"] ||
    body["Email Address"] ||
    body["Ihre E-Mail"] ||
    ""
  );
}

function pickName(body) {
  return (
    body["Ihr Name"] ||
    body["Name"] ||
    body["Vor- Nachname"] ||
    body["Vor- und Nachname"] ||
    body["Full Name"] ||
    ""
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const to = pickEmail(body);
  const name = pickName(body);

  const date = body["Datum"] || body["Date"] || "";
  const time = body["Uhrzeit"] || body["Time"] || "";
  const guests = body["Personen"] || body["Gäste"] || body["Guests"] || "";
  const order = body["Ihre Bestellung"] || body["Bestellung"] || "";

  if (!to) return res.status(400).json({ error: "No email in form data" });

  // Если хочешь различать формы — в Tilda можно добавить скрытое поле form_type
  const formType = body["form_type"] || ""; // "reservation" | "order"
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
    order ? `<p><b>Bestellung:</b><br>${String(order).replace(/\n/g, "<br>")}</p>` : ""
  ].join("");

  try {
    await resend.emails.send({
      from: "Ristorante Amalfi <onboarding@resend.dev>",
      to,
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
      `
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Email send failed" });
  }
}
