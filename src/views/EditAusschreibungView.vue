<script setup>

import { ref, onMounted } from 'vue'
import Button from '@/components/Button.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

const route = useRoute()
const router = useRouter()

const url =`${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`
const animalTypeUrl =`${import.meta.env.VITE_API_BASE_URL}/api/animaltype`

const animalTypes = ref([])
const translations = ref({})

const ausschreibung = ref({})
const showUpdateSuccess = ref(false)
const showUpdateError = ref(false)

onMounted(async () => {
  await Promise.all([
    fetchAusschreibung(),
    fetchAnimalTypes(),
    fetchTranslations()
  ])
})

async function fetchAusschreibung() {
  const ausschreibungId =route.params.id
  try {
    const response =await fetch(`${url}/${ausschreibungId}`)
    if (!response.ok) {
      throw new Error(
        `Ausschreibung nicht gefunden`)
    }
    ausschreibung.value = await response.json()
  } catch (error) {
    console.error(error)
    alert('Ausschreibung konnte nicht geladen werden.')
    router.push('/ausschreibungen')
  }
}

async function fetchAnimalTypes() {
  try {
    const response =await fetch(animalTypeUrl)
    if (response.ok) {
    animalTypes.value = await response.json()
    }
  }catch (error) {
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

async function updateAusschreibung() {
  try {
    const response = await fetch(`${url}/${ausschreibung.value.id}`,
      {method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          ausschreibung.value
        )
      }
    )
    if (!response.ok) {
      throw new Error()
    }
    showUpdateSuccess.value = true

setTimeout(() => {
  showUpdateSuccess.value = false
  router.push('/ausschreibungen')
  }, 2000)
  }
  catch (error) {
    console.error(error)
   showUpdateError.value = true

setTimeout(() => {
  showUpdateError.value = false
  }, 2000)
  }
}

function cancelEdit() {
  router.push(
    `/ausschreibung/${ausschreibung.value.id}`
  )
}
</script>

<template>
<Navbar/>
<div class="container py-4">
  <h2 class="fw-bold mb-4">
    Ausschreibung bearbeiten
  </h2>

  <form @submit.prevent="updateAusschreibung">

    <!-- Tierart -->
    <div class="mb-3">
      <label class="form-label">
        Tierart
      </label>
      <select
        class="form-select"
        v-model="ausschreibung.animalType"
        required
      >
      <option
        disabled
        value=""
      >
      Bitte wählen

      </option>

      <option
        v-for="animal in animalTypes"
        :key="animal"
        :value="animal"
      >
        {{ translations[animal] || animal }}
      </option>
      </select>
    </div>

    <!-- Tiername -->
    <div class="mb-3">
      <label class="form-label">
        Tiername
      </label>
      <input
        type="text"
        class="form-control"
        v-model="ausschreibung.petName"
      >
    </div>

    <!-- Alter -->
    <div class="mb-3">
      <label class="form-label">
        Alter
      </label>
      <input
        type="number"
        class="form-control"
        v-model="ausschreibung.petAge"
      >
    </div>

    <!-- Beschreibung -->
    <div class="mb-3">
      <label class="form-label">
        Beschreibung
      </label>
      <textarea
        class="form-control description-box"
        v-model="ausschreibung.description">
      </textarea>
    </div>

    <!-- PLZ -->
    <div class="mb-3">
      <label class="form-label">
        Postleitzahl
      </label>
      <input
        type="text"
        class="form-control"
        v-model="ausschreibung.postalCode"
      >
    </div>

    <!-- Stadt -->
    <div class="mb-3">
      <label class="form-label">
        Stadt
      </label>
      <input
        type="text"
        class="form-control"
        v-model="ausschreibung.city"
        required
      >
    </div>

    <!-- Vergütung -->
    <div class="mb-3">
      <label class="form-label">
        Vergütung
      </label>
      <select
        class="form-select"
        v-model="ausschreibung.compensation"
        required
      >
        <option value="Tausch">
          Tausch
        </option>
        <option value="Bezahlung">
          Bezahlung
        </option>
      </select>
    </div>

    <!-- Bild URL -->
    <div class="mb-3">
      <label class="form-label">
        Bild URL
      </label>
      <input
        type="text"
        class="form-control"
        v-model="ausschreibung.imageUrl"
      >
    </div>

    <!-- Bild Vorschau -->
    <div class="text-center mb-4">
      <img
        :src="ausschreibung.imageUrl"
        class="preview-image"
        alt="Tierbild"
      >
    </div>

    <!-- Datum -->
    <div class="row">
      <div class="col-6 mb-4">
        <label class="form-label">
          Von
        </label>
        <input
          type="date"
          class="form-control"
          v-model="ausschreibung.dateFrom"
          required
        >
      </div>
      <div class="col-6 mb-4">
        <label class="form-label">
          Bis
        </label>
        <input
          type="date"
          class="form-control"
          v-model="ausschreibung.dateTo"
          required
        >
      </div>
    </div>

    <!-- Buttons -->
    <div class="button-group">
        <Button type="submit" variant="accent">
        Speichern
        </Button>

        <Button type="button" variant="secondary" @click="cancelEdit">
        Abbrechen
        </Button>
    </div>
  </form>
</div>
<Footer/>

<div
  v-if="showUpdateSuccess"
  class="success-popup">
  Ausschreibung erfolgreich aktualisiert!
</div>
<div
  v-if="showUpdateError"
  class="error-popup">
  Ausschreibung konnte nicht aktualisiert werden!
</div>
</template>
<style scoped>
.container {
  max-width: 500px;
}

.form-control,
.form-select {
  border-radius: 10px;
}

.description-box {
  min-height: 150px;
}

.preview-image {
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
}

.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
}

.success-popup,
.error-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 70px;
  border-radius: 25px;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 9999;
  text-align: center;
  min-width: 400px;
}
.success-popup {
  background-color: #9BAF96;
}
.error-popup {
  background-color: #D0A6A6;
}

</style>