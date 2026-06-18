<script setup>

import {ref, onMounted,watch} from 'vue'

const props = defineProps({
  ausschreibungId: {
    type: [String, Number],
    required: true
  }
});

const reviews = ref([])
const reviewUrl = '${import.meta.env.VITE_API_BASE_URL}/api/review/ausschreibung'

async function fetchReviews() {
  try {
    const response = await fetch(`${reviewUrl}/${props.ausschreibungId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    reviews.value =await response.json()

  }catch (error) {
    console.error('Error fetching reviews:',error)
  }
}

onMounted(() => {
  fetchReviews()
})


// Watch for prop changes in case the component is reused for different products without unmounting
watch(() => props.ausschreibungId,() => {
    fetchReviews()
  }
)

</script>

<template>
<div class="reviews-section mt-5 mx-5">
  <h3 class="fw-bold mb-4">
    Bewertungen
  </h3>

  <div
    v-if="reviews.length > 0"
    class="d-flex flex-column gap-3"
  >
    <div
      v-for="review in reviews"
      :key="review.id"
      class="review-card"
    >
      <div
        class="review-header"
      >
        <strong>
          {{ review.userName }}
        </strong>
        <div class="stars">
          ⭐ {{ review.stars }}
        </div>
      </div>

      <p class="review-text">
        {{ review.text }}
      </p>
    </div>
  </div>

  <div
    v-else
    class="alert alert-light"
  >
    Noch keine Bewertungen vorhanden.
  </div>

</div>
</template>

<style scoped>
.review-card {
  border: 2px solid #D0A6A6;
  border-radius: 10px;
  padding: 15px;
  background-color: white;
  margin-bottom: 50px;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.review-text {
  margin: 0;
}
.stars {
  color: #e8c547;
  font-weight: bold;
}
</style>