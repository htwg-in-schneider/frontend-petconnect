# PetConnect

**Jana Duttlinger und Bianca König**

PetConnect ist eine Web-Applikation zur Vermittlung von Tierbetreuung. Tierbesitzer können Ausschreibungen erstellen, und Tiersucher können sich als Betreuer bewerben. Die Kommunikation erfolgt über ein integriertes Chat-System.

---


## Benutzerrollen

Rolle: `Unregistrierter Benutzer`   | Kann die Startseite und Ausschreibungen einsehen 
        `TIERBESITZER`              | Kann Ausschreibungen erstellen, bearbeiten und löschen, Betreuungsanfragen annehmen/ablehnen, 
                                    Betreuungen abschließen und Bewertungen schreiben 
        `TIERSUCHER`                | Kann Ausschreibungen einsehen, Betreuungsanfragen stellen und Bewertungen schreiben 
        `ADMIN`                     | Kann alle Benutzer, Ausschreibungen, Meldungen und Bewertungen verwalten 

---

## Implementierung der Use Cases

### UC1 – Über das Konzept informieren

**Frontend:** `HomeView.vue`

Die Startseite ist öffentlich zugänglich und für alle Nutzer sichtbar. Sie enthält eine Erklärung des Konzepts in der „So funktioniert's"-Sektion. Links zu Impressum (`/impressum`) und Datenschutz (`/datenschutz`) sind im Footer vorhanden. Der Button „Ausschreibung hochladen" leitet nicht eingeloggte Nutzer direkt zum Auth0-Login weiter.

---

### UC2 – Registrieren

**Frontend:** Auth0-Login-Popup  
**Backend:** `DataLoader.java` (Testaccounts), `ProfileController.java`

Die Registrierung erfolgt über Auth0. Neue Nutzer werden beim ersten Login automatisch in der Datenbank angelegt. Die Rolle (TIERBESITZER / TIERSUCHER) kann vom Admin in der Benutzerverwaltung gesetzt werden. Eine Selbstregistrierung mit Rollenwahl ist aus Sicherheitsgründen nicht implementiert.

---

### UC3 – Anmelden

**Frontend:** `UserMenu.vue`, `Navbar.vue`  
**Backend:** `SecurityConfig.java`, Auth0 JWT-Validierung

Die Anmeldung erfolgt über den „Anmelden"-Button in der Navbar, der Auth0 aufruft. Nach erfolgreichem Login wird der JWT-Token für alle API-Anfragen verwendet. Die Navbar zeigt rollenbasiert unterschiedliche Menüpunkte an.

---

### UC4 – Ausschreibungen ansehen

**Frontend:** `AusschreibungenView.vue`, `AusschreibungCard.vue`, `AusschreibungDetailView.vue`  
**Backend:** `AusschreibungController.java` – `GET /api/ausschreibungen`, `GET /api/ausschreibungen/{id}`

Die Ausschreibungsübersicht ist öffentlich zugänglich. Es werden nur Ausschreibungen mit Status `VERFUEGBAR` angezeigt. Per Klick auf eine Karte gelangt man zur Detailseite mit allen Informationen zum Tier und zum Tierbesitzer.

---

### UC5 – Profil verwalten

**Frontend:** `ProfileView.vue`  
**Backend:** `ProfileController.java` – `GET /api/profile`, `PUT /api/profile`

Jeder eingeloggte Nutzer kann Vorname, Nachname und Adresse bearbeiten. Die Rolle kann nicht selbst geändert werden. Validierung erfolgt im Frontend (`validateProfile` in `validation.js`) und im Backend (`@Valid`, `@NotBlank`).

---

### UC6 – Erhaltene Bewertungen ansehen

**Frontend:** `MeineBewertungenView.vue` (Route: `/meine-bewertungen`)  
**Backend:** `ReviewController.java` – `GET /api/review/mine`, `GET /api/review/user/{userId}/average`

Über „Meine Bewertungen" in der Navbar können TIERBESITZER und TIERSUCHER ihre erhaltenen Bewertungen mit Sternebewertung, Kommentar und Bewerternamen einsehen. Der Durchschnitt aller erhaltenen Bewertungen wird oben angezeigt. Auf der Ausschreibungs-Detailseite wird der Bewertungsdurchschnitt des Owners ebenfalls angezeigt.

---

### UC7 – Erhaltene Nachrichten ansehen

**Frontend:** `MeineNachrichtenView.vue` (Route: `/meine-nachrichten`), `ChatView.vue`  
**Backend:** `MessageController.java` – `GET /api/messages/overview`, `GET /api/messages/chat/{userId}/{ausschreibungId}`

Über „Meine Nachrichten" in der Navbar sehen Nutzer eine Übersicht aller aktiven Chats mit dem letzten Nachrichteninhalt. Per Klick öffnet sich der Chat. Neue Nachrichten werden alle 3 Sekunden automatisch geladen.

---

### UC8 – Betreuungsanfrage senden

**Frontend:** `ChatView.vue`  
**Backend:** `BetreuungsanfrageController.java` – `POST /api/anfragen`, `POST /api/anfragen/{id}/accept`, `POST /api/anfragen/{id}/reject`

Im Chat kann der Tiersucher über den 🤝-Button eine Betreuungsanfrage senden. Diese erscheint als spezielle Nachrichtenkarte im Chat. Der Tierbesitzer kann die Anfrage direkt im Chat annehmen oder ablehnen. Bei Annahme wechselt der Status der Ausschreibung auf `VERGEBEN`. Eine Anfrage ist nur möglich wenn die Ausschreibung den Status `VERFUEGBAR` hat.

---

### UC8 (2) – Profil melden

**Frontend:** `AusschreibungDetailView.vue`, `ReportPopup.vue`  
**Backend:** `MeldungController.java` – `POST /api/meldungen/{userId}`

Auf der Ausschreibungs-Detailseite kann ein eingeloggter Nutzer über „Benutzer melden" den Owner einer Ausschreibung melden. Es müssen Grund und Beschreibung (10–500 Zeichen) angegeben werden. Validierung erfolgt im Frontend (`validateReport` in `validation.js`) und im Backend (`@Valid`, `@NotBlank`, `@Size`). Ein Nutzer kann sich nicht selbst melden.

---

### UC9 – Benutzer kontaktieren

**Frontend:** `AusschreibungDetailView.vue`, `ChatView.vue`  
**Backend:** `MessageController.java` – `POST /api/messages`

Auf der Ausschreibungs-Detailseite gibt es einen „Nachricht"-Button, der zum Chat mit dem Tierbesitzer führt. Nachrichten können nur zwischen Nutzern gesendet werden, die mit der Ausschreibung verknüpft sind. Das Backend prüft diese Berechtigung.

---

### UC10 – Filter auswählen / Suchleiste

**Frontend:** `AusschreibungenView.vue`, `SearchBar.vue`  
**Backend:** Filterung erfolgt im Frontend (computed property)

Die Ausschreibungsübersicht bietet eine Suchleiste (nach Ort oder PLZ) sowie vier Filter: Tierart, Vergütung, Monat und Jahr. Die Filterung geschieht clientseitig auf den bereits geladenen Daten.

> **Hinweis zu hart-kodierten Werten:** Die Monatsnamen im Monatsfilter (`Januar` bis `Dezember`) sind hart-kodiert. Dies ist unvermeidbar, da `<input type="month">` von Firefox nicht unterstützt wird und eine browserübergreifende Lösung nur mit zwei separaten `<select>`-Feldern möglich ist. Die 12 Monate des Jahres sind universelle Konstanten und keine fachlichen Geschäftswerte. Die verfügbaren Jahre werden hingegen dynamisch aus den vorhandenen Ausschreibungen berechnet (`availableYears` computed property).

---

### UC11 – Bewertung abgeben

**Frontend:** `ChatView.vue`, `ReviewForm.vue`  
**Backend:** `ReviewController.java` – `POST /api/review`

Nach Abschluss einer Betreuung (Status `ABGESCHLOSSEN`) erscheint im Chat der Button „Bewertung schreiben". Beide Parteien (Owner und Betreuer) können sich gegenseitig bewerten. Das Formular enthält eine Sternebewertung (1–5) mit Hover-Effekt und Beschriftung sowie ein Kommentarfeld (3–1000 Zeichen). Pro Ausschreibung kann jeder Nutzer nur einmal bewerten. Nach dem Absenden verschwindet der Button.

---

### UC12 – Ausschreibungen verwalten (TIERBESITZER)

**Frontend:** `MeineAusschreibungenView.vue`, `CreateAusschreibungView.vue`, `EditAusschreibungView.vue`, `AusschreibungDetailView.vue`  
**Backend:** `AusschreibungController.java` – `GET /api/ausschreibungen/meine`, `POST /api/ausschreibungen`, `PUT /api/ausschreibungen/{id}`, `DELETE /api/ausschreibungen/{id}`

Tierbesitzer können unter „Meine Ausschreibungen" ihre eigenen Ausschreibungen einsehen. Der Status jeder Ausschreibung wird farblich als Badge angezeigt (grün = verfügbar, gelb = vergeben, rot = abgeschlossen). Neue Ausschreibungen können über „Neue Ausschreibung" erstellt werden. Bestehende können bearbeitet oder nach Bestätigung gelöscht werden. Validierung erfolgt im Frontend (`validateAusschreibung` in `validation.js`) und im Backend (`@Valid`, Bean Validation).

---

### UC13 – Benutzerverwaltung (ADMIN)

**Frontend:** `AdminView.vue` (Route: `/admin`)  
**Backend:** `UserController.java` – `GET /api/users`, `PUT /api/users/{id}`

Admins sehen eine Tabelle aller Nutzer mit Name, E-Mail, Rolle und Bewertungsdurchschnitt. Es kann nach Name oder E-Mail gesucht werden. Über „Bearbeiten" können Vorname, Nachname und Rolle eines Nutzers angepasst werden. Das Anlegen neuer Nutzer ist nicht vorgesehen – dies erfolgt über Auth0.

---

### UC14 – Ausschreibungen verwalten (ADMIN)

**Frontend:** `AdminAusschreibungenView.vue` (Route: `/admin/ausschreibungen`)  
**Backend:** `AusschreibungController.java` – `GET /api/ausschreibungen`, `DELETE /api/ausschreibungen/{id}`

Admins sehen alle Ausschreibungen mit Tier, Ort, Besitzer und Status-Badge. Es kann nach Tiername oder Besitzer gesucht werden. Über „Bearbeiten" gelangt man zur Detailseite, über „Löschen" kann eine Ausschreibung nach Bestätigung gelöscht werden. Nach dem Löschen wird der Admin zurück zu `/admin/ausschreibungen` geleitet.

---

### UC15 – Moderation (ADMIN)

**Frontend:** `AdminMeldungenView.vue` (Route: `/admin/meldungen`)  
**Backend:** `MeldungController.java`, `ReviewController.java`

Die Moderationsseite ist in zwei Tabs aufgeteilt:

**Tab „Gemeldete Profile":** Zeigt alle Meldungen mit gemeldetem Nutzer, meldendem Nutzer, Grund und Beschreibung. Admins können Meldungen nach Prüfung löschen.

**Tab „Bewertungen":** Zeigt alle Bewertungen mit Bewerter, Bewertetem, Tier, Sternebewertung und Kommentar. Admins können unangemessene Bewertungen löschen.

---

## Sicherheit

- Alle schreibenden Endpunkte sind durch JWT-Authentifizierung via Auth0 gesichert.
- Die Rollenprüfung erfolgt im Backend über die Datenbank (nicht nur über den JWT-Payload).
- Validierung findet sowohl im Frontend (vor dem Absenden, `validation.js`) als auch im Backend (`@Valid`, Bean Validation) statt.
- Cascading Delete stellt sicher, dass beim Löschen einer Ausschreibung alle verknüpften Daten (Anfragen, Nachrichten, Bewertungen) mitgelöscht werden.

---
