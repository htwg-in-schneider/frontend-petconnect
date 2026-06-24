<script setup>

import { ref, onMounted, computed } from 'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import Popup from '@/components/Popup.vue'
import ReportPopup from '@/components/ReportPopup.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { validateReport } from '@/utils/validation'

const route = useRoute()
const router = useRouter()
const ausschreibung = ref(null) 
const translations = ref({})
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const showReportPopup = ref(false)
const showReportSuccess = ref(false)
const ownerAverageRating = ref(null)
const ownerReviewCount = ref(0)
const ownerReviews = ref([])

const report = ref({
  grund: '',
  beschreibung: ''
})
const reportErrors = ref({
  grund: '',
  beschreibung: ''
})
const role = ref(null)
const currentUserId = ref(null)

const url = `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`;
const animalTypeUrl =`${import.meta.env.VITE_API_BASE_URL}/api/animaltype`

onMounted(async () => {
  await loadRole()
  await fetchTranslations()
  try {
    const response = await fetch(`${url}/${route.params.id}`) //mit fetch die Daten abruft von derurl, bestimmtes product wird anhand der id geholt
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    ausschreibung.value = await response.json();
    await loadOwnerRating()
    await loadOwnerReviews()
  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
})

function goBack() {
  router.back()
}

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
    if (role.value === 'ADMIN') {
        router.push('/admin/ausschreibungen')
    } else {
    router.push('/ausschreibungen')
    }
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
  if (!validateReport(report.value,reportErrors.value)) {
    return
  }
  try {
    const token = await getAccessTokenSilently()
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
    if (!response.ok) {
      const text = await response.text()
    
    }
    showReportPopup.value = false
    showReportSuccess.value = true
    setTimeout(() => {
  showReportSuccess.value = false
}, 2000)
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
      `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
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

async function loadOwnerRating() {
  if (!ausschreibung.value?.owner?.id) return
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/user/${ausschreibung.value.owner.id}/average`
  )
  if (response.ok) {
    ownerAverageRating.value = await response.json()
  }
  const reviewsResponse = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/user/${ausschreibung.value.owner.id}`
  )
  if (reviewsResponse.ok) {
    const reviews = await reviewsResponse.json()
    ownerReviewCount.value = reviews.length
  }
}

async function loadOwnerReviews() {
  if (!ausschreibung.value?.owner?.id) return
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/user/${ausschreibung.value.owner.id}`
  )
  if (response.ok) {
    ownerReviews.value = await response.json()
  }
}
</script>

<template>

<Navbar />


<section
  v-if="ausschreibung"
  class="container py-4"
>
    <Button
    variant="secondary"
    class="mb-3"
    @click="goBack"
    >
      ← Zurück
    </Button>

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
      <div class="owner-rating" v-if="ownerAverageRating !== null">
  <span class="rating-stars">★ {{ ownerAverageRating.toFixed(1) }}</span>
  <span class="rating-count">({{ ownerReviewCount }} Bewertung{{ ownerReviewCount !== 1 ? 'en' : '' }})</span>
</div>
<div class="owner-rating" v-else>
  <span class="rating-count">Noch keine Bewertungen</span>
</div>
    </div>
  </div>

<div class="owner-buttons">
 <RouterLink
  :to="`/chat/${ausschreibung.owner.id}/${ausschreibung.id}`"
>
    <Button variant="accent">
      Nachricht
    </Button>
  </RouterLink>
  <div
  v-if="
    isAuthenticated && !canEdit
  "
>
  <Button
    variant="secondary"
    @click="showReportPopup = true"
  >
    Benutzer melden
  </Button>
</div>
</div>
</div>

<div
  v-if="ownerReviews.length > 0 && isAuthenticated && !canEdit"
  class="reviews-section"
>
  <h3>Bewertungen</h3>
  <div
    v-for="review in ownerReviews"
    :key="review.id"
    class="review-card"
  >
    <div class="review-header">
      <strong>{{ review.reviewer?.firstName }}</strong>
      <span class="stars">
        {{ '★'.repeat(review.stars) }}{{ '☆'.repeat(5 - review.stars) }}
      </span>
    </div>
    <p class="review-text">{{ review.text }}</p>
    <small class="review-meta">
      <small>🐾 {{ review.ausschreibung?.petName }}</small>
    </small>
  </div>
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

<Footer />

<Popup
  v-if="showDeleteSuccess"
  type="success"
  text="Anzeige erfolgreich gelöscht!"
/>

<ConfirmPopup
  v-if="showConfirmDelete"
  text="Möchtest du die Anzeige wirklich löschen?"
  @confirm="deleteAusschreibung"
  @cancel="cancelDelete"
/>


<!-- Account melden -->
<ReportPopup
  v-if="showReportPopup"
  :report="report"
  :report-errors="reportErrors"
  @submit="sendReport"
  @cancel="showReportPopup = false"
  @clear-grund-error="reportErrors.grund = ''"
  @clear-beschreibung-error="reportErrors.beschreibung = ''"
/>

<Popup
  v-if="showReportSuccess"
  type="success"
  title="Meldung erstellt"
  text="Meldung wurde erstellt!"
/>

</template>

<style scoped>

.detail-image {
    width: 100%;
    max-width: 600px;
    max-height: 300px;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 20px;
    margin-bottom: 20px;
    display: block;
    margin: 0 auto 20px auto;
}

.back-link {
    text-decoration: none;
    color: black;
    font-size: 2.5rem;
}

.info-line {
    margin-bottom: 15px;
    font-size: 1rem;
}

.small-icon {
    width: 80px;
    height: 60px;
    margin-right: 8px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 15px;
    font-size: 1rem;
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
    font-size: 1rem;
}

.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
}

.owner-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.owner-buttons > * {
  flex: 1;
}

.owner-card {
  border: 2px solid #D0A6A6;
  border-radius: 20px;
  padding: 16px;
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
  font-size: 1.4rem;
  font-weight: bold;
}

.message-link {
  display: block;
  width: 250px;
}

.owner-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.rating-stars {
  color: #e8c547;
  font-size: 1.3rem;
  font-weight: bold;
}

.rating-count {
  color: #888;
  font-size: 0.95rem;
}

.reviews-section {
  margin-top: 30px;
}

.reviews-section h3 {
  margin-bottom: 15px;
}

.review-card {
  border: 2px solid #D0A6A6;
  border-radius: 15px;
  padding: 15px 20px;
  margin-bottom: 15px;
  background: white;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stars {
  color: #FFC107;
  font-size: 1.1rem;
}

.review-text {
  margin: 8px 0;
  color: #444;
}

.review-meta {
  color: #888;
  font-size: 0.9rem;
}

</style>