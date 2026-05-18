<script setup>


import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
const url = 'http://localhost:8081/api/ausschreibungen';
import Button from '@/components/Button.vue'

const ausschreibungen = ref([])
const search = ref('') /*suchleiste*/
const filterAnimal = ref('') /*filter für tierart*/
const filterCompensation = ref('')



onMounted(async () => fetchAusschreibungen())
  
  const filteredAusschreibungen = computed(() => {
  return ausschreibungen.value.filter(a => {

    const searchText = search.value.toLowerCase()
    const matchesSearch =
      a.city.toLowerCase().includes(searchText) ||
      a.animalType.toLowerCase().includes(searchText)

    const matchesAnimal = filterAnimal.value === '' ||
      a.animalType === filterAnimal.value

    const matchesCompensation = filterCompensation.value === '' ||
      a.compensation === filterCompensation.value

    return (
      matchesSearch &&
      matchesAnimal &&
      matchesCompensation
    )
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

 <h1 class="text-center fw-bold mb-4">
  Meine Ausschreibungen

</h1>

<div class="search-box mb-5">

  <input
    v-model="search"
    class="form-control search-input"
    placeholder="Suche nach Tierart oder Ort..."/>

</div>
<div class="filter-bar">
<select
    v-model="filterAnimal"
    class="filter-item">
    <option value="">Alle Tiere</option>
    <option value="DOG">Hund</option>
    <option value="CAT">Katze</option>
    <option value="RABBIT">Kaninchen</option>
    <option value="BIRD">Vogel</option>
  </select>

  <select
    v-model="filterCompensation"
    class="filter-item">
    <option value="">Alle Vergütungen</option>
    <option value="Tausch">Tausch</option>
    <option value="Bezahlung">Bezahlung</option>
  </select>
</div>

  <div class="row g-5">
    <div
      v-for="ausschreibung in filteredAusschreibungen" 
      :key="ausschreibung.id"
      class="col-md-6">

    <AusschreibungCard
    :ausschreibung="ausschreibung"/>

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
.search-box {
  display: flex;
  justify-content: center;
}

.search-input { /* suchleiste*/
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  border: 4px solid #D0A6A6;
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: 0.2s;
}
.search-input:focus {  /* focus -> ändert farbe von rosa zu grün beim anklicken*/
  outline: none;
  border-color: #9BAF96;
  box-shadow: 0 0 8px rgba(155,175,150,0.4);
}

/* Filterleiste so breit wie suchleiste gesamt */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  max-width: 600px;
  width: 100%;
  margin: -10px auto 40px auto;
}

/* einzelne Filter */
.filter-item {
  flex: 1;
  border-radius: 20px;
  border: 4px solid #D0A6A6;
  padding: 12px 15px;
  background-color: white;
  transition: 0.2s;
}

/* Fokus */
.filter-item:focus {
  outline: none;
  border-color: #9BAF96;
  box-shadow: 0 0 8px rgba(155,175,150,0.4);
}

</style>