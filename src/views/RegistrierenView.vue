<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

</script>

<template>
<Navbar/>

<section class="kontakt py-5">
<div class="container">

<h1>Kontaktformular</h1>

<form 
action="mailto:deineemail@example.com"
method="post"
enctype="text/plain"
class="kontaktformular">

<input 
type="Email"
name="Email"
placeholder="Email"
required />

<input 
type="Passwort"
name="Passwort"
placeholder="Passwort"
required />

<input 
type="Vorname"
name="Vorname"
placeholder="Vorname"
required />

<input 
type="Nachname"
name="Nachname"
placeholder="Nachname"
required />

<button type="submit">
Registrieren
</button>

</form>
</div>
  </section>

  <Footer />

</template>

<style scoped>

.kontaktformular {
display: flex;
flex-direction: column;
gap: 15px;
max-width: 600px;
}

.kontaktformular input,
.kontaktformular button {
padding: 12px;
border-radius: 8px;
border: 1px solid #ccc;
}

@media (max-width: 768px) {

.kontaktformular {
width: 100%;
}

}
</style>
