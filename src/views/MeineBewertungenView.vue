<script setup>
import { ref, onMounted,computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const { getAccessTokenSilently } = useAuth0()
const reviews = ref([])

onMounted(async () => {
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/mine`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.ok) {
    reviews.value = await response.json()
  }
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.stars, 0)
  return (sum / reviews.value.length).toFixed(1)
})
</script>

<template>
<Navbar />

<div class="container py-5">
  <h1 class="mb-4">Meine Bewertungen</h1>

    <div  class="average-box">
        <span class="avg-stars">★ {{ averageRating }}</span>
        <span class="avg-label">Durchschnitt aus {{ reviews.length }} Bewertung{{ reviews.length !== 1 ? 'en' : '' }}</span>
    </div>

  <div v-if="reviews.length !== 0" class="reviews-list">
    <div
      v-for="review in reviews"
      :key="review.id"
      class="review-card"
    >
      <div class="review-header">
        <strong>{{ review.reviewer?.firstName }}</strong>
        <div class="stars">
          <span v-for="n in 5" :key="n">
            {{ n <= review.stars ? '★' : '☆' }}
          </span>
        </div>
      </div>
      <p class="review-text">{{ review.text }}</p>
      <small class="review-meta">
        Für: {{ review.ausschreibung?.petName }}
      </small>
    </div>
  </div>

  <div v-if="reviews.length === 0" class="no-results">
    Du hast noch keine Bewertungen erhalten.
  </div>
</div>

<Footer />
</template>

<style scoped>
.container {
  min-height: 70vh;
  max-width: 700px;
}

.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}

.review-card {
  border: 2px solid #D0A6A6;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stars {
  color: #FFD54F;
  font-size: 1.3rem;
}

.review-text {
  margin: 10px 0;
}

.review-meta {
  color: #888;
}
.average-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9f0f0;
  border: 2px solid #D0A6A6;
  border-radius: 15px;
  padding: 15px 25px;
  margin-bottom: 30px;
}

.avg-stars {
  font-size: 2rem;
  color: #e8c547;
  font-weight: bold;
}

.avg-label {
  color: #666;
  font-size: 1rem;
}
</style>
