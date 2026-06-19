<script setup>

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { validateAusschreibung } from '@/utils/validation'

const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const url = `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`;
const animalTypeUrl =`${import.meta.env.VITE_API_BASE_URL}/api/animaltype`

const animalTypes = ref([])
const translations = ref({})
const ausschreibung = ref({

  petName: '',
  petAge: 0,
  city: '',
  postalCode: '',
  animalType: '',
  description: '',
  dateFrom: '',
  dateTo: '',
  compensation: '',
  imageUrl: ''

})
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
const showSuccess = ref(false)
const showError = ref(false)

onMounted(async () => {

  await Promise.all([
    fetchAnimalTypes(),
    fetchTranslations()
  ])

})

async function createAusschreibung() {
  if (!validateAusschreibung(ausschreibung.value,errors.value)) {
  return
  }
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ausschreibung.value)
    })
    if (!response.ok) {
      console.log('Backend Antwort:',response.status)
      throw new Error(
        `Fehler beim Erstellen: ${response.status}`
      )
    }
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
      router.push('/ausschreibungen')
    }, 2000)
  }
  catch (error) {
    console.error(
      'Fehler beim Erstellen der Ausschreibung:',
      error
    )
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2000)
  }
}

async function fetchAnimalTypes() {
  try {
    const response = await fetch(animalTypeUrl)
    if (response.ok) {
      animalTypes.value =await response.json()
    }
  }
  catch (error) {
    console.error('Error fetching animal types:',error)
  }
}

async function fetchTranslations() {
  try {
    const response = await fetch(`${animalTypeUrl}/translation`)
    if (response.ok) {
      translations.value = await response.json()
    }
  }

  catch (error) {
    console.error('Error fetching translations:',error)
  }
}

</script>

<template>
<Navbar/>
<div class="container py-5">

  <h2 class="mb-4">
    Neue Ausschreibung
  </h2>

  <form
    @submit.prevent="createAusschreibung"
  >

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
      >
      <option
        disabled value="">
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
        @change="errors.compensation = ''"
        v-model="ausschreibung.compensation"
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
        <Button
        type="submit"
        variant="accent"
        >
        Erstellen
        </Button>
    </div>


    <div v-if="showSuccess" class="success-popup">
  Ausschreibung erstellt!
</div>

<div v-if="showError" class="error-popup">
  Ausschreibung konnte nicht erstellt werden!
</div>



  </form>
</div>

<Footer/>
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

  color: white;

  font-size: 2rem;
  font-weight: bold;

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