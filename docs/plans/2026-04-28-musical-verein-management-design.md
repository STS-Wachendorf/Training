# Design: Musical Verein Management Tool

## 1. Architektur, Datenbank & Rollen

**Technologie-Stack & Datenbank:**
- React-Single-Page-Application (Vite, TypeScript).
- UI/Styling: Tailwind CSS mit MVPBlocks CLI für Standardkomponenten. Gemini Stitch MCP für komplexe und edle Dashboard-Grafiken.
- Backend & Auth: Supabase (PostgreSQL).
- Responsives Design: Mobile-First, Touch-optimiert für Smartphones und Tablets, sowie Desktop-Ansichten.
- Visueller Stil: "Flexibel & Dynamisch" mit anpassbarem Light/Dark-Theme.

**Benutzerverwaltung & Wartebereich:**
- Einfache Registrierung mit E-Mail, Passwort und Name.
- Neue Nutzer landen automatisch in der Rolle „Wartebereich“. Sie sehen nur eine Willkommensseite, bis sie zugewiesen werden.

**Rollen & Rechte:**
- **Wartebereich:** Kann nur das eigene Profil sehen. Keine Kalender-Sicht.
- **Mitglied:** Kann nach Zuteilung zu Gruppen den Kalender einsehen und Trainings-Zusagen erteilen.
- **Trainer:** Kann Trainings aus Vorlagen aktivieren, Themen festlegen und Nutzer aus dem Wartebereich zu seinen Gruppen zuweisen.
- **Admin:** Volle Kontrolle über alle Nutzer, Gruppen, Vorlagen und System-Einstellungen.

## 2. Gruppen, Kalender und Trainings-Logik

**Gruppen-Struktur & Vorlagen:**
- Admins/Trainer legen Vereinsgruppen an (z.B. "Sopran", "Tanzgarde").
- Trainingstage (Mo-So) werden als wiederkehrende **Vorlagen** (Uhrzeit, Ort) für diese Gruppen definiert.

**Trainings-Kalender & Erstellung:**
- Trainer aktivieren spezifische Trainings aus den Vorlagen für bestimmte Daten.
- Beim Aktivieren tragen sie sich als Leiter ein und fügen ein **Trainingsthema** hinzu.
- Erst danach wird der Termin für die Mitglieder im Kalender sichtbar.

**Mitglieder-Ansicht (Kalender):**
- Kalender oder Listenansicht der aktivierten Trainings.
- Kein Teilnehmerlimit.
- Mitglieder können "Zusagen", "Absagen" oder auf "Vielleicht" setzen (Echtzeit-Updates der Teilnehmerzahlen).

## 3. Supabase Datenbankschema & RLS

- **`users`**: Speichert Rollen (`admin`, `trainer`, `member`, `waiting`) und Profildaten.
- **`groups`**: Vereinsgruppen-Definitionen.
- **`user_groups`**: Relation zwischen Mitgliedern/Trainern und Gruppen.
- **`training_templates`**: Vorlagen für wöchentliche Trainingstage (z.B. Montags 19 Uhr, Gruppe X).
- **`trainings`**: Die konkret aktivierten Termine (Referenz auf Template, Datum, Thema, Leitender Trainer).
- **`attendance`**: Zusage-Status (Mitglied_ID, Training_ID, Status: Zu/Ab/Vielleicht).

**Sicherheit (Row Level Security):**
- Wartebereich-Nutzer können keine Gruppen- oder Trainingsdaten auslesen.
- Mitglieder können nur Trainings der Gruppen sehen, in denen sie eingetragen sind.
