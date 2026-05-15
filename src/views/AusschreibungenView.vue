<script setup>
import { ausschreibungen } from '@/data.js'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
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