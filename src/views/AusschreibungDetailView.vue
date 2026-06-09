<script setup>

import { ref, onMounted } from 'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import AusschreibungReview from '@/components/AusschreibungReview.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const router = useRouter()
const ausschreibung = ref(null) // ref, damit es reaktiv ist
const translations = ref({})
const { isAuthenticated, getAccessTokenSilently } = useAuth0()

const role = ref(null)
const canEdit = ref(false)

const url = 'http://localhost:8081/api/ausschreibungen';
const animalTypeUrl ='http://localhost:8081/api/animaltype'

onMounted(async () => {
  await loadRole()
  await fetchTranslations()
  try {
    const response = await fetch(`${url}/${route.params.id}`) //mit fetch die Daten abruft von derurl, bestimmtes product wird anhand der id geholt
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    ausschreibung.value = await response.json();
    console.log(ausschreibung.value);
  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
})


  const showDeleteSuccess = ref(false)
const showConfirmDelete = ref(false)

function askDeleteConfirmation() {

  showConfirmDelete.value = true

}
function cancelDelete() {
  showConfirmDelete.value = false

}

async function deleteAusschreibung() {
  showConfirmDelete.value = false
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(
  `${url}/${ausschreibung.value.id}`,
  {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
    if (!response.ok) {
    throw new Error()
    }
    showDeleteSuccess.value = true
    setTimeout(() => {
    showDeleteSuccess.value = false
    router.push('/ausschreibungen')
  }, 2000)
  }
  catch (error) {
    console.error(error)
    alert(
      'Ausschreibung konnte nicht gelöscht werden.'
    )
  }
}

function formatDate(dateString) {

  return new Date(dateString)
    .toLocaleDateString('de-DE')

}

async function fetchTranslations() {
  try {
    const response = await fetch( `${animalTypeUrl}/translation`)
    if (response.ok) {
      translations.value = await response.json()
    }
  }catch (error) {
 console.error('Error fetching translations:',error)
  }
}

async function loadRole() {
  if (!isAuthenticated.value) {
    return
  }
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(
      'http://localhost:8081/api/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
      const user = await response.json()
      role.value = user.role
      canEdit.value = user.role === 'TIERBESITZER'
      || user.role === 'ADMIN'
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>

<Navbar />

<section
  v-if="ausschreibung"
  class="container py-4"
>

  <router-link
    to="/ausschreibungen"
    class="back-link"
  >
    ←
  </router-link>

  <img
    :src="ausschreibung.imageUrl"
    class="detail-image"
    alt="Tierbild"
  >

  <div class="info-line">

    <img
      src="../assets/images/Green_location_pin_icon.png"
      class="small-icon"
      alt="Standort"
    >

    {{ ausschreibung.city }}

  </div>

  <div class="info-line">

    <img
      src="../assets/images/calendar_icon.png"
      class="small-icon"
      alt="Kalender"
    >

    {{ formatDate(ausschreibung.dateFrom) }} - {{ formatDate(ausschreibung.dateTo) }}
  </div>

  <div class="info-grid">

    <div class="info-box">
      <small>Tierart</small>
      <p>{{translations[ausschreibung.animalType] ||
          ausschreibung.animalType}}
      </p>
    </div>

    <div class="info-box">
      <small>Tiername</small>
      <p>{{ ausschreibung.petName }}</p>
    </div>

    <div class="info-box">
      <small>Alter</small>
      <p>{{ ausschreibung.petAge }} Jahre</p>
    </div>

    <div class="info-box">
      <small>Vergütung</small>
      <p>{{ ausschreibung.compensation }}</p>
    </div>

  </div>

  <div class="description-box">

    <small>Beschreibung</small>

    <p>
      {{ ausschreibung.description }}
    </p>

  </div>

  <div v-if="canEdit" class="button-group">
    <RouterLink
    :to="`/ausschreibung/edit/${ausschreibung.id}`">
    <Button variant="accent">
      Bearbeiten
    </Button>
    </RouterLink>

    <Button
  variant="secondary"
  @click="askDeleteConfirmation">
  Anzeige löschen
</Button>
  </div>
</section>

<AusschreibungReview :ausschreibungId="route.params.id"
/>

<Footer />

<div
  v-if="showDeleteSuccess"
  class="success-popup"
>
  Anzeige erfolgreich gelöscht!
</div>

<div
  v-if="showConfirmDelete"
  class="confirm-popup">
  <p>
    Möchtest du die Anzeige wirklich löschen?
  </p>
  <div class="confirm-buttons">
    <Button
      variant="secondary"
      @click="deleteAusschreibung">
    Ja
    </Button>
    <Button
      variant="accent"
      @click="cancelDelete">
    Nein
    </Button>
  </div>
</div>



</template>

<style scoped>

.detail-image {
    width: 100%;
    border-radius: 25px;
    margin-bottom: 20px;
}

.back-link {
    text-decoration: none;
    color: black;
    font-size: 2.5rem;
}

.info-line {
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.small-icon {
    width: 100px;
    margin-right: 10px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 25px;
    font-size: 1.5rem;
}

.info-box {
    border: 2px solid #D0A6A6;
    border-radius: 10px;
    padding: 10px;
}

.description-box {
    border: 2px solid #D0A6A6;
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    font-size: 1.5rem;
}

.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
}

.success-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 70px;
  border-radius: 25px;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  background-color: #9BAF96;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 9999;
  text-align: center;
  min-width: 400px;

}
.confirm-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 9999;
  text-align: center;
  min-width: 400px;
}
.confirm-popup p {
font-size: 1.5rem;
 margin-bottom: 30px;
}
.confirm-buttons {
display: flex;
justify-content: center;
gap: 20px;
}

</style>