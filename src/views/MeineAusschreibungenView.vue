<script setup>

import { ref, onMounted} from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AusschreibungCard from '@/components/AusschreibungCard.vue'
import Button from '@/components/Button.vue'

const url = `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen/meine`;
const ausschreibungen = ref([])
const role = ref(null)

const {
  getAccessTokenSilently
} = useAuth0()

onMounted(async () => {
 await Promise.all([
    fetchAusschreibungen(),
  ])
})


async function fetchAusschreibungen() {
  try {
    const token = await getAccessTokenSilently()
    const profileResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (profileResponse.ok) {
      const profile = await profileResponse.json()
      role.value = profile.role
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      )
    }
    ausschreibungen.value = await response.json()
  } catch (error) {
    console.error(
      'Error fetching ausschreibungen:',
      error
    )
  }
}
</script>

<template>
<Navbar/>
<section class="container py-5">
 <h1 class="text-center fw-bold mb-4">
  Meine Ausschreibungen
</h1>

<div
  v-if="ausschreibungen.length === 0"
  class="no-results"
>
  Du hast noch keine Ausschreibungen erstellt.
</div>

  <div class="row g-5">
  <div
    v-for="ausschreibung in ausschreibungen"
    :key="ausschreibung.id"
    class="col-lg-4 col-md-6"
  >
    <AusschreibungCard
      :ausschreibung="ausschreibung"
      :show-status="true"
    />
  </div>
</div>

  <div class="button-group">
  <RouterLink v-if="role === 'TIERBESITZER'"to="/ausschreibung/create">
    <Button variant="accent">
      Neue Ausschreibung
    </Button>
  </RouterLink>
</div>

</section>

<Footer />

</template>

<style scoped>
.container {
  min-height: 70vh;
}
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}
.button-group {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>