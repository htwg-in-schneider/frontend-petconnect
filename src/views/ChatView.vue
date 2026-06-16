<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const messages = ref([])
const text = ref('')
const route = useRoute()
const chatPartner = ref(null)
const currentUserId = ref(null)
const userId = route.params.userId

async function loadMessages() {
  const token = await getAccessTokenSilently()

  const response =
    await fetch(
      `http://localhost:8081/api/messages/chat/${route.params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

  messages.value =await response.json()
}
onMounted(async () => {
  await loadMessages()
  await loadCurrentUser()
  await loadChatPartner()
})

async function sendMessage() {
  const token =await getAccessTokenSilently()

  await fetch(
    'http://localhost:8081/api/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        receiverId:
          route.params.userId,
        text: text.value
      })
    }
  )
  text.value = ''
  loadMessages()
}

async function loadCurrentUser() {
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
    currentUserId.value = user.id
  }
}

async function loadChatPartner() {
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `http://localhost:8081/api/users/${route.params.userId}`,
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
</script>

<template>
<div class="chat-page">

  <div class="chat-header">

    <img
      class="chat-avatar"
      src="../assets/images/User_Icon_Green.png"
    >

    <div>
      <h4 class="mb-0">
        {{ chatPartner?.firstName }}
        {{ chatPartner?.lastName }}
      </h4>
      <small>
        {{ chatPartner?.role }}
      </small>
    </div>
  </div>

  <div class="messages-container">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
    >
      <div
        :class="[
          'message-bubble',
          message.sender.id === currentUserId
            ? 'own-message'
            : 'other-message'
        ]"
      >
        {{ message.text }}
      </div>
    </div>
  </div>

  <div class="chat-input">
    <input
      v-model="text"
      placeholder="Nachricht schreiben..."
      @keyup.enter="sendMessage"
    >

    <button @click="sendMessage">
      Senden
    </button>
  </div>

</div>
</template>

<style scoped>
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

.back-btn {
  text-decoration: none;
  color: black;
  font-size: 2rem;
  margin-right: 10px;
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

.chat-input button {
  background: #9BAF96;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 25px;
  font-weight: 600;
}

.chat-input button:hover {
  background: #889d83;
}
</style>