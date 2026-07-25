# Ristorante Amalfi

Website, Bestell- und Reservierungssystem für `amalfi-dinkelsbuehl.de`.

## Bestehende öffentliche Adressen

- `/`
- `/speisekarte`
- `/form`
- `/galerie`
- `/impressum`
- `/datenschutzerklrung`
- `/admin` (geschützt)

Diese Pfade dürfen wegen bestehender QR-Codes nicht entfernt oder umbenannt werden.

## Einrichtung

1. Ein Supabase-Projekt erstellen.
2. Den Inhalt von `supabase/schema.sql` im Supabase SQL Editor ausführen.
3. Unter **Authentication → Users** einen Mitarbeiter mit E-Mail und sicherem Passwort anlegen.
4. Die UUID dieses Benutzers in `staff_users` eintragen:

```sql
insert into public.staff_users (user_id, email, display_name)
values ('AUTH-USER-UUID', 'mitarbeiter@example.de', 'Amalfi Team');
```

5. Die Werte aus `.env.example` im Vercel-Projekt hinterlegen.
6. Erneut deployen.

`SUPABASE_SERVICE_ROLE_KEY` und `RESEND_API_KEY` sind ausschließlich serverseitig. Sie dürfen nie mit `VITE_` beginnen und nicht in Git committed werden.

## Lokal

```bash
npm install
npm run dev
```

Die Formulare benötigen für einen vollständigen lokalen Test zusätzlich eine lokale Vercel-Functions-Umgebung oder ein bereitgestelltes Vercel-Deployment.
