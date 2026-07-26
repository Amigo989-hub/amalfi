const { parseBody, requireStaff, text } = require("../_lib/shared");

const STATUSES = new Set(["new", "accepted", "preparing", "ready", "completed", "cancelled"]);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Authorization");
  const access = await requireStaff(req, res);
  if (!access) return;
  if (req.method === "GET") {
    const { data, error } = await access.admin.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) return res.status(500).json({ error: "Bestellungen konnten nicht geladen werden." });
    return res.status(200).json({ orders: data || [] });
  }
  if (req.method === "PATCH") {
    const body = parseBody(req);
    const id = text(body.id, 80);
    const status = text(body.status, 40);
    if (!id || !STATUSES.has(status)) return res.status(400).json({ error: "Ungültiger Status." });
    const { error } = await access.admin.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return res.status(500).json({ error: "Status konnte nicht geändert werden." });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: "Methode nicht erlaubt." });
};
