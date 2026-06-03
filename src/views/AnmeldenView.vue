<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

</script>

<template>
<Navbar/>

<section class="kontakt py-5">
<div class="container">

<h1>Anmelden</h1>

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
type="password"
name="Passwort"
placeholder="Passwort"
required />


<button type="submit">
Anmelden
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

.kontaktformular input{
    padding:12px;
    border-radius:8px;
    border:1px solid #ccc;
}

.kontaktformular button {
padding: 12px;
border-radius: 8px;
border: none;
background-color: #7f927a
}

@media (max-width: 768px) {

.kontaktformular {
width: 100%;
}
}
</style>
