<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

const sendMail = () => {
  const subject = encodeURIComponent("Kontakt aus Impressum")
  const body = encodeURIComponent(
    `Name: ${name.value}\nE-Mail: ${email.value}\n\n${message.value}`
  )

  window.location.href =
    `mailto:deine-mail@domain.de?subject=${subject}&body=${body}`
}

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
      <h1>Impressum</h1>
    
    <div class="adresse-box">
    Hochschule Konstanz <br>
    Technik, Wirtschaft und Gestaltung <br>
    Alfred-Wachtel-Str. 8 <br>
    78462 Konstanz <br><br><br>
    Kontakt <br>
    Jana Duttlinger : Jana.Duttlinger@htwg-konstanz.de<br>
    Bianca König : Bianca.Koenig@htwg-konstanz.de<br><br>
     Hinweis: Diese Website ist ein studentisches Projekt im Rahmen des Moduls Webtechnologien an der HTWG Konstanz.
    </div>
    

<!-- Kontaktformular -->
    <div class="contact-form">
  <h2>Kontaktformular</h2>

  <form @submit.prevent="sendMail">
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="E-Mail" />
    <textarea v-model="message" placeholder="Nachricht"></textarea>

    <button type="submit">Senden</button>
  </form>

</div>
</div>
</section>
<Footer />
</template>

<style scoped>
a {
    color:black;
}

.adresse-box{
  margin-top:40px;
  padding: 15px;
  border: 4px solid #9BAF96;
  border-radius: 20px;
  display: inline-block;
  background: white; 
}

.contact-form {
  margin-top: 40px;
  padding: 20px;
  border: 4px solid #9BAF96;
  border-radius: 20px;
  background: white;
  max-width: 500px;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #D0A6A6;
}

.contact-form button {
  margin-top: 15px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #9BAF96;
  color: white;
  cursor: pointer;
}
</style>
