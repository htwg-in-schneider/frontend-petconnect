<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const { getAccessTokenSilently } = useAuth0()

const chats = ref([])

onMounted(async () => {
  const token = await getAccessTokenSilently()

  const response = await fetch(
    'http://localhost:8081/api/messages/overview',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  chats.value = await response.json()
})
</script>

<template>

<Navbar/>
<div class="messages-page">

  <h2>Meine Nachrichten</h2>

  <RouterLink
    v-for="chat in chats"
    :key="`${chat.userId}-${chat.ausschreibungId}`"
    :to="`/chat/${chat.userId}/${chat.ausschreibungId}`"
    class="chat-card"
  >

    <img
      src="../assets/images/User_Icon_Green.png"
      class="chat-avatar"
    >

    <div class="chat-content">

      <div class="chat-name">
        {{ chat.userName }}
      </div>

      <div class="chat-preview">
        {{ chat.lastMessage }}
      </div>

    </div>

  </RouterLink>

</div>

<Footer/>

</template>

<style scoped>
.messages-page {
  max-width: 700px;
  margin: auto;
  padding: 25px;
  min-height: 70vh;
  
}

.messages-page h2 {
  margin-bottom: 25px;
}

.chat-card {
  display: flex;
  align-items: center;

  gap: 15px;

  padding: 15px;
  margin-bottom: 15px;

  border-radius: 20px;

  text-decoration: none;
  color: black;

  background: white;

  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.chat-card:hover {
  transform: translateY(-2px);
}

.chat-avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
}

.chat-content {
  flex: 1;
}

.chat-top {
  display: flex;
  justify-content: space-between;
}

.chat-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.chat-time {
  color: #999;
  font-size: 0.9rem;
}

.chat-preview {
  color: gray;
  margin-top: 5px;
}
</style>