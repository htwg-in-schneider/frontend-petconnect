<script setup>
import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import Popup from '@/components/Popup.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const meldungen = ref([])
const reviews = ref([])
const selectedMeldungId = ref(null)
const showDeleteSuccess = ref(false)
const showConfirmDelete = ref(false)
const showConfirmDeleteReview = ref(false)
const showDeleteReviewSuccess = ref(false)
const activeTab = ref('meldungen')

onMounted(() => {
  fetchMeldungen()
  fetchReviews()
})

async function fetchMeldungen() {
  const token =await getAccessTokenSilently()

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/meldungen`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.ok) meldungen.value = await response.json()
}

async function fetchReviews() {
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (response.ok) reviews.value = await response.json()
}

function askDeleteConfirmation(id) {
  selectedMeldungId.value = id
  showConfirmDelete.value = true
}

function cancelDelete() {
  selectedReviewId.value = id
  showConfirmDelete.value = false
}

async function deleteMeldung(id) {
  showConfirmDelete.value=false
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/meldungen/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.ok) {
    await fetchMeldungen()
    showDeleteSuccess.value = true
    setTimeout(() => {
    showDeleteSuccess.value = false}, 2000)
  }
}

async function deleteReview(id) {
  showConfirmDeleteReview.value = false
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/${id}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  )
  if (response.ok) {
    await fetchReviews()
    showDeleteReviewSuccess.value = true
    setTimeout(() => { showDeleteReviewSuccess.value = false }, 2000)
  }
}

function renderStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count)
}
</script>

<template>
<Navbar />
<div class="container py-5 ">
  <h1>Moderation</h1>

  <!-- Tabs -->
  <div class="tabs">
  <button
      :class="['tab-btn', activeTab === 'meldungen' ? 'active' : '']"
      @click="activeTab = 'meldungen'"
    >
      Gemeldete Profile
      <span v-if="meldungen.length > 0" class="badge">
        {{ meldungen.length }}
      </span>
    </button>
    <button
      :class="['tab-btn', activeTab === 'reviews' ? 'active' : '']"
      @click="activeTab = 'reviews'"
    >
      Bewertungen
      <span v-if="reviews.length > 0" class="badge">
        {{ reviews.length }}
      </span>
    </button>
  </div>

  <!-- Meldungen -->
  <div v-if="activeTab === 'meldungen'">
     <div v-if="meldungen.length === 0" class="no-results">
    Keine Meldungen vorhanden.
    </div>
  <table v-else class="table">
    <thead>
      <tr>
        <th>Gemeldeter Benutzer</th>
        <th>Gemeldet von</th>
        <th>Grund</th>
        <th>Beschreibung</th>
        <th>Aktion</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="meldung in meldungen"
        :key="meldung.id"
      >
        <td data-label="Gemeldeter Benutzer">
          {{ meldung.gemeldeterUser?.firstName }}
          {{ meldung.gemeldeterUser?.lastName }}
        </td>
        <td data-label="Gemeldet von">
          {{ meldung.meldenderUser?.firstName }}
          {{ meldung.meldenderUser?.lastName }}
        </td>
        <td data-label="Grund">
          {{ meldung.grund }}
        </td>
        <td data-label="Beschreibung">
          {{ meldung.beschreibung }}
        </td>
        <td data-label="Aktion">
        <Button
        variant="secondary"
        @click="askDeleteConfirmation(meldung.id)"
        >
          Löschen
        </Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Reviews -->
  <div v-if="activeTab === 'reviews'">
    <div v-if="reviews.length === 0" class="no-results">
      Keine Bewertungen vorhanden.
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Von</th>
          <th>An</th>
          <th>Tier</th>
          <th>Sterne</th>
          <th>Kommentar</th>
          <th>Aktion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.id">
          <td data-label="Von">
            {{ review.reviewer?.firstName }}
            {{ review.reviewer?.lastName }}
          </td>
          <td data-label="An">
            {{ review.reviewedUser?.firstName }}
            {{ review.reviewedUser?.lastName }}
          </td>
          <td data-label="Tier">{{ review.ausschreibung?.petName }}</td>
          <td data-label="Sterne">
            <span class="stars">{{ renderStars(review.stars) }}</span>
          </td>
          <td data-label="Kommentar">{{ review.text }}</td>
          <td data-label="Aktion">
            <Button variant="secondary" @click="askDeleteReviewConfirmation(review.id)">
              Löschen
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

<ConfirmPopup
  v-if="showConfirmDelete"
  title="Meldung löschen"
  text="Möchtest du diese Meldung wirklich löschen?"
  @confirm="deleteMeldung(selectedMeldungId)"
  @cancel="cancelDelete"
/>

<ConfirmPopup
  v-if="showConfirmDeleteReview"
  text="Möchtest du diese Bewertung wirklich löschen?"
  @confirm="deleteReview(selectedReviewId)"
  @cancel="cancelDelete"
/>
        
<Popup v-if="showDeleteSuccess" type="success" title="Meldung gelöscht" text="Die Meldung wurde erfolgreich entfernt." />
<Popup v-if="showDeleteReviewSuccess" type="success" text="Bewertung erfolgreich gelöscht." />

<Footer />

</template>

<style scoped>
.container {
  min-height: 70vh;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #E8CFCF;
  padding-bottom: 0;
}
.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: 0.2s;
}
.tab-btn.active {
  color: #9BAF96;
  border-bottom-color: #9BAF96;
}

.tab-btn:hover {
  color: #9BAF96;
}
.badge {
  background: #D0A6A6;
  color: white;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.8rem;
  margin-left: 6px;
}
.table {
  width: 100%;
}
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}

@media (max-width: 768px) {

  .table thead {
    display: none;
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table tr {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 15px;
    padding: 15px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border: none;
  }

  .table td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>