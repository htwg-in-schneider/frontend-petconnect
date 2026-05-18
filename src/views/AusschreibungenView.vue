<script setup>


import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
const url = 'http://localhost:8081/api/ausschreibungen';
import Button from '@/components/Button.vue'

const ausschreibungen = ref([])
const search = ref('')
const filterAnimal = ref('')
const filterCity = ref('')
const filterCompensation = ref('')

onMounted(async () => fetchAusschreibungen())
  
  const filteredAusschreibungen = computed(() => {

  return ausschreibungen.value.filter(a => {

    const matchesSearch =
      a.petName.toLowerCase().includes(search.value.toLowerCase()) ||
      a.city.toLowerCase().includes(search.value.toLowerCase())

    const matchesAnimal =
      filterAnimal.value === '' || a.animalType === filterAnimal.value

    const matchesCity =
      filterCity.value === '' || a.city.toLowerCase().includes(filterCity.value.toLowerCase())

    const matchesCompensation =
      filterCompensation.value === '' || a.compensation === filterCompensation.value

    return matchesSearch && matchesAnimal && matchesCity && matchesCompensation

  })

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

  <h1 class="text-center fw-bold mb-5">
    Meine Ausschreibungen
    <select v-model="filterAnimal" class="form-select mb-2">
    <option value="">Alle Tiere</option>
    <option value="DOG">Hund</option>
    <option value="CAT">Katze</option>
    <option value="RABBIT">Kaninchen</option>
    <option value="BIRD">Vogel</option>
  </select>

  <input
    v-model="filterCity"
    class="form-control mb-2"
    placeholder="Ort filtern"/>

  <select v-model="filterCompensation" class="form-select mb-2">
    <option value="">Alle Vergütungen</option>
    <option value="Tausch">Tausch</option>
    <option value="Bezahlung">Bezahlung</option>
  </select>

  </h1>

  <div class="row g-5">

    <div
      v-for="ausschreibung in filteredAusschreibungen"
      :key="ausschreibung.id"
      class="col-md-6">

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
.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>