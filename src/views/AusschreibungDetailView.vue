<script setup>

import { ref, onMounted, computed } from 'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import AusschreibungReview from '@/components/AusschreibungReview.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ReviewForm from '@/components/ReviewForm.vue'

const route = useRoute()
const router = useRouter()
const ausschreibung = ref(null) 
const translations = ref({})
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const showReportPopup = ref(false)

const report = ref({
  grund: '',
  beschreibung: ''
})
const role = ref(null)
const currentUserId = ref(null)

const url = '${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen';
const animalTypeUrl ='${import.meta.env.VITE_API_BASE_URL}/api/animaltype'

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

const canEdit = computed(() => {
  if (!ausschreibung.value) {
    return false
  }
  if (role.value === 'ADMIN') {
    return true
  }
  return ausschreibung.value.owner?.id === currentUserId.value
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
  
async function sendReport() {
  try {
    const token = await getAccessTokenSilently()

    console.log("Owner:", ausschreibung.value.owner)

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/meldungen/${ausschreibung.value.owner.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(report.value)
      }
    )

    console.log("Status:", response.status)

    if (!response.ok) {
      const text = await response.text()
      console.log(text)
    }

    showReportPopup.value = false

  } catch (error) {
    console.error(error)
  }
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
      '${import.meta.env.VITE_API_BASE_URL}/api/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
  const user = await response.json()

  role.value = user.role
  currentUserId.value = user.id
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

  
<div v-if="
    isAuthenticated && !canEdit
  "class="owner-card">

  <h3>Tierbesitzer/-in</h3>

  <div class="owner-info">
    <img
      src="../assets/images/User_Icon_Green.png"
      class="owner-avatar"
      alt="Profilbild"
    >

    <div>
      <div class="owner-name">
        {{ ausschreibung.owner?.firstName }}
      </div>
    </div>

  </div>

 <RouterLink
  :to="`/chat/${ausschreibung.owner.id}/${ausschreibung.id}`"
>
    <Button variant="accent">
      Nachricht
    </Button>
  </RouterLink>

</div>

<div
  v-if="
    isAuthenticated && !canEdit
  "
  class="button-group"
>
  <Button
    variant="secondary"
    @click="showReportPopup = true"
  >
    Benutzer melden
  </Button>
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
<ReviewForm/>

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

<!-- Account melden -->
<div
  v-if="showReportPopup"
  class="confirm-popup"
>
  <h3>Benutzer melden</h3>
  <select
    v-model="report.grund"
    class="form-control mb-3"
  >
    <option value="">
      Bitte wählen
    </option>
    <option value="Unangemessener Inhalt">
      Unangemessener Inhalt
    </option>
    <option value="Spam">
      Spam
    </option>
    <option value="Beleidigung">
      Beleidigung
    </option>
  </select>
  <textarea
    v-model="report.beschreibung"
    class="form-control mb-3"
    placeholder="Beschreibung"
  />

  <div class="confirm-buttons">
    <Button
      variant="accent"
      @click="sendReport"
    >
      Melden
    </Button>
    <Button
      variant="secondary"
      @click="showReportPopup = false"
    >
      Abbrechen
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

.owner-card {
  border: 2px solid #D0A6A6;
  border-radius: 30px;
  padding: 40px;
  margin-top: 30px;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 30px 0;
}

.owner-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-size: 3rem;
  font-weight: bold;
}

.message-link {
  display: block;
  width: 250px;
}

</style>