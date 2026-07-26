import React, { useEffect, useMemo, useState } from "react";
import menu from "./data/menu.json";
import Admin from "./Admin.jsx";

const PHONE = "+49985153535";
const WHATSAPP = "4915151163930";
const EMAIL = "ristorante.amalfi@yahoo.de";

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }

function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="topline"><span>Segringer Straße 54 · 91550 Dinkelsbühl</span><a href={`tel:${PHONE}`}>09851 53535</a></div>
    <header className="header">
      <a className="brand" href="/" aria-label="Ristorante Amalfi Startseite"><img src="/images/logo.png" alt="Ristorante Amalfi" /></a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Menü öffnen" aria-expanded={open}><span></span><span></span><span></span></button>
      <nav className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
        <a href="/speisekarte">Speisekarte</a>
        <a href="/#ueber-uns">Über uns</a>
        <a href="/galerie">Galerie</a>
        <a href="/form">Tisch reservieren</a>
        <a className="nav-order" href="/speisekarte#bestellen">Online bestellen</a>
      </nav>
    </header>
  </>;
}

function Footer() {
  return <footer>
    <div className="footer-grid">
      <div><img className="footer-logo" src="/images/logo.png" alt="Ristorante Amalfi" /><p>Italienische Gastlichkeit im Herzen der Dinkelsbühler Altstadt.</p></div>
      <div><h3>Kontakt</h3><a href={`tel:${PHONE}`}>09851 53535</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp schreiben</a></div>
      <div><h3>Besuchen Sie uns</h3><p>Segringer Straße 54<br />91550 Dinkelsbühl</p><a href="https://maps.google.com/?q=Segringer+Straße+54+91550+Dinkelsbühl" target="_blank" rel="noreferrer">Route öffnen ↗</a></div>
      <div><h3>Informationen</h3><a href="/galerie">Galerie</a><a href="/impressum">Impressum</a><a href="/datenschutzerklrung">Datenschutz</a><a href="https://www.facebook.com/p/Ristorante-Amalfi-Vincenzo-Bruno-100055957015167/" target="_blank" rel="noreferrer">Facebook ↗</a></div>
    </div>
    <div className="footer-bottom"><span>© Ristorante Amalfi · Inhaber Vincenzo Bruno</span><span>Technische Umsetzung: <a href="https://www.airravel.com/webdesign-service" target="_blank" rel="noreferrer">Dmytrii</a></span></div>
  </footer>;
}

function Shell({ children }) { return <><Header /><main>{children}</main><Footer /></>; }

function Home() {
  return <Shell>
    <section className="hero">
      <div className="hero-shade"></div>
      <div className="hero-content">
        <div className="hero-brand" aria-label="Ristorante Amalfi Dinkelsbühl">
          <img src="/images/logo.png" alt="Ristorante Amalfi" />
          <span>Dinkelsbühl</span>
        </div>
        <p className="eyebrow">Benvenuti a Dinkelsbühl</p>
        <h1>Ein Stück Amalfi<br />mitten in der Altstadt.</h1>
        <p>Traditionelle italienische Küche, frische Pasta, frischer Fisch und frische Meeresfrüchte – mit Blick auf den Dom.</p>
        <div className="actions"><a className="button primary" href="/form">Tisch reservieren</a><a className="button ghost" href="/speisekarte">Speisekarte ansehen</a></div>
        <div className="hero-trust"><span>Frische Pasta</span><span>Fisch & Meeresfrüchte</span><span>Terrasse am Dom</span></div>
      </div>
    </section>

    <section className="quick-info wrap">
      <div><Icon>⌖</Icon><span><b>Mitten in der Altstadt</b>Segringer Straße 54</span></div>
      <div><Icon>◷</Icon><span><b>Heute einen Tisch sichern</b>Reservierung in wenigen Schritten</span></div>
      <div><Icon>♡</Icon><span><b>Mit Leidenschaft gekocht</b>Frisch und mediterran</span></div>
    </section>

    <section className="about wrap" id="ueber-uns">
      <div className="about-images">
        <div className="about-photo-frame"><img className="about-main" src="/images/gallery-02.webp" alt="Heller Gastraum und Bar des Ristorante Amalfi" /></div>
        <img className="about-small" src="/images/terrace-lamp.jpg" alt="Leuchtende Terrassenlaterne mit Blick auf die Dinkelsbühler Altstadt" />
      </div>
      <div className="about-copy"><p className="eyebrow dark">La dolce vita in Dinkelsbühl</p><h2>Ristorante Amalfi – in der schönen Altstadt</h2>
        <p>Hier erwartet Sie eine Reise durch die italienische Küche mit traditionellen Gerichten, modernen mediterranen Kreationen und ausgesuchten italienischen Weinen.</p>
        <p>Mit unseren Gerichten möchten wir Ihnen ein Stück Lebensgefühl vermitteln und Ihnen den Geschmack Süditaliens näherbringen.</p>
        <p>Lassen Sie sich von uns verwöhnen: in herzlicher Atmosphäre und auf unserer gemütlichen Außenterrasse mit Blick auf den Dom.</p>
        <div className="signature">Vincenzo Bruno <span>· Inhaber</span></div>
      </div>
    </section>

    <section className="hours-section">
      <div className="wrap hours-grid">
        <div><p className="eyebrow">Öffnungszeiten</p><h2>Zeit für einen Abend wie in Italien.</h2><p>Alle Speisen werden frisch zubereitet. Daher bitten wir um Verständnis, wenn es gelegentlich etwas länger dauert.</p><a className="button light" href="/form">Jetzt reservieren</a></div>
        <div className="hours-card"><h3>Reguläre Öffnungszeiten</h3><div><span>Montag</span><b>Ruhetag</b></div><div><span>Dienstag</span><b>17:30–22:00 Uhr</b></div><div><span>Mittwoch–Sonntag</span><b>11:30–14:30 Uhr<br />17:30–22:00 Uhr</b></div><p>Küchenschluss kann abweichen. Rufen Sie uns bei Fragen gerne an.</p></div>
        <div className="hours-card special"><span className="badge">Kinderzeche</span><h3>Besondere Öffnungszeiten</h3><div><span>Montag</span><b>geöffnet</b></div><div><span>Dienstag</span><b>ganztägig geöffnet</b></div><div><span>Mittwoch</span><b>Ruhetag</b></div><div><span>Donnerstag</span><b>ab 17:30 Uhr</b></div></div>
      </div>
    </section>

    <section className="experience wrap"><div><p className="eyebrow dark">Genuss, der bleibt</p><h2>Für den spontanen Lunch. Für den besonderen Abend.</h2></div><div className="experience-cards"><article><span>01</span><h3>Frische Pasta</h3><p>Italienische Pasta-Gerichte, frisch und mit sorgfältig ausgewählten Zutaten zubereitet.</p></article><article><span>02</span><h3>Fisch & Meeresfrüchte</h3><p>Frischer Fisch und mediterrane Meeresfrüchte für echten Geschmack wie am Meer.</p></article><article><span>03</span><h3>Herzlich empfangen</h3><p>Persönlicher Service in warmer, entspannter Atmosphäre.</p></article></div></section>

    <section className="location"><div className="location-card"><p className="eyebrow dark">So finden Sie uns</p><h2>Nur wenige Schritte vom Münster St. Georg.</h2><p>Segringer Straße 54<br />91550 Dinkelsbühl</p><div className="actions"><a className="button primary" href="https://maps.google.com/?q=Segringer+Straße+54+91550+Dinkelsbühl" target="_blank" rel="noreferrer">Route planen</a><a className="text-link" href={`tel:${PHONE}`}>09851 53535</a></div></div></section>
  </Shell>;
}

const gallery = [
  { src: "/images/gallery-01.webp", alt: "Eingang zum Ristorante Amalfi in Dinkelsbühl" },
  { src: "/images/gallery-02.webp", alt: "Heller Gastraum und Bar des Ristorante Amalfi" },
  { src: "/images/gallery-03.webp", alt: "Gedeckter Tisch im italienischen Restaurant" },
  { src: "/images/gallery-04.webp", alt: "Sitzplätze an der Bar im Ristorante Amalfi" },
  { src: "/images/gallery-05.webp", alt: "Mediterrane Details und Steinbogen im Gastraum" },
  { src: "/images/gallery-06.webp", alt: "Frische Blumen an der Bar des Restaurants" },
  { src: "/images/gallery-07.webp", alt: "Barbereich mit italienischem Ambiente" },
  { src: "/images/gallery-08.webp", alt: "Frische Langustinen für die mediterrane Küche" },
  { src: "/images/gallery-09.webp", alt: "Fisch und Meeresfrüchte mit Kräutern und Zitrone" },
  { src: "/images/gallery-10.webp", alt: "Gegrillter Fisch und Garnelen mit Kartoffeln" },
  { src: "/images/gallery-11.webp", alt: "Mediterrane Vorspeisenplatte mit Meeresfrüchten" },
  { src: "/images/gallery-12.webp", alt: "Fisch, Fleisch und Meeresfrüchte vom Grill" },
  { src: "/images/gallery-13.webp", alt: "Große Meeresfrüchteplatte mit gegrilltem Gemüse" },
  { src: "/images/gallery-14.webp", alt: "Frische Pasta mit Garnelen und Calamari" },
  { src: "/images/gallery-15.webp", alt: "Risotto mit Muscheln und Garnelen" },
  { src: "/images/gallery-16.webp", alt: "Frittierte Fischspezialitäten mit Zitrone" },
  { src: "/images/gallery-17.webp", alt: "Gebratene Garnelen mit Tomaten und Rosmarin" },
  { src: "/images/gallery-18.webp", alt: "Safranrisotto mit gegrilltem Oktopus" },
  { src: "/images/gallery-19.webp", alt: "Pasta mit Meeresfrüchten aus der Pfanne" },
  { src: "/images/gallery-20.webp", alt: "Spaghetti mit Garnelen und Calamari" },
  { src: "/images/gallery-21.webp", alt: "Miesmuscheln in mediterranem Sud" },
  { src: "/images/gallery-22.webp", alt: "Frische Tagliolini mit Calamari" },
  { src: "/images/gallery-23.webp", alt: "Gegrillte Dorade mit mediterranem Gemüse" },
  { src: "/images/gallery-24.webp", alt: "Große Garnelen mit Pasta und Zitrone" },
  { src: "/images/gallery-25.webp", alt: "Pasta mit Krabbe in Tomatensauce" },
  { src: "/images/gallery-26.webp", alt: "Frische Krabbe auf Rucola" },
  { src: "/images/gallery-27.webp", alt: "Auswahl an frischen Meeresfrüchten" },
];

function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex === null ? null : gallery[selectedIndex];
  const showImage = (direction) => setSelectedIndex((current) => (current + direction + gallery.length) % gallery.length);
  useEffect(() => {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") showImage(-1);
      if (event.key === "ArrowRight") showImage(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected]);
  return <Shell>
    <section className="page-hero gallery-hero"><div><p className="eyebrow">Ein Blick ins Amalfi</p><h1>Unsere Galerie</h1><p>Italienische Gastlichkeit, mediterraner Genuss und ein besonderer Platz mitten in Dinkelsbühl.</p></div></section>
    <section className="gallery-section wrap">
      <div className="gallery-intro"><h2>Ein Ort zum Ankommen und Genießen.</h2><p>Einblicke in unser Restaurant und frisch zubereitete Spezialitäten. Tippen Sie auf ein Bild, um es größer anzusehen.</p></div>
      <div className="gallery-grid">
        {gallery.map((image, index) => <button type="button" key={image.src} className={`gallery-item gallery-item-${index + 1}`} onClick={() => setSelectedIndex(index)} aria-label={`${image.alt} vergrößern`}><img src={image.src} alt={image.alt} loading={index > 3 ? "lazy" : "eager"} /><span>Bild öffnen</span></button>)}
      </div>
    </section>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Vergrößerte Galerieansicht" onClick={() => setSelectedIndex(null)}>
      <button className="lightbox-close" type="button" aria-label="Galerie schließen" onClick={() => setSelectedIndex(null)}>×</button>
      <button className="lightbox-arrow lightbox-prev" type="button" aria-label="Vorheriges Bild" onClick={(event) => { event.stopPropagation(); showImage(-1); }}>‹</button>
      <figure onClick={(event) => event.stopPropagation()}><img src={selected.src} alt={selected.alt} /><figcaption>{selectedIndex + 1} / {gallery.length}</figcaption></figure>
      <button className="lightbox-arrow lightbox-next" type="button" aria-label="Nächstes Bild" onClick={(event) => { event.stopPropagation(); showImage(1); }}>›</button>
    </div>}
  </Shell>;
}

function OrderCheckout({ items, onClose, onSuccess }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      fulfillment: "pickup",
      requestedTime: form.get("time"),
      comment: form.get("comment"),
      website: form.get("website"),
      items: items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price, section: item.section })),
    };
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Die Bestellung konnte nicht gesendet werden.");
      setStatus(result.emailSent
        ? `Vielen Dank! Ihre Bestellung ${result.orderNumber} wurde übermittelt. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.`
        : `Vielen Dank! Ihre Bestellung ${result.orderNumber} wurde sicher übermittelt. Falls die E-Mail etwas später ankommt, ist Ihre Anfrage trotzdem gespeichert.`);
      onSuccess();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };
  return <div className="checkout-backdrop" role="dialog" aria-modal="true" aria-label="Bestellung abschließen">
    <section className="checkout-panel">
      <button className="checkout-close" type="button" onClick={onClose} aria-label="Fenster schließen">×</button>
      <p className="eyebrow dark">Ihre Bestellung</p><h2>Abholung anfragen</h2>
      <div className="checkout-lines">{items.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.quantity}× {item.name}</span><b>{item.price}</b></div>)}</div>
      {status ? <div className="checkout-result"><p>{status}</p><button className="button primary full" type="button" onClick={onClose}>Schließen</button></div> :
        <form onSubmit={submit}>
          <label>Name *<input name="name" required autoComplete="name" /></label>
          <label>Telefon *<input name="phone" type="tel" required autoComplete="tel" /></label>
          <label>E-Mail *<input name="email" type="email" required autoComplete="email" /></label>
          <label>Gewünschte Abholzeit *<input name="time" type="time" required /></label>
          <label>Hinweis<textarea name="comment" rows="3" placeholder="Allergien oder besondere Wünsche …" /></label>
          <input className="form-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
          <label className="consent"><input type="checkbox" required /><span>Ich habe die <a href="/datenschutzerklrung">Datenschutzerklärung</a> gelesen.</span></label>
          <button className="button primary full" disabled={busy}>{busy ? "Wird gesendet …" : "Bestellung verbindlich anfragen"}</button>
          <small>Die Bestellung wird nach Bestätigung durch das Restaurant verbindlich.</small>
        </form>}
    </section>
  </div>;
}

function MenuPage() {
  const [active, setActive] = useState("Alle");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const categories = menu.map(s => s.title);
  const visible = menu.filter(s => active === "Alle" || s.title === active).map(section => ({...section, entries: section.entries.filter(e => e.type !== "item" || `${e.name} ${e.description}`.toLowerCase().includes(query.toLowerCase()))})).filter(s => s.entries.some(e => e.type === "item"));
  const cartItems = useMemo(() => Object.values(cart).filter(x => x.quantity > 0), [cart]);
  const count = cartItems.reduce((n, x) => n + x.quantity, 0);
  const change = (key, item, section, delta) => setCart(current => ({...current, [key]: {...item, section, quantity: Math.max(0, (current[key]?.quantity || 0) + delta)}}));
  return <Shell>
    <section className="page-hero menu-hero"><div><p className="eyebrow">Von Aperitif bis Dolci</p><h1>Unsere Speisekarte</h1><p>Italienische Klassiker, frische Pasta, frischer Fisch und frische Meeresfrüchte.</p></div></section>
    <section className="menu-tools wrap" id="bestellen"><div className="category-scroll"><button className={active === "Alle" ? "active" : ""} onClick={() => setActive("Alle")}>Alle</button>{categories.map(c => <button key={c} className={active === c ? "active" : ""} onClick={() => setActive(c)}>{c}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Gericht suchen …" /></label></section>
    <section className="menu-layout wrap">
      <div className="menu-list">{visible.map(section => <article className="menu-category" key={section.title}><div className="category-title"><span>{section.title}</span></div>{section.entries.map((entry, i) => {
        if (entry.type === "subtitle") return <div className="menu-subtitle" key={i}><h3>{entry.name}</h3>{entry.description && <p>{entry.description}</p>}</div>;
        if (entry.type === "note") return <p className="menu-note" key={i}>{entry.text}</p>;
        const key = `${section.title}-${i}-${entry.name}`; const qty = cart[key]?.quantity || 0;
        return <div className="dish-row" key={key}><div className="dish-copy"><div className="dish-name"><h3>{entry.name}</h3><b>{entry.price}</b></div>{entry.description && <p>{entry.description}</p>}</div><div className="stepper"><button type="button" onClick={() => change(key, entry, section.title, -1)} aria-label={`${entry.name} entfernen`}>−</button><span>{qty}</span><button type="button" onClick={() => change(key, entry, section.title, 1)} aria-label={`${entry.name} hinzufügen`}>+</button></div></div>;
      })}</article>)}</div>
      <aside className="cart"><span className="badge">Direkt & unkompliziert</span><h2>Ihre Auswahl</h2>{cartItems.length ? <><div className="cart-lines">{cartItems.map((x,i)=><div key={i}><span>{x.quantity}× {x.name}</span><b>{x.price}</b></div>)}</div><button className="button primary full" onClick={() => setCheckoutOpen(true)}>Bestellung abschließen</button><button className="clear" onClick={() => setCart({})}>Auswahl löschen</button></> : <><p>Wählen Sie Gerichte mit <b>+</b>. Anschließend geben Sie Ihre Kontaktdaten und die gewünschte Abholzeit ein.</p><p className="small">Sie erhalten eine Bestätigung per E-Mail.</p></>}<a className="cart-phone" href={`tel:${PHONE}`}>Oder telefonisch: 09851 53535</a></aside>
    </section>
    {count > 0 && <button className="mobile-cart" onClick={() => setCheckoutOpen(true)}>Bestellung abschließen <span>{count}</span></button>}
    {checkoutOpen && <OrderCheckout items={cartItems} onClose={() => setCheckoutOpen(false)} onSuccess={() => setCart({})} />}
  </Shell>;
}

function ReservationPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const f = new FormData(formElement);
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          date: f.get("date"),
          time: f.get("time"),
          guests: f.get("people"),
          comment: f.get("note"),
          website: f.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Die Reservierung konnte nicht gesendet werden.");
      setStatus(result.emailSent
        ? "Vielen Dank! Ihre Reservierungsanfrage wurde übermittelt. Sie erhalten eine Bestätigung per E-Mail. Die Reservierung ist nach Bestätigung durch das Restaurant verbindlich."
        : "Vielen Dank! Ihre Reservierungsanfrage wurde sicher gespeichert. Falls die E-Mail etwas später ankommt, ist Ihre Anfrage trotzdem beim Restaurant eingegangen.");
      formElement.reset();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell><section className="page-hero reserve-hero"><div><p className="eyebrow">Ihr Tisch wartet</p><h1>Tisch reservieren</h1><p>Senden Sie uns Ihre Anfrage – wir bestätigen sie persönlich.</p></div></section><section className="reservation wrap"><div className="reservation-copy"><p className="eyebrow dark">Buona sera</p><h2>Freuen Sie sich auf einen schönen Abend.</h2><p>Füllen Sie das Formular aus. Ihre Anfrage wird sicher übermittelt und Sie erhalten automatisch eine Bestätigung per E-Mail.</p></div><form onSubmit={submit} className="reservation-form"><div className="field wide"><label>Name *</label><input name="name" required autoComplete="name" /></div><div className="field"><label>Telefon *</label><input name="phone" type="tel" required defaultValue="+49 " autoComplete="tel" /></div><div className="field"><label>E-Mail *</label><input name="email" type="email" required autoComplete="email" /></div><div className="field"><label>Datum *</label><input name="date" type="date" required min={new Date().toISOString().split("T")[0]} /></div><div className="field"><label>Uhrzeit *</label><input name="time" type="time" required /></div><div className="field wide"><label>Personen *</label><select name="people" required defaultValue="2">{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n}>{n}</option>)}<option value="11">Mehr als 10</option></select></div><div className="field wide"><label>Wünsche oder Hinweise</label><textarea name="note" rows="4" placeholder="Kinderstuhl, Allergien, besonderer Anlass …"></textarea></div><input className="form-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><label className="consent wide"><input type="checkbox" required /><span>Ich habe die <a href="/datenschutzerklrung">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung der Reservierung zu.</span></label><button className="button primary wide" type="submit" disabled={busy}>{busy ? "Wird gesendet …" : "Reservierungsanfrage senden"}</button>{status && <p className="form-status wide">{status}</p>}</form></section></Shell>;
}

function LegalPage({ privacy = false }) {
  return <Shell><section className="legal wrap"><p className="eyebrow dark">Ristorante Amalfi</p><h1>{privacy ? "Datenschutzerklärung" : "Impressum"}</h1>{privacy ? <PrivacyWithBookings /> : <Imprint />}</section></Shell>;
}

function Imprint() { return <div className="legal-copy"><h2>Angaben gemäß § 5 TMG</h2><p>Ristorante Amalfi<br />Inhaber: Vincenzo Bruno<br />Segringer Straße 54<br />91550 Dinkelsbühl<br />Deutschland</p><p>Telefon: <a href={`tel:${PHONE}`}>09851 53535</a><br />E-Mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p><h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><p>Vincenzo Bruno<br />Segringer Straße 54<br />91550 Dinkelsbühl</p><h2>Haftung für Inhalte</h2><p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p><h2>Haftung für Links</h2><p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p><h2>Urheberrecht</h2><p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p><p>Technische Umsetzung: Dmytrii · <a href="https://www.airravel.com/webdesign-service">airravel.com/webdesign-service</a></p></div>; }

function Privacy() { return <div className="legal-copy"><h2>Präambel</h2><p>Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und den Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend auch kurz „Daten“) im Rahmen der Erbringung unserer Leistungen sowie innerhalb unseres Onlineangebotes und der mit ihm verbundenen Webseiten, Funktionen und Inhalte sowie externen Onlinepräsenzen, wie z. B. unseren Social-Media-Profilen (nachfolgend gemeinsam bezeichnet als „Onlineangebot“).</p><p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p><p><b>Stand: 9. Februar 2026</b></p><h2>Verantwortlicher</h2><p>Ristorante Amalfi<br />Inhaber: Vincenzo Bruno<br />Segringer Straße 54<br />91550 Dinkelsbühl<br />E-Mail-Adresse: <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />Telefon: 09851 53535</p><h2>Übersicht der Verarbeitungen</h2><p>Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p><h2>Kontakt- und Reservierungsanfragen</h2><p>Wenn Sie uns über das auf der Website bereitgestellte Formular (z. B. zur Tischreservierung) kontaktieren, werden die von Ihnen gemachten Angaben zur Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen verarbeitet.</p><h3>Verarbeitete Datenarten</h3><p>– Kontaktdaten (z. B. Name, Telefonnummer, E-Mail-Adresse)<br />– Inhaltsdaten (z. B. Reservierungsdatum, Uhrzeit, Personenanzahl, Nachricht)</p><h3>Zweck der Verarbeitung</h3><p>– Bearbeitung und Organisation von Tischreservierungen<br />– Kommunikation mit Gästen</p><h3>Rechtsgrundlage</h3><p>Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen)</p><h3>Speicherdauer</h3><p>Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.</p><h2>Maßgebliche Rechtsgrundlagen</h2><p>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage der Datenschutz-Grundverordnung (DSGVO). Ergänzend gelten nationale Datenschutzvorschriften, insbesondere das Bundesdatenschutzgesetz (BDSG).</p><h2>Sicherheitsmaßnahmen</h2><p>Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten sowie der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.</p><h2>TLS-/SSL-Verschlüsselung (HTTPS)</h2><p>Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine TLS-/SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.</p><h2>Übermittlung von personenbezogenen Daten</h2><p>Personenbezogene Daten werden nur dann an Dritte weitergegeben, wenn dies zur Vertragserfüllung erforderlich ist, wir gesetzlich dazu verpflichtet sind oder eine Einwilligung vorliegt.</p><h2>Internationale Datentransfers</h2><p>Eine Übermittlung von Daten in Drittländer erfolgt nur im Einklang mit den gesetzlichen Vorgaben der DSGVO.</p><h2>Datenspeicherung und Löschung</h2><p>Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p><h2>Rechte der betroffenen Personen</h2><p>Sie haben das Recht:<br />– auf Auskunft (Art. 15 DSGVO)<br />– auf Berichtigung (Art. 16 DSGVO)<br />– auf Löschung (Art. 17 DSGVO)<br />– auf Einschränkung der Verarbeitung (Art. 18 DSGVO)<br />– auf Datenübertragbarkeit (Art. 20 DSGVO)<br />– auf Widerspruch (Art. 21 DSGVO)</p><p>Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p><h2>Änderung und Aktualisierung</h2><p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder Änderungen unseres Angebots anzupassen.</p><p>Erstellt mit Unterstützung des Datenschutz-Generators von Dr. Thomas Schwenke.</p></div>; }

function NotFound() { return <Shell><section className="not-found wrap"><p className="eyebrow dark">404</p><h1>Diese Seite gibt es nicht.</h1><p>Zurück zu italienischem Genuss.</p><a className="button primary" href="/">Zur Startseite</a></section></Shell>; }

export default function App() {
  const getPath = () => window.location.pathname.replace(/\/$/, "") || "/";
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const syncRoute = () => setPath(getPath());
    const handleInternalLink = (event) => {
      const link = event.target.closest("a");
      if (!link || event.defaultPrevented || event.button !== 0 || link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      event.preventDefault();
      window.history.pushState({}, "", href);
      syncRoute();
      window.scrollTo({ top: 0, behavior: "auto" });
      if (window.location.hash) setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }), 0);
    };
    window.addEventListener("popstate", syncRoute);
    document.addEventListener("click", handleInternalLink);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      document.removeEventListener("click", handleInternalLink);
    };
  }, []);

  if (path === "/") return <Home />;
  if (path === "/speisekarte") return <MenuPage />;
  if (path === "/form") return <ReservationPage />;
  if (path === "/galerie") return <GalleryPage />;
  if (path === "/admin") return <Admin />;
  if (path === "/impressum") return <LegalPage />;
  if (path === "/datenschutzerklrung") return <LegalPage privacy />;
  return <NotFound />;
}

function PrivacyWithBookings() { return <div className="legal-copy">
  <p><b>Stand: 25. Juli 2026</b></p>
  <h2>Verantwortlicher</h2><p>Ristorante Amalfi<br />Inhaber: Vincenzo Bruno<br />Segringer Straße 54<br />91550 Dinkelsbühl<br />Deutschland</p><p>E-Mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />Telefon: 09851 53535</p>
  <h2>Hosting</h2><p>Diese Website wird über Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA, bereitgestellt. Dabei werden technisch notwendige Verbindungs- und Protokolldaten verarbeitet, um die Website sicher und zuverlässig auszuliefern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
  <h2>Bestellungen und Reservierungen</h2><p>Wenn Sie eine Bestellung oder Reservierungsanfrage senden, verarbeiten wir die von Ihnen angegebenen Stamm-, Kontakt- und Inhaltsdaten. Dazu gehören insbesondere Name, Telefonnummer, E-Mail-Adresse, bestellte Gerichte beziehungsweise Reservierungsdatum, Uhrzeit, Gästezahl und freiwillige Hinweise. Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage und zur Durchführung vorvertraglicher Maßnahmen auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</p>
  <h2>Datenbank und Mitarbeiterbereich</h2><p>Zur Speicherung und Verwaltung der Anfragen verwenden wir Supabase, Inc., USA. Die Daten sind nicht öffentlich zugänglich und werden ausschließlich über geschützte Serverzugriffe sowie den autorisierten Mitarbeiterbereich verarbeitet. Wir löschen die Angaben, sobald sie für die Bearbeitung nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
  <h2>E-Mail-Bestätigungen</h2><p>Für den Versand von Eingangsbestätigungen und internen Benachrichtigungen verwenden wir Resend. Dabei werden insbesondere E-Mail-Adresse, Name und die zur Bestätigung erforderlichen Anfrageinformationen verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
  <h2>Datenübermittlung in Drittländer</h2><p>Bei Vercel, Supabase und Resend kann eine Verarbeitung in den USA stattfinden. Eine Übermittlung erfolgt nur unter Beachtung der gesetzlichen Voraussetzungen, insbesondere auf Grundlage eines Angemessenheitsbeschlusses oder geeigneter Garantien wie den Standardvertragsklauseln der Europäischen Kommission.</p>
  <h2>Cookies und Analyse</h2><p>Die öffentliche Restaurant-Website setzt keine Analyse- oder Marketingdienste ein. Im geschützten Mitarbeiterbereich speichert Supabase technisch erforderliche Anmeldeinformationen im Browser, damit Mitarbeiter angemeldet bleiben können.</p>
  <h2>Ihre Rechte</h2><p>Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren.</p>
  <h2>Sicherheit</h2><p>Die Übertragung erfolgt verschlüsselt über HTTPS. Zugriffe auf gespeicherte Bestellungen und Reservierungen sind auf autorisierte Mitarbeiter beschränkt.</p>
</div>; }
