const { Resend } = require("resend");
const { escapeHtml } = require("./shared");

function getMailer() {
  if (!process.env.RESEND_API_KEY) throw new Error("Resend configuration is missing.");
  return new Resend(process.env.RESEND_API_KEY);
}

const from = () => process.env.RESEND_FROM || "Ristorante Amalfi <info@amalfi-dinkelsbuehl.de>";
const restaurantEmail = () => process.env.RESTAURANT_EMAIL || "ristorante.amalfi@yahoo.de";

async function deliver(payload) {
  const { error } = await getMailer().emails.send(payload);
  if (error) throw new Error(error.message || "E-Mail konnte nicht gesendet werden.");
}

async function sendOrderEmails(order) {
  const lines = order.items
    .map((item) => `<tr><td style="padding:6px 12px 6px 0">${escapeHtml(item.quantity)}× ${escapeHtml(item.name)}</td><td style="padding:6px 0;text-align:right">${escapeHtml(item.price || "")}</td></tr>`)
    .join("");
  const customerHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211a17;max-width:620px">
    <h1 style="font-family:Georgia,serif;color:#4a1f1a">Vielen Dank für Ihre Bestellung</h1>
    <p>Guten Tag ${escapeHtml(order.customer_name)},</p>
    <p>Ihre Bestellanfrage <strong>${escapeHtml(order.order_number)}</strong> ist im Ristorante Amalfi eingegangen.</p>
    <table style="width:100%;border-top:1px solid #ded4c8;border-bottom:1px solid #ded4c8">${lines}</table>
    <p>Gewünschte Abholzeit: <strong>${escapeHtml(order.requested_time || "nach Vereinbarung")}</strong></p>
    <p>Die Bestellung wird verbindlich, sobald sie vom Restaurant bestätigt wurde. Bei Rückfragen melden wir uns telefonisch oder per E-Mail.</p>
    <p>Ristorante Amalfi<br>Segringer Straße 54 · 91550 Dinkelsbühl<br>09851 53535</p>
  </div>`;
  const restaurantHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211a17">
    <h1>Neue Bestellung ${escapeHtml(order.order_number)}</h1>
    <p><strong>${escapeHtml(order.customer_name)}</strong><br>${escapeHtml(order.phone)}<br>${escapeHtml(order.email)}</p>
    <table>${lines}</table>
    <p>Abholzeit: ${escapeHtml(order.requested_time || "nicht angegeben")}<br>Hinweis: ${escapeHtml(order.comment || "–")}</p>
    <p>Die Bestellung ist in der Mitarbeiter-Ansicht verfügbar.</p>
  </div>`;
  await Promise.all([
    deliver({ from: from(), to: [order.email], subject: `Bestellung ${order.order_number} eingegangen – Ristorante Amalfi`, html: customerHtml }),
    deliver({ from: from(), to: [restaurantEmail()], replyTo: order.email, subject: `Neue Bestellung ${order.order_number}`, html: restaurantHtml }),
  ]);
}

async function sendReservationEmails(reservation) {
  const customerHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211a17;max-width:620px">
    <h1 style="font-family:Georgia,serif;color:#4a1f1a">Ihre Reservierungsanfrage ist eingegangen</h1>
    <p>Guten Tag ${escapeHtml(reservation.customer_name)},</p>
    <p>wir haben Ihre Anfrage für <strong>${escapeHtml(reservation.reservation_date)}</strong> um <strong>${escapeHtml(reservation.reservation_time)}</strong> Uhr für <strong>${escapeHtml(reservation.guests)} ${reservation.guests === 1 ? "Person" : "Personen"}</strong> erhalten.</p>
    <p>Die Reservierung wird verbindlich, sobald sie vom Restaurant bestätigt wurde. Bei Rückfragen melden wir uns telefonisch oder per E-Mail.</p>
    <p>Ristorante Amalfi<br>Segringer Straße 54 · 91550 Dinkelsbühl<br>09851 53535</p>
  </div>`;
  const restaurantHtml = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211a17">
    <h1>Neue Reservierungsanfrage</h1>
    <p><strong>${escapeHtml(reservation.customer_name)}</strong><br>${escapeHtml(reservation.phone)}<br>${escapeHtml(reservation.email)}</p>
    <p><strong>${escapeHtml(reservation.reservation_date)} · ${escapeHtml(reservation.reservation_time)} Uhr · ${escapeHtml(reservation.guests)} Gäste</strong></p>
    <p>Hinweis: ${escapeHtml(reservation.comment || "–")}</p>
    <p>Die Anfrage ist in der Mitarbeiter-Ansicht verfügbar.</p>
  </div>`;
  await Promise.all([
    deliver({ from: from(), to: [reservation.email], subject: "Reservierungsanfrage erhalten – Ristorante Amalfi", html: customerHtml }),
    deliver({ from: from(), to: [restaurantEmail()], replyTo: reservation.email, subject: `Neue Reservierung: ${reservation.reservation_date} · ${reservation.reservation_time}`, html: restaurantHtml }),
  ]);
}

module.exports = { sendOrderEmails, sendReservationEmails };

