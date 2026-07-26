const { randomBytes } = require("node:crypto");
const { getSupabaseAdmin, parseBody, text, email } = require("./_lib/shared");
const { sendOrderEmails } = require("./_lib/mailer");
const menu = require("../src/data/menu.json");

const menuItems = new Map();
for (const section of menu) {
  for (const entry of section.entries || []) {
    if (entry.type === "item") menuItems.set(`${section.title}\u0000${entry.name}`, entry);
  }
}

function priceToCents(value) {
  const match = String(value || "").match(/(\d+(?:[.,]\d{1,2}))/);
  if (!match) return null;
  const amount = Number(match[1].replace(",", "."));
  return Number.isFinite(amount) ? Math.round(amount * 100) : null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Methode nicht erlaubt." });
  const body = parseBody(req);
  if (text(body.website)) return res.status(201).json({ ok: true, orderNumber: "AM-OK" });

  const customerName = text(body.customerName, 120);
  const phone = text(body.phone, 60);
  const customerEmail = email(body.email);
  const requestedTime = text(body.requestedTime, 20);
  const comment = text(body.comment, 1000);
  const fulfillment = body.fulfillment === "delivery" ? "delivery" : "pickup";
  const address = fulfillment === "delivery" ? text(body.address, 500) : "";
  const items = Array.isArray(body.items)
    ? body.items.slice(0, 50).map((item) => {
        const name = text(item.name, 180);
        const section = text(item.section, 120);
        const trusted = menuItems.get(`${section}\u0000${name}`);
        if (!trusted) return null;
        return {
          name,
          quantity: Math.max(1, Math.min(30, Number(item.quantity) || 1)),
          price: text(trusted.price, 80),
          section,
        };
      }).filter(Boolean)
    : [];

  if (!customerName || !phone || !customerEmail || !requestedTime || !items.length) {
    return res.status(400).json({ error: "Bitte füllen Sie alle Pflichtfelder aus und wählen Sie mindestens ein Gericht." });
  }

  try {
    const admin = getSupabaseAdmin();
    const orderNumber = `AM-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomBytes(2).toString("hex").toUpperCase()}`;
    const itemTotals = items.map((item) => {
      const unitPrice = priceToCents(item.price);
      return unitPrice === null ? null : unitPrice * item.quantity;
    });
    const totalCents = itemTotals.some((value) => value === null)
      ? null
      : itemTotals.reduce((sum, value) => sum + value, 0);
    const order = {
      order_number: orderNumber,
      customer_name: customerName,
      phone,
      email: customerEmail,
      fulfillment,
      address: address || null,
      requested_time: requestedTime,
      items,
      comment: comment || null,
      total_cents: totalCents,
      status: "new",
      email_sent: false,
    };
    const { data, error } = await admin.from("orders").insert(order).select("id,order_number").single();
    if (error) throw error;

    let emailSent = false;
    try {
      await sendOrderEmails(order);
      emailSent = true;
      await admin.from("orders").update({ email_sent: true }).eq("id", data.id);
    } catch (mailError) {
      console.error("[ORDER EMAIL]", mailError);
    }
    return res.status(201).json({ ok: true, orderNumber: data.order_number, emailSent });
  } catch (error) {
    console.error("[ORDER CREATE]", error);
    return res.status(500).json({ error: "Die Bestellung konnte gerade nicht gespeichert werden. Bitte rufen Sie uns an." });
  }
};
