<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

function goBack() {
  window.history.back()
}

</script>
<template>

  <Navbar />
  <section class="kontakt py-5">
    <div class="container">
      <Button
    variant="secondary"
    class="mb-3"
    @click="goBack"
    >
      ← Zur Homepage
    </Button>
      
      <h1>Datenschutz</h1>
      <div class="box">
      <h2>1. Verantwortlicher</h2>
        Hochschule Konstanz<br>
        Technik, Wirtschaft und Gestaltung (HTWG)<br>
        Alfred-Wachtel-Str. 8<br>
        78462 Konstanz
    </div>
    <div class="box">
    <h2>2. Allgemeine Hinweise</h2>
      <p>
        Diese Website verarbeitet personenbezogene Daten nur im Rahmen der Nutzung der Plattform.
        Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können
        (z. B. Name, E-Mail-Adresse, IP-Adresse oder Nutzungsdaten).
      </p>

      <h2>3. Zweck der Verarbeitung</h2>
      <p>
        Die Verarbeitung erfolgt zur Bereitstellung der Plattform „PetConnect“,
        insbesondere zur Vermittlung von Tierbetreuungsangeboten,
        Benutzerkommunikation (Chat) und Verwaltung von Anzeigen.
      </p>

      <h2>4. Verarbeitete Daten</h2>
      <ul>
        <li>Stammdaten (z. B. Name, E-Mail-Adresse über Auth0 Login)</li>
        <li>Nutzungsdaten (z. B. erstellte Anzeigen, Nachrichten)</li>
        <li>Technische Daten (z. B. IP-Adresse, Browserinformationen)</li>
      </ul>

      <h2>5. Rechtsgrundlage</h2>
      <p>
        Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
        sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb der Plattform).
      </p>

      <h2>6. Speicherung</h2>
      <p>
        Daten werden nur so lange gespeichert, wie es für die Nutzung der Plattform erforderlich ist
        oder gesetzliche Vorgaben dies verlangen.
      </p>

      <h2>7. Rechte der Nutzer</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über gespeicherte Daten</li>
        <li>Berichtigung falscher Daten</li>
        <li>Löschung Ihrer Daten</li>
        <li>Einschränkung der Verarbeitung</li>
        <li>Widerspruch gegen Verarbeitung</li>
      </ul>

      <h2>8. Beschwerderecht</h2>
      <p>
        Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
      </p>

      <h2>9. Externe Dienste</h2>
      <p>
        Diese Website nutzt Authentifizierungsdienste (z. B. Auth0).
        Die Verarbeitung erfolgt gemäß deren Datenschutzrichtlinien.
      </p>
   </div>
      <div class="box">
        Hinweis: Diese Datenschutzerklärung ist für ein studentisches Projekt erstellt und dient
        der Transparenz im Rahmen der DSGVO-Anforderungen.
      </div>
    </div>
  </section>

  <Footer />
</template>

<style scoped>
datenschutz {
    color:black;
}
.box {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #9BAF96;
  border-radius: 10px;
  display: inline-block;
}
</style>