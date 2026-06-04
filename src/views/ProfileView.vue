<script setup>

import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const baseUrl = 'http://localhost:8081';
const {

  user,
  isAuthenticated,
  isLoading,
  getAccessTokenSilently
} = useAuth0()

const profileData = ref(null)
const bearerToken = ref('')
const error = ref('')

function copyToClipboard(event) {
  event.target.select()
  navigator.clipboard.writeText(event.target.value)
}

function getRoleName(role) {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'

    case 'TIERBESITZER':
      return 'Tierbesitzer'

    case 'TIERSUCHER':
      return 'Tiersucher'

    default:
      return role
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently()
      bearerToken.value = token
      const response = await fetch(`${baseUrl}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        profileData.value = await response.json()
      } else {
        error.value =
          `Fehler beim Laden des Profils: ${response.status} ${response.statusText}`
      }
    } catch (e) {
      error.value =
        `Fehler beim Laden des Profils: ${e.message}`
      console.warn('Could not load profile:', e)
    }
  }
})
</script>

<template>

<Navbar />

<div class="container mt-5" style="min-height: 60vh;">

  <div
    v-if="isLoading"
    class="text-center"
  >
     <div
        class="spinner-border"
        role="status"
      >
        <span class="visually-hidden">
          Loading...
        </span>
      </div>
  </div>

  <div
    v-else-if="isAuthenticated && profileData"
    class="card profile-card mx-auto mb-4"
    style="max-width:600px;"
  >
  <div class="profile-header">
        <h3 class="mb-0">
          Benutzerprofil
        </h3>
      </div>

    <div class="card-body text-center">

        <img
          :src="user.picture"
          :alt="profileData.name"
          class="profile-avatar"
        >

        <h4 class="card-title">
          {{ profileData.name }}
        </h4>

        <p class="email">
  {{ profileData.email }}
</p>

        <p>
          <strong>Rolle:</strong>
          {{ getRoleName(profileData.role) }}
        </p>

        <div class="mt-4 text-start">

          <details>

            <summary
              class="btn btn-sm btn-outline-secondary mb-2"
            >
              OAuth2-Debug-Info
            </summary>

            <div class="mb-3">

              <label class="form-label">
                Auth0 User:
              </label>

              <pre class="bg-light p-3 rounded border">
<code>{{ JSON.stringify(user, null, 2) }}</code>
              </pre>

              <label class="form-label">
                Bearer Token:
              </label>

              <textarea
                class="form-control"
                rows="4"
                readonly
                @click="copyToClipboard"
              >{{ bearerToken }}</textarea>

            </div>

          </details>

        </div>

      </div>

    </div>

    <div
      v-else-if="error"
      class="alert alert-danger text-center"
    >
      {{ error }}
    </div>

  <div
    v-else
    class="alert alert-warning"
  >

    Sie sind nicht eingeloggt.

  </div>

</div>

<Footer />

</template>
<style scoped>
.profile-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  object-fit: cover;
}

.profile-header {
  background-color: #9BAF96;
  color: white;
  padding: 1rem;
}

.profile-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.email {
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 20px;
}
</style>