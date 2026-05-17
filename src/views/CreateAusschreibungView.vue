<script setup>

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()

const url = 'http://localhost:8081/api/ausschreibungen';

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

async function createAusschreibung() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(ausschreibung.value)
    })
    if (!response.ok) {
      throw new Error(`Fehler beim Erstellen: ${response.status}`)
    }
    alert('Ausschreibung erstellt!')
    router.push('/ausschreibungen')
  } catch (error) {
    console.error('Fehler beim Erstellen der Ausschreibung:', error);
    alert('Ausschreibung konnte nicht erstellt werden')
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
        v-model="ausschreibung.animalType"
      >
        <option disabled value="">
          Bitte wählen
        </option>

        <option value="DOG">
          Hund
        </option>

        <option value="CAT">
          Katze
        </option>

        <option value="RABBIT">
          Kaninchen
        </option>

        <option value="BIRD">
          Vogel
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
        >
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

</style>