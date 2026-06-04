<script setup>

import { ref, onMounted} from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
import Button from '@/components/Button.vue'

const url = 'http://localhost:8081/api/ausschreibungen';

const ausschreibungen = ref([])

onMounted(async () => {
 await Promise.all([
    fetchAusschreibungen(),
  ])
})


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

 <h1 class="text-center fw-bold mb-4">
  Meine Ausschreibungen

</h1>

<div
  v-if="ausschreibungen.length === 0"
  class="no-results"
>
  Du hast noch keine Ausschreibungen erstellt.
</div>

  <div class="row g-5">
  <div
    v-for="ausschreibung in ausschreibungen"
    :key="ausschreibung.id"
    class="col-lg-4 col-md-6"
  >
    <AusschreibungCard
      :ausschreibung="ausschreibung"
    />
  </div>
</div>

  <div class="button-group">
  <RouterLink to="/ausschreibung/create">
    <Button variant="accent">
      Neue Ausschreibung
    </Button>
  </RouterLink>
</div>

</section>

<Footer />

</template>

<style scoped>
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}
.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>