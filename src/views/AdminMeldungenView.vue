<script setup>
import { ref, onMounted } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import SuccessPopup from '@/components/SuccessPopup.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const meldungen = ref([])
const selectedMeldungId = ref(null)
const showDeleteSuccess = ref(false)
const showConfirmDelete = ref(false)

onMounted(() => {
  fetchMeldungen()
})

async function fetchMeldungen() {
  const token =await getAccessTokenSilently()

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
  meldungen.value =await response.json()
}

function askDeleteConfirmation(id) {
  selectedMeldungId.value = id
  showConfirmDelete.value = true
}

function cancelDelete() {
  showConfirmDelete.value = false
}

async function deleteMeldung(id) {
  console.log("Lösche Meldung:", id)
  showConfirmDelete.value=false
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/meldungen/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  console.log("Status:", response.status)

  if (response.ok) {
    await fetchMeldungen()
    showDeleteSuccess.value = true
    setTimeout(() => {
    showDeleteSuccess.value = false}, 2000)
  }

  
}
</script>

<template>
<Navbar />
<div class="container py-5 ">
  <h1>Gemeldete Profile</h1>
  <div
  v-if="meldungen.length === 0"
  class="no-results"
  >
    Keine Meldungen vorhanden.
  </div>
  <table v-else class="table">
    <thead>
      <tr>
        <th>Gemeldeter Benutzer</th>
        <th>Gemeldet von</th>
        <th>Grund</th>
        <th>Beschreibung</th>
        <th>Aktion</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="meldung in meldungen"
        :key="meldung.id"
      >
        <td data-label="Gemeldeter Benutzer">
          {{ meldung.gemeldeterUser?.firstName }}
          {{ meldung.gemeldeterUser?.lastName }}
        </td>
        <td data-label="Gemeldet von">
          {{ meldung.meldenderUser?.firstName }}
          {{ meldung.meldenderUser?.lastName }}
        </td>
        <td data-label="Grund">
          {{ meldung.grund }}
        </td>
        <td data-label="Beschreibung">
          {{ meldung.beschreibung }}
        </td>
        <td data-label="Aktion">
        <Button
        variant="secondary"
        @click="askDeleteConfirmation(meldung.id)"
        >
          Löschen
        </Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<ConfirmPopup
        v-if="showConfirmDelete"
        title="Meldung löschen"
        text="Möchtest du diese Meldung wirklich löschen?"
        @confirm="deleteMeldung(selectedMeldungId)"
        @cancel="cancelDelete"
        />

        <SuccessPopup
        v-if="showDeleteSuccess"
         title="Meldung gelöscht"
        text="Die Meldung wurde erfolgreich entfernt."
        />

<Footer />

</template>

<style scoped>
.container {
  min-height: 70vh;
}
.table {
  width: 100%;
}
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}

@media (max-width: 768px) {

  .table thead {
    display: none;
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }

  .table tr {
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 15px;
    padding: 15px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border: none;
  }

  .table td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>