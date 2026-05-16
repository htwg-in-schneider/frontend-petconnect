<script setup>
//import { ausschreibungen } from '@/data.js'

// neu: iteration8a
import { ref, onMounted } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'

const ausschreibungen = ref([])

const url = 'https://dummyjson.com/products'

onMounted(async () => {
  const response = await fetch(url)
  const data = await response.json()
  

  ausschreibungen.value = data.products.map(product => ({
    id: product.id,
    name: product.title,
    age: 2,
    city: "Konstanz",
    date: "01.08.2026",
    type: product.id % 2 === 0 ? "Bezahlung" : "Tausch",
    imageUrl: product.thumbnail
  }))
})
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