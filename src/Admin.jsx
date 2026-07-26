import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase.js";

const ORDER_STATUSES = [
  ["new", "Neu"],
  ["accepted", "Angenommen"],
  ["preparing", "In Zubereitung"],
  ["ready", "Abholbereit"],
  ["completed", "Ausgegeben"],
  ["cancelled", "Storniert"],
];

const RESERVATION_STATUSES = [
  ["new", "Neu"],
  ["confirmed", "Bestätigt"],
  ["completed", "Erledigt"],
  ["cancelled", "Storniert"],
];

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const api = async (path, token, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Die Anfrage ist fehlgeschlagen.");
  return payload;
};

function Login({ onSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) return setError("E-Mail-Adresse oder Passwort ist nicht korrekt.");
    onSession(data.session);
  };

  return (
    <main className="admin-login">
      <section className="admin-login-card">
        <img src="/images/logo.png" alt="Ristorante Amalfi" />
        <p className="eyebrow dark">Geschützter Bereich</p>
        <h1>Mitarbeiter-Anmeldung</h1>
        <p>Bestellungen und Reservierungen sicher verwalten.</p>
        <form onSubmit={submit}>
          <label>E-Mail-Adresse<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>
          <label>Passwort<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
          {error && <p className="admin-error">{error}</p>}
          <button className="button primary full" disabled={busy}>{busy ? "Anmeldung läuft …" : "Anmelden"}</button>
        </form>
        <a href="/">Zur Restaurant-Website</a>
      </section>
    </main>
  );
}

function PasswordSetup({ onComplete }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 10) return setError("Das Passwort muss mindestens 10 Zeichen lang sein.");
    if (password !== confirmation) return setError("Die beiden Passwörter stimmen nicht überein.");
    setBusy(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError("Das Passwort konnte nicht gespeichert werden. Bitte öffnen Sie den Einladungslink erneut.");
    window.history.replaceState({}, "", "/admin");
    onComplete();
  };

  return (
    <main className="admin-login">
      <section className="admin-login-card">
        <img src="/images/logo.png" alt="Ristorante Amalfi" />
        <p className="eyebrow dark">Einladung angenommen</p>
        <h1>Passwort festlegen</h1>
        <p>Wählen Sie ein sicheres Passwort für den Mitarbeiterbereich.</p>
        <form onSubmit={submit}>
          <label>Neues Passwort<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="10" autoComplete="new-password" /></label>
          <label>Passwort wiederholen<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength="10" autoComplete="new-password" /></label>
          {error && <p className="admin-error">{error}</p>}
          <button className="button primary full" disabled={busy}>{busy ? "Wird gespeichert …" : "Passwort speichern"}</button>
        </form>
      </section>
    </main>
  );
}

function StatusButtons({ value, statuses, onChange, busy }) {
  return (
    <div className="status-buttons" aria-label="Status ändern">
      {statuses.map(([status, label]) => (
        <button
          key={status}
          className={value === status ? `status-${status} active` : `status-${status}`}
          type="button"
          disabled={busy || value === status}
          onClick={() => onChange(status)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Orders({ rows, updateStatus, updating }) {
  if (!rows.length) return <div className="admin-empty">Noch keine Bestellungen.</div>;
  return (
    <div className="admin-cards">
      {rows.map((order) => (
        <article className={`admin-card ${order.status === "new" ? "is-new" : ""}`} key={order.id}>
          <header>
            <div><span className="record-number">{order.order_number}</span><h2>{order.customer_name}</h2></div>
            <time>{formatDateTime(order.created_at)}</time>
          </header>
          <div className="record-contact">
            <a href={`tel:${order.phone}`}>{order.phone}</a>
            {order.email && <a href={`mailto:${order.email}`}>{order.email}</a>}
            <span>{order.fulfillment === "delivery" ? "Lieferung" : "Abholung"}{order.requested_time ? ` · ${order.requested_time}` : ""}</span>
          </div>
          {order.address && <p className="record-note"><b>Adresse:</b> {order.address}</p>}
          <div className="order-lines">
            {(order.items || []).map((item, index) => <div key={`${item.name}-${index}`}><span>{item.quantity}× {item.name}</span><b>{item.price || ""}</b></div>)}
          </div>
          {order.comment && <p className="record-note"><b>Hinweis:</b> {order.comment}</p>}
          {order.total_cents != null && <p className="record-total">Gesamt: {(order.total_cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>}
          <StatusButtons value={order.status} statuses={ORDER_STATUSES} busy={updating === order.id} onChange={(status) => updateStatus(order.id, status)} />
        </article>
      ))}
    </div>
  );
}

function Reservations({ rows, updateStatus, updating }) {
  if (!rows.length) return <div className="admin-empty">Noch keine Reservierungen.</div>;
  return (
    <div className="admin-cards">
      {rows.map((reservation) => (
        <article className={`admin-card ${reservation.status === "new" ? "is-new" : ""}`} key={reservation.id}>
          <header>
            <div><span className="record-number">Reservierung</span><h2>{reservation.customer_name}</h2></div>
            <time>{formatDateTime(reservation.created_at)}</time>
          </header>
          <div className="reservation-key">
            <strong>{new Intl.DateTimeFormat("de-DE", { dateStyle: "full" }).format(new Date(`${reservation.reservation_date}T12:00:00`))}</strong>
            <span>{reservation.reservation_time.slice(0, 5)} Uhr · {reservation.guests} {reservation.guests === 1 ? "Gast" : "Gäste"}</span>
          </div>
          <div className="record-contact">
            <a href={`tel:${reservation.phone}`}>{reservation.phone}</a>
            {reservation.email && <a href={`mailto:${reservation.email}`}>{reservation.email}</a>}
          </div>
          {reservation.comment && <p className="record-note"><b>Hinweis:</b> {reservation.comment}</p>}
          <StatusButtons value={reservation.status} statuses={RESERVATION_STATUSES} busy={updating === reservation.id} onChange={(status) => updateStatus(reservation.id, status)} />
        </article>
      ))}
    </div>
  );
}

export default function Admin({ inviteMode = false }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(inviteMode);
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const [sound, setSound] = useState(false);
  const knownNew = useRef(new Set());

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const beep = useCallback(() => {
    if (!sound) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 720;
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.4);
  }, [sound]);

  const load = useCallback(async (quiet = false) => {
    if (!session) return;
    try {
      const [ordersData, reservationsData] = await Promise.all([
        api("/api/admin/orders", session.access_token),
        api("/api/admin/reservations", session.access_token),
      ]);
      const newIds = [...ordersData.orders, ...reservationsData.reservations].filter((row) => row.status === "new").map((row) => row.id);
      if (knownNew.current.size && newIds.some((id) => !knownNew.current.has(id))) beep();
      knownNew.current = new Set(newIds);
      setOrders(ordersData.orders);
      setReservations(reservationsData.reservations);
      setError("");
    } catch (loadError) {
      if (!quiet) setError(loadError.message);
    }
  }, [session, beep]);

  useEffect(() => {
    if (!session) return undefined;
    load();
    const timer = window.setInterval(() => load(true), 12000);
    return () => window.clearInterval(timer);
  }, [session, load]);

  const updateStatus = async (type, id, status) => {
    setUpdating(id);
    try {
      await api(`/api/admin/${type}`, session.access_token, { method: "PATCH", body: JSON.stringify({ id, status }) });
      await load(true);
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdating("");
    }
  };

  if (checking) return <main className="admin-loading">Adminbereich wird geladen …</main>;
  if (!supabase) return <main className="admin-loading">Die Supabase-Verbindung ist noch nicht eingerichtet.</main>;
  if (!session) return <Login onSession={setSession} />;
  if (needsPassword) return <PasswordSetup onComplete={() => setNeedsPassword(false)} />;

  const newOrders = orders.filter((row) => row.status === "new").length;
  const newReservations = reservations.filter((row) => row.status === "new").length;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><img src="/images/logo.png" alt="" /><span>Restaurant-Übersicht</span></div>
        <div>
          <button className={sound ? "sound-on" : ""} type="button" onClick={() => setSound((value) => !value)}>Ton {sound ? "an" : "aus"}</button>
          <button type="button" onClick={() => supabase.auth.signOut()}>Abmelden</button>
        </div>
      </header>
      <section className="admin-main">
        <div className="admin-title"><div><p className="eyebrow dark">Heute im Blick</p><h1>Bestellungen & Reservierungen</h1></div><button type="button" onClick={() => load()}>Aktualisieren</button></div>
        {error && <p className="admin-error">{error}</p>}
        <nav className="admin-tabs" aria-label="Bereich auswählen">
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Bestellungen <span>{newOrders}</span></button>
          <button className={tab === "reservations" ? "active" : ""} onClick={() => setTab("reservations")}>Reservierungen <span>{newReservations}</span></button>
        </nav>
        {tab === "orders"
          ? <Orders rows={orders} updating={updating} updateStatus={(id, status) => updateStatus("orders", id, status)} />
          : <Reservations rows={reservations} updating={updating} updateStatus={(id, status) => updateStatus("reservations", id, status)} />}
      </section>
    </main>
  );
}
