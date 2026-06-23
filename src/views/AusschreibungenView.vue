<script setup>

import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SearchBar from '@/components/SearchBar.vue'
import Button from '@/components/Button.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'

const url = `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`;
const animalTypeUrl = `${import.meta.env.VITE_API_BASE_URL}/api/animaltype`
const animalTypes = ref([])
const translations = ref({})
const ausschreibungen = ref([])
const filterMonth = ref('')
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

function goBack() {
  window.history.back()
}

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
  let result = ausschreibungen.value.filter(a => {
    if (a.status !== 'VERFUEGBAR') return false

    const searchText = search.value.toLowerCase()
    const matchesSearch =
      a.city.toLowerCase().includes(searchText) ||
      a.postalCode.includes(searchText)

    const matchesCompensation =
      filterCompensation.value === '' ||
      a.compensation === filterCompensation.value

    const matchesAnimal =
      filterAnimal.value === '' ||
      a.animalType === filterAnimal.value

    return matchesSearch && matchesCompensation && matchesAnimal
  })

  //Monat und Jahr Filter
  if (filterMonth.value !== '') {
    result = result.filter(a => {
      const date = new Date(a.dateFrom)

      const yearMonth =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0')

      return yearMonth === filterMonth.value
    })
  }

  return result
})


async function fetchAusschreibungen(){
try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`)}

    ausschreibungen.value = await response.json()
  } catch (error) {
    console.error('Error fetching ausschreibungen:',error)
  }
}

</script>

<template>

<Navbar/>

<section class="container py-5">

  <Button
    variant="secondary"
    class="mb-3"
    @click="goBack"
    >
      ← Zurück
    </Button>
 <h1 class="text-center fw-bold mb-4">
  Ausschreibungen
</h1>

 <SearchBar
  v-model="search"
  placeholder="Suche nach Ort oder PLZ..."
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

<!--Vergütung Filter-->
  <select
    v-model="filterCompensation"
    class="filter-item">
    <option value="">Alle Vergütungen</option>
    <option value="Tausch">Tausch</option>
    <option value="Bezahlung">Bezahlung</option>
  </select>


<!--MonatundJahr-->
<div class="date-wrapper">
<span v-if="!filterMonth" class ="date-placeholder"> Datum wählen </span>

<input
  type="month"
  v-model="filterMonth"
  class="filter-item"
  min="2026-01"
  :placeholder="'Datum wählen'"
/>

</div>
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

.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: center;
  }

  .filter-item {
    width: 100%;
  }

  .date.wrapper{
    display :flex;
    flex-direction: column;
    flex:1;
  }

.date-label{
  font-size:0.9rem;
  color: #777;
  margin-bottom: 5px;
}
.date-input{
  color:black;
}

.date-placeholder {
  position: absolute;
  top: 50%;
  left:50%;
  transform: translateY(-50%,-50%);
  color: #999;
  pointer-events: none;
  font-size: 1rem;
  
}
}


</style>