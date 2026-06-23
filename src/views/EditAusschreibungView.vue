<script setup>

import { ref, onMounted } from 'vue'
import Button from '@/components/Button.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Popup from '@/components/Popup.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { validateAusschreibung }from '@/utils/validation'

import {
  useRoute,
  useRouter
} from 'vue-router'

const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const url =`${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`
const animalTypeUrl =`${import.meta.env.VITE_API_BASE_URL}/api/animaltype`

const animalTypes = ref([])
const translations = ref({})
const ausschreibung = ref({})
const showUpdateSuccess = ref(false)
const showUpdateError = ref(false)
const errors = ref({
  animalType: '',
  petName: '',
  petAge: '',
  city: '',
  postalCode: '',
  description: '',
  dateFrom: '',
  dateTo: '',
  compensation: '',
  imageUrl: ''
})

onMounted(async () => {
  await Promise.all([
    fetchAusschreibung(),
    fetchAnimalTypes(),
    fetchTranslations()
  ])
})


function goBack() {
  router.back()
}

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
  if (!validateAusschreibung(ausschreibung.value,errors.value)) {
  return
  }
  try {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${url}/${ausschreibung.value.id}`,
      {method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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

   <Button
    variant="secondary"
    class="mb-3"
    @click="goBack"
    >
      ← Zurück
    </Button>

  <form @submit.prevent="updateAusschreibung">

    <!-- Tierart -->
    <div class="mb-3">
      <label class="form-label">
        Tierart
      </label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors.animalType }"
        v-model="ausschreibung.animalType"
        @change="errors.animalType = ''"
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
      <div class="invalid-feedback">
          {{ errors.animalType }}
      </div>
    </div>

    <!-- Tiername -->
    <div class="mb-3">
      <label class="form-label">
        Tiername
      </label>
      <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.petName }"
        v-model="ausschreibung.petName"
        @input="errors.petName = ''"
        >

      <div class="invalid-feedback">
        {{ errors.petName }}
      </div>
    </div>

    <!-- Alter -->
    <div class="mb-3">
      <label class="form-label">
        Alter
      </label>
      <input
        type="number"
        class="form-control"
       :class="{ 'is-invalid': errors.petAge }"
        v-model="ausschreibung.petAge"
        @input="errors.petAge = ''"
      >
      <div class="invalid-feedback">
        {{ errors.petAge }}
  </div>
    </div>

    <!-- Beschreibung -->
    <div class="mb-3">
      <label class="form-label">
        Beschreibung
      </label>
      <textarea
        class="form-control description-box"
        :class="{ 'is-invalid': errors.description }"
        v-model="ausschreibung.description"
        @input="errors.description = ''"
      >
      </textarea>
      <div class="invalid-feedback">
        {{ errors.description }}
      </div>
    </div>

    <!-- PLZ -->
    <div class="mb-3">
      <label class="form-label">
        Postleitzahl
      </label>
      <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.postalCode }"
        @input="errors.postalCode = ''"
        v-model="ausschreibung.postalCode"
      >
       <div class="invalid-feedback">
    {{ errors.postalCode }}
  </div>
    </div>

    <!-- Stadt -->
    <div class="mb-3">
      <label class="form-label">
        Stadt
      </label>
      <input
        type="text"
        class="form-control"
       :class="{ 'is-invalid': errors.city }"
        v-model="ausschreibung.city"
        @input="errors.city = ''"
      >
      <div class="invalid-feedback">
     {{ errors.city }}
      </div>
    </div>

    <!-- Vergütung -->
    <div class="mb-3">
      <label class="form-label">
        Vergütung
      </label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors.compensation }"
        v-model="ausschreibung.compensation"
        @change="errors.compensation = ''"
      >
        <option value="Tausch">
          Tausch
        </option>
        <option value="Bezahlung">
          Bezahlung
        </option>
      </select>
      <div class="invalid-feedback">
        {{ errors.compensation }}
      </div>
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
          :class="{ 'is-invalid': errors.dateFrom }"
          @input="errors.dateFrom = ''"
          v-model="ausschreibung.dateFrom"
        >
        <div class="invalid-feedback">
        {{ errors.dateFrom }}
        </div>
      </div>
      <div class="col-6 mb-4">
        <label class="form-label">
          Bis
        </label>
        <input
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.dateTo }"
          @input="errors.dateTo = ''"
          v-model="ausschreibung.dateTo"
        >
        <div class="invalid-feedback">
          {{ errors.dateTo }}
        </div>
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

<Popup
  v-if="showUpdateSuccess"
  type="success"
  text="Ausschreibung erfolgreich aktualisiert!"
/>
<Popup
  v-if="showUpdateError"
  type="error-popup"
  text="Ausschreibung konnte nicht aktualisiert werden!"
/>
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
</style>