<script setup>
import { ref, onMounted } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()

const meldungen = ref([])

async function fetchMeldungen() {

  const token =
    await getAccessTokenSilently()

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/meldungen`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}`
    )
  }

  meldungen.value =
    await response.json()
}

onMounted(() => {
  fetchMeldungen()
})
</script>

<template>

<Navbar />

<div class="container py-5">

  <h1>Gemeldete Profile</h1>

  <table class="table">

    <thead>
      <tr>
        <th>Gemeldeter Benutzer</th>
        <th>Gemeldet von</th>
        <th>Grund</th>
        <th>Beschreibung</th>
      </tr>
    </thead>

    <tbody>

      <tr
        v-for="meldung in meldungen"
        :key="meldung.id"
      >
        <td>
          {{ meldung.gemeldeterUser?.firstName }}
          {{ meldung.gemeldeterUser?.lastName }}
        </td>

        <td>
          {{ meldung.meldenderUser?.firstName }}
          {{ meldung.meldenderUser?.lastName }}
        </td>

        <td>
          {{ meldung.grund }}
        </td>

        <td>
          {{ meldung.beschreibung }}
        </td>

      </tr>

    </tbody>

  </table>

</div>

<Footer />

</template>