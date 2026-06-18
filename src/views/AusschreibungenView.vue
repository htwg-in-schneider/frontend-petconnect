<script setup>

import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SearchBar from '@/components/SearchBar.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'

const url = `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`;
const animalTypeUrl = `${import.meta.env.VITE_API_BASE_URL}/api/animaltype`

const animalTypes = ref([])
const translations = ref({})

const ausschreibungen = ref([])
const search = ref('') /*suchleiste*/
const filterAnimal = ref('') /*filter für tierart*/
const filterCompensation = ref('')



onMounted(async () => {
 await Promise.all([
    fetchAusschreibungen(),
    fetchAnimalTypes(),
    fetchTranslations()
  ])
})

async function fetchAnimalTypes() {
  try {
    const response = await fetch(animalTypeUrl)
    if (response.ok) {
      animalTypes.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching animal types:',error)
  }
}

async function fetchTranslations() {
  try {
    const response = await fetch(`${animalTypeUrl}/translation`)
    if (response.ok) {
      translations.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching translations:',error)
  }
}
  
  const filteredAusschreibungen = computed(() => {
  return ausschreibungen.value.filter(a => {

    const searchText = search.value.toLowerCase()
    const matchesSearch =
      a.city.toLowerCase().includes(searchText) ||
      a.postalCode.includes(searchText)||
      (translations.value[a.animalType] || '').toLowerCase().includes(searchText)

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
  Ausschreibungen

</h1>

 <SearchBar
  v-model="search"
  placeholder="Suche nach Tierart oder Ort..."
/>

<div class="filter-bar">
  <select
    v-model="filterAnimal"
    class="filter-item">
    <option value="">
    Alle Tiere
    </option>
    <option
    v-for="animal in animalTypes"
    :key="animal"
    :value="animal"
  >
    {{ translations[animal] || animal }}
  </option>
  </select>

  <select
    v-model="filterCompensation"
    class="filter-item">
    <option value="">Alle Vergütungen</option>
    <option value="Tausch">Tausch</option>
    <option value="Bezahlung">Bezahlung</option>
  </select>

</div>

<div
  v-if="filteredAusschreibungen.length === 0"
  class="no-results"
>
Keine passenden Ausschreibungen gefunden.
</div>

  <div class="row g-5">
    <div
      v-for="ausschreibung in filteredAusschreibungen" 
      :key="ausschreibung.id"
      class="col-lg-4 col-md-6">

    <AusschreibungCard
    :ausschreibung="ausschreibung"/>

    </div>
</div>

  

</section>

<Footer />

</template>

<style scoped>
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
  border: 2px solid #D0A6A6;
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

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: center;
  }

  .filter-item {
    width: 100%;
  }
}

</style>