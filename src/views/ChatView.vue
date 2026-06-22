<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import Button from '@/components/Button.vue'
import ReviewForm from '@/components/ReviewForm.vue'
import Popup from '@/components/Popup.vue'

const { getAccessTokenSilently } = useAuth0()
const messages = ref([])
const text = ref('')
const route = useRoute()
const chatPartner = ref(null)
const currentUserId = ref(null)
const showRequestPopup = ref(false)
const petName = ref('')
const ownerId = ref(null)
let refreshInterval = null
const messagesContainer = ref(null)
const ausschreibung = ref(null)
const showReviewPopup = ref(false)
const showSuccessPopup = ref(false)
const hasReviewed = ref(false)

onMounted(async () => {
  await loadMessages()
  await loadCurrentUser()
  await loadChatPartner()
  await loadAusschreibung()
  await loadHasReviewed()
  refreshInterval = setInterval(() => {
    loadMessages()
  }, 3000)
})


function goBack() {
  window.history.back()
}

async function loadHasReviewed() {
  if (!ausschreibung.value || !currentUserId.value) return
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/review/ausschreibung/${route.params.ausschreibungId}`
  )
  if (response.ok) {
    const reviews = await response.json()
    hasReviewed.value = reviews.some(
      r => r.reviewer.id === currentUserId.value
    )
  }
}

function reviewSubmitted() {
  showReviewPopup.value = false
  showSuccessPopup.value = true
  hasReviewed.value = true
  setTimeout(() => {
    showSuccessPopup.value = false
  }, 3000)
}

async function loadMessages() {
  const token = await getAccessTokenSilently()
  const response =
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/messages/chat/${route.params.userId}/${route.params.ausschreibungId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  messages.value =await response.json()
  console.log(messages.value)
  if (messages.value.length > 0) {
  petName.value =
    messages.value[0].ausschreibung.petName
    ownerId.value =
    messages.value[0].ausschreibung.owner.id
}
}

async function loadAusschreibung() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen/${route.params.ausschreibungId}`
  )

  if (response.ok) {
    ausschreibung.value = await response.json()

  petName.value = ausschreibung.value.petName
  ownerId.value = ausschreibung.value.owner.id
  }
}

async function sendMessage() {
  const token =await getAccessTokenSilently()
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiverId:
          route.params.userId,
          ausschreibungId: route.params.ausschreibungId,
        text: text.value
      })
    }
  )
  text.value = ''
  await loadMessages()
  scrollToBottom()
}

async function loadCurrentUser() {
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
    currentUserId.value = user.id
  }
}

async function loadChatPartner() {
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/users/${route.params.userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.ok) {
    chatPartner.value = await response.json()
  }
}

async function sendRequest() {
  const token =await getAccessTokenSilently()
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/anfragen`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ausschreibungId: route.params.ausschreibungId
      })
    }
  )
  showRequestPopup.value = false
}

async function acceptRequest(id) {
  const token =await getAccessTokenSilently()
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/anfragen/${id}/accept`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  loadMessages()
}

async function rejectRequest(id) {
  const token =await getAccessTokenSilently()
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/anfragen/${id}/reject`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  loadMessages()
}

async function completeBetreuung() {
  const token = await getAccessTokenSilently()
  await fetch(
     `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen/${route.params.ausschreibungId}/complete`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  await loadAusschreibung()
}

function getReviewedUserId() {

  if (!ausschreibung.value) {
    return null
  }

  if (
    currentUserId.value ===
    ausschreibung.value.owner.id
  ) {
    return ausschreibung.value.betreuer?.id
  }

  return ausschreibung.value.owner.id
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
  top: messagesContainer.value.scrollHeight,
  behavior: 'smooth'
})
  }
}

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>

<template>
<!-- Gesamte Chat-Seite -->
<div class="chat-page">

  <!-- Kopfbereich mit Chatpartner -->
  <div class="chat-header">
    <Button
    variant="secondary"
    @click="goBack"
    >
      ❮
    </Button>
    <img
      class="chat-avatar"
      src="../assets/images/User_Icon_Green.png"
    >

    <div>
      <h4 class="mb-0">
        {{ chatPartner?.firstName }}
        {{ chatPartner?.lastName }}
      </h4>
      <small class="chat-subtitle">
        {{ chatPartner?.role }}
      </small>
      <p>🐾{{ petName }}</p>
    </div>
  </div>

  <!-- Nachrichtenbereich -->
  <div 
   ref="messagesContainer"
  class="messages-container">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
    >
    
    <!-- Normale Textnachricht -->
    <div
      v-if="message.type === 'TEXT'"
      :class="[
      'message-bubble',
      message.sender.id === currentUserId
      ? 'own-message'
      : 'other-message'
      ]"
      >
      {{ message.text }}
    </div>
    
    <!-- Betreuungsanfrage -->
    <div
      v-else-if="message.type === 'REQUEST'"
      :class="[
      'request-card',
      message.sender.id === currentUserId
      ? 'own-request'
      : 'other-request'
  ]"
    >
      <div class="request-title">
        🤝 Betreuungsanfrage
      </div>
      <div class="request-text"
      >
        Interesse an der Betreuung wurde angefragt.
      </div>
      <div class="request-status"
      :class="message.anfrage.status"
      >
        {{ message.anfrage.status }}
      </div>
<div
class="mt-3"
  v-if="
    message.anfrage.status === 'ANGENOMMEN' &&
    ausschreibung?.status !== 'ABGESCHLOSSEN' &&
    currentUserId === ownerId"
>
  <Button
    variant="accent"
    @click="completeBetreuung"
  >
    Betreuung abgeschlossen
  </Button>
</div>
<div
class="mt-3"
  v-if="
    ausschreibung?.status === 'ABGESCHLOSSEN' &&
    (
      currentUserId === ausschreibung.owner.id ||
      currentUserId === ausschreibung.betreuer?.id
    ) && !hasReviewed
  "
>
  <Button
    variant="accent"
    @click="showReviewPopup = true"
  >
    Bewertung schreiben
  </Button>
</div>

      <div class="mt-3"
        v-if="
        message.anfrage.status === 'OFFEN' &&
        currentUserId === message.receiver.id"
        >
          <Button
          variant="accent"
          @click="acceptRequest(message.anfrage.id)"
          >
            Annehmen
          </Button>

          <Button
          variant="secondary"
          @click="rejectRequest(message.anfrage.id)"
          >
            Ablehnen
          </Button>
      </div>

 
    </div>
    
  </div>

  
</div>



  <!-- Eingabebereich -->
  <div class="chat-input">
    <button
      v-if="ownerId && currentUserId !== ownerId"
      class="icon-btn"
      @click="showRequestPopup = true"
    >
      🤝
    </button>
    <input
      v-model="text"
      placeholder="Nachricht schreiben..."
      @keyup.enter="sendMessage"
    >
    <Button 
      variant="secondary"
       :disabled="!text.trim()"
      @click="sendMessage">
        Senden
    </Button>
  </div>
</div>


<!-- Popup für neue Betreuungsanfrage-->
<div
  v-if="showRequestPopup"
  class="confirm-popup"
>
  <h3>Betreuungsanfrage senden</h3>
  <p class="popup-text">
    Mit einer Betreuungsanfrage signalisierst du Interesse
    an der Betreuung dieses Tieres.
  </p>
  <p class="popup-text">
    Weitere Details könnt ihr anschließend im Chat besprechen.
  </p>
  <div class="confirm-buttons">
    <Button
    variant="accent"
    @click="sendRequest"
    >
        Anfrage senden
    </Button>

    <Button
      variant="secondary"
      @click="showRequestPopup = false"
    >
        Abbrechen
    </Button>
  </div>
</div>

<div
  v-if="showReviewPopup"
  class="confirm-popup"
>
  <ReviewForm
  :reviewed-user-id="getReviewedUserId()"
  :ausschreibung-id="ausschreibung.id"
  @submitted="reviewSubmitted"
  @close="showReviewPopup = false"
/>
</div>

<Popup
  v-if="showSuccessPopup"
  text="Bewertung erfolgreich gespeichert!"
  type="success"
/>
</template>

<style scoped>
.chat-subtitle {
  color: #666;
  font-size: 0.9rem;
}
.request-card {
  background: white;
  border: 2px solid #E8CFCF;
  border-radius: 20px;
  padding: 18px 22px;
  margin: 10px 0;
  max-width: 380px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.own-request {
  margin-left: auto;
  border-color: #9BAF96;
}

.other-request {
  margin-right: auto;
  border-color: #E8CFCF;
}

.request-title {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 1.1rem;
  font-weight: 700;

  margin-bottom: 12px;
}

.request-text {
  color: #555;
  margin-bottom: 15px;
}

.request-status {
  display: inline-block;

  background: #FFF4D6;
  color: #A97900;

  padding: 6px 12px;
  border-radius: 999px;

  font-size: 0.9rem;
  font-weight: 600;
}

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}

.chat-header {
  background: #E8CFCF;
  padding: 18px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #ddd;
}

.chat-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.message-row {
  display: flex;
  margin-bottom: 12px;
}

.message-bubble {
  max-width: 70%;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 1rem;
  line-height: 1.4;
}

.own-message {
  margin-left: auto;
  background: #9BAF96;
  color: white;
  border-bottom-right-radius: 5px;
}

.other-message {
  margin-right: auto;
  background: white;
  border: 1px solid #e5e5e5;
  border-bottom-left-radius: 5px;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: white;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  border: 2px solid #D0A6A6;
  border-radius: 20px;
  padding: 14px 18px;
  outline: none;
}

.chat-input input:focus {
  border-color: #9BAF96;
}

.confirm-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: white;
  padding: 40px;
  border-radius: 25px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.25);

  z-index: 9999;

  min-width: 400px;
  text-align: center;
}

.confirm-popup p {
  font-size: 1.1rem;
  margin: 25px 0;
}

.confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.icon-btn {
  width: 50px;
  height: 50px;

  border: none;
  border-radius: 50%;

  background: #E8CFCF;
  font-size: 1.4rem;

  cursor: pointer;
}
.request-status.ANGENOMMEN {
  background: #dff5e1;
  color: green;
}

.request-status.ABGELEHNT {
  background: #ffe1e1;
  color: red;
}

.request-status.OFFEN {
  background: #fff4d6;
  color: #a97900;
}
</style>