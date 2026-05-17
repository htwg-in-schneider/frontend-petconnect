<script setup>


import { ref, onMounted } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
const url = 'http://localhost:8081/api/ausschreibungen';

const ausschreibungen = ref([])

onMounted(async () => fetchAusschreibungen())
  
async function fetchAusschreibungen(){
try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`)}

    ausschreibungen.value = await response.json()
    console.log(ausschreibungen.value)
  } catch (error) {
    console.error('Error fetching ausschreibungen:',error)
  }
}

</script>

<template>

<Navbar/>

<section class="container py-5">

  <h1 class="text-center fw-bold mb-5">
    Meine Ausschreibungen
  </h1>

  <div class="row g-5">

    <div
      v-for="ausschreibung in ausschreibungen"
      :key="ausschreibung.id"
      class="col-md-6"
    >

    <AusschreibungCard
        :ausschreibung="ausschreibung"
      />

    </div>

  </div>

</section>

<Footer />

</template>