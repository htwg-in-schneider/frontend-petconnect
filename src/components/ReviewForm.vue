<script setup>
import {ref} from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const comment= ref('')
const rating = ref(0)
const props = defineProps({
  reviewedUserId: Number,
  ausschreibungId: Number
})
const emit = defineEmits(['submitted'])

function setRating(value){
    rating.value=value
}

async function submitReview() {
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
<h3> Bewertung abgeben</h3>


class="review-input">
 <label>Bewertung</label>

<div class="stars">
<span
v-for="star in 5"
:key="star"
 @click="setRating(star)">
{{ star <= rating ? '★' : '☆' }}
</span>
</div>

<label>Kommentar</label>
<textarea
v-model="comment"
class="review-textarea" />

<button
class="review-button"
@click="submitReview">Bewertung absenden</button>
  </div>
</template>

<style scoped>
.review-box {
  max-width: 500px;
  margin: 50px auto;
  padding: 25px;
  border: 2px solid #D0A6A6;
  border-radius: 15px;
  background: white;
}

.review-box h3 {
  margin-bottom: 20px;
}

.review-box label {
  display: block;
  margin-top: 15px;
  margin-bottom: 8px;
  font-weight: 500;
}

.review-input,
.review-textarea {
  width: 100%;
  border: 2px solid #D0A6A6;
  border-radius: 10px;
  padding: 10px;
}

.review-textarea {
  min-height: 120px;
}

.stars {
  font-size: 2rem;
  color: #FFD54F;
  cursor: pointer;
}

.review-button {
  margin-top: 25px;
  width: 100%;
  background: #9BAF96;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
}
</style>