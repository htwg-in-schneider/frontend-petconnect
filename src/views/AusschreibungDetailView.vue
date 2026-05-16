<script setup>

import { useRoute } from 'vue-router'
import { ausschreibungen } from '@/data.js'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

const route = useRoute()

const ausschreibung = ausschreibungen.find(
  a => a.id == route.params.id
)

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