<script setup>

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

const route = useRoute()
const ausschreibung = ref(null) // ref, damit es reaktiv ist

const url = 'https://dummyjson.com/products' //testdaten 

onMounted(async () => {
  try {
    const response = await fetch(`${url}/${route.params.id}`) //mit fetch die Daten abruft von derurl, bestimmtes product wird anhand der id geholt
    const data = await response.json()

    //Daten anpassen für unsere Tierkarten
    ausschreibung.value = {
      id: data.id,
      name: data.title,
      age: 2,
      city: "Konstanz",
      date: "01.08.2026",
      type: data.id % 2 === 0 ? "Bezahlung" : "Tausch",
      imageUrl: data.thumbnail,
      description: data.description || "Keine Beschreibung vorhanden"
    }
  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
})

</script>


<template>

<Navbar />

<section
  v-if="ausschreibung"
  class="container py-4"
>

  <router-link
    to="/ausschreibungen"
    class="back-link"
  >
    ←
  </router-link>

  <img
    :src="ausschreibung.imageUrl"
    class="detail-image"
    alt="Tierbild"
  >

  <div class="info-line">

    <img
      src="../assets/images/Green_location_pin_icon.png"
      class="small-icon"
      alt="Standort"
    >

    {{ ausschreibung.city }}

  </div>

  <div class="info-line">

    <img
      src="../assets/images/calendar_icon.png"
      class="small-icon"
      alt="Kalender"
    >

    {{ ausschreibung.date }}

  </div>

  <div class="info-grid">

    <div class="info-box">
      <small>Tierart</small>
      <p>{{ ausschreibung.animalType }}</p>
    </div>

    <div class="info-box">
      <small>Tiername</small>
      <p>{{ ausschreibung.name }}</p>
    </div>

    <div class="info-box">
      <small>Alter</small>
      <p>{{ ausschreibung.age }} Jahre</p>
    </div>

    <div class="info-box">
      <small>Vergütung</small>
      <p>{{ ausschreibung.type }}</p>
    </div>

  </div>

  <div class="description-box">

    <small>Beschreibung</small>

    <p>
      {{ ausschreibung.description }}
    </p>

  </div>

  <div class="button-group">

    <Button variant="accent">
      Anzeige bearbeiten
    </Button>

    <Button variant="accent">
      Anzeige löschen
    </Button>

  </div>

</section>

<Footer />

</template>

<style scoped>

.detail-image {
    width: 100%;
    border-radius: 25px;
    margin-bottom: 20px;
}

.back-link {
    text-decoration: none;
    color: black;
    font-size: 2.5rem;
}

.info-line {
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.small-icon {
    width: 100px;
    margin-right: 10px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 25px;
    font-size: 1.5rem;
}

.info-box {
    border: 2px solid #D0A6A6;
    border-radius: 10px;
    padding: 10px;
}

.description-box {
    border: 2px solid #D0A6A6;
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    font-size: 1.5rem;
}

.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

</style>