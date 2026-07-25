const { createClient } = require("@supabase/supabase-js");

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) throw new Error("Supabase server configuration is missing.");
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch (_) {
    return Object.fromEntries(new URLSearchParams(req.body));
  }
}

function text(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function email(value) {
  const result = text(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result) ? result : "";
}

function escapeHtml(value) {
  return text(value, 5000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function requireStaff(req, res) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) {
    res.status(401).json({ error: "Bitte melden Sie sich an." });
    return null;
  }
  try {
    const admin = getSupabaseAdmin();
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) {
      res.status(401).json({ error: "Die Anmeldung ist abgelaufen." });
      return null;
    }
    const { data: staff, error: staffError } = await admin
      .from("staff_users")
      .select("user_id,email,display_name,active")
      .eq("user_id", authData.user.id)
      .eq("active", true)
      .maybeSingle();
    if (staffError || !staff) {
      res.status(403).json({ error: "Für dieses Konto besteht kein Mitarbeiter-Zugang." });
      return null;
    }
    return { admin, user: authData.user, staff };
  } catch (error) {
    res.status(503).json({ error: "Der Adminbereich ist noch nicht vollständig eingerichtet." });
    return null;
  }
}

module.exports = { getSupabaseAdmin, parseBody, text, email, escapeHtml, requireStaff };

