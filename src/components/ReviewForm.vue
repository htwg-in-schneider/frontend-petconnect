<script setup>
import {ref} from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { validateReview } from '@/utils/validation'
import Button from './Button.vue'

const { getAccessTokenSilently } = useAuth0()
const comment= ref('')
const rating = ref(0)
const hoveredRating = ref(0)
const errors = ref({
  rating: '',
  comment: ''
})
const props = defineProps({
  reviewedUserId: Number,
  ausschreibungId: Number
})
const emit = defineEmits(['submitted','close'])

function setRating(value){
    rating.value=value
    errors.value.rating = ''
}

function ratingLabel(r) {
  const labels = ['', 'Schlecht', 'Na ja', 'Ok', 'Gut', 'Super!']
  return labels[r] || ''
}

async function submitReview() {
   if (!validateReview(
    { rating: rating.value, comment: comment.value },
    errors.value
  )) {
    return
  }
  const token = await getAccessTokenSilently()
  const response =await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stars: rating.value,
        text: comment.value,
        reviewedUserId: props.reviewedUserId,
        ausschreibungId: props.ausschreibungId
      })
    }
  )
   if (response.ok) {
    emit('submitted')
}
}
</script>

<template>
<div class="review-box">

  <div class="review-header">
    <span class="review-icon">⭐</span>
    <h3>Bewertung abgeben</h3>
  </div>

 <!-- Sterne -->
<div class="stars-section">
    <label>Wie war deine Erfahrung?</label>
  <div class="stars">
  <span
    v-for="star in 5"
    :key="star"
    class="star"
    :class="{
    active: star <= (hoveredRating || rating),
    selected: star <= rating
    }"
    @mouseenter="hoveredRating = star"
    @mouseleave="hoveredRating = 0"
    @click="setRating(star)"
    >
    ★
  </span>
</div>
<div class="rating-label">
      {{ ratingLabel(hoveredRating || rating) }}
    </div>
    <div v-if="errors.rating" class="invalid-feedback d-block">
      {{ errors.rating }}
    </div>
  </div>

<!-- Kommentar -->
<div class="comment-section">
  <label>Kommentar</label>
  <textarea
    v-model="comment"
    class="review-textarea" 
    :class="{ 'input-error': errors.comment }"
    placeholder="Erzähl anderen von deiner Erfahrung..."
    maxlength="1000"
    @input="errors.comment = ''"
    />
  <div v-if="errors.comment" class="invalid-feedback d-block">
      {{ errors.comment }}
  </div>
</div>

<div class="button-group">
  <Button variant="accent" @click="submitReview">
    Bewertung absenden
  </Button>
  <Button variant="secondary" @click="emit('close')">
    Schließen
  </Button>
</div>
</div>
</template>

<style scoped>
.review-box {
text-align: left;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}
.review-icon {
  font-size: 1.6rem;
}
.review-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}
.stars-section {
  margin-bottom: 20px;
}
.stars-section label,
.comment-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #555;
  font-size: 0.95rem;
}
.stars {
  display: flex;
  gap: 6px;
}
.star {
  font-size: 2.4rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
  line-height: 1;
}
.star.active {
  color: #FFD54F;
  transform: scale(1.15);
}
.star.selected {
  color: #FFC107;
}
.rating-label {
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #9BAF96;
  min-height: 20px;
}
.comment-section {
  margin-bottom: 20px;
}
.review-textarea {
  width: 100%;
  min-height: 110px;
  border: 2px solid #D0A6A6;
  border-radius: 12px;
  padding: 12px;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}
.review-textarea:focus {
  border-color: #9BAF96;
}
.review-button:hover {
  background: #889d83;
}
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 5px;
}

.button-group :deep(.btn) {
  flex: 1;
}
</style>
