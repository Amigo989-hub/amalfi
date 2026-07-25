const { getSupabaseAdmin, parseBody, text, email } = require("./_lib/shared");
const { sendReservationEmails } = require("./_lib/mailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Methode nicht erlaubt." });
  const body = parseBody(req);
  if (text(body.website)) return res.status(201).json({ ok: true });

  const reservation = {
    customer_name: text(body.customerName, 120),
    phone: text(body.phone, 60),
    email: email(body.email),
    reservation_date: text(body.date, 10),
    reservation_time: text(body.time, 8),
    guests: Math.max(1, Math.min(30, Number.parseInt(body.guests, 10) || 0)),
    comment: text(body.comment, 1000) || null,
    status: "new",
    email_sent: false,
  };
  const today = new Date().toISOString().slice(0, 10);
  if (!reservation.customer_name || !reservation.phone || !reservation.email || !/^\d{4}-\d{2}-\d{2}$/.test(reservation.reservation_date) || !/^\d{2}:\d{2}/.test(reservation.reservation_time) || reservation.reservation_date < today) {
    return res.status(400).json({ error: "Bitte prüfen Sie Ihre Angaben und wählen Sie ein gültiges Datum." });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from("reservations").insert(reservation).select("id").single();
    if (error) throw error;

    let emailSent = false;
    try {
      await sendReservationEmails(reservation);
      emailSent = true;
      await admin.from("reservations").update({ email_sent: true }).eq("id", data.id);
    } catch (mailError) {
      console.error("[RESERVATION EMAIL]", mailError);
    }
    return res.status(201).json({ ok: true, emailSent });
  } catch (error) {
    console.error("[RESERVATION CREATE]", error);
    return res.status(500).json({ error: "Die Reservierung konnte gerade nicht gespeichert werden. Bitte rufen Sie uns an." });
  }
};

