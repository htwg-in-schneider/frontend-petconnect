<script setup>
import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import SearchBar from '@/components/SearchBar.vue'
import ConfirmPopup from '@/components/ConfirmPopup.vue'
import Popup from '@/components/Popup.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { getAccessTokenSilently } = useAuth0()
const ausschreibungen = ref([])
const search = ref('')
const selectedId = ref(null)
const showConfirmDelete = ref(false)
const showDeleteSuccess = ref(false)

async function fetchAusschreibungen() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen`
  )
  ausschreibungen.value =await response.json()
}
const filteredAusschreibungen = computed(() => {
  return ausschreibungen.value.filter(a => {
    const searchText = search.value.toLowerCase()
    const ownerName =
      `${a.owner?.firstName || ''} ${a.owner?.lastName || ''}`
      .toLowerCase()
    return (
      ownerName.includes(searchText)
      ||
      a.petName.toLowerCase().includes(searchText)
    )
  })
})

function askDeleteConfirmation(id) {
  selectedId.value = id
  showConfirmDelete.value = true
}

function cancelDelete() {
  showConfirmDelete.value = false
}

async function deleteAusschreibung(id) {
  showConfirmDelete.value = false
  const token = await getAccessTokenSilently()
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/ausschreibungen/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.ok) {
    await fetchAusschreibungen()
    showDeleteSuccess.value = true
    setTimeout(() => { showDeleteSuccess.value = false }, 2000)
  }
}

onMounted(() => {
  fetchAusschreibungen()
})
</script>

<template>
<Navbar />
<div class="container py-5">
    <h1>Ausschreibungen verwalten</h1>

    <SearchBar
    v-model="search"
    placeholder="Nach Besitzer oder Tiername suchen..."
    />

    <div
    v-if="ausschreibungen.length === 0"
    class="no-results"
  >
    Keine Ausschreibungen vorhanden.
  </div>

  <div
    v-else-if="filteredAusschreibungen.length === 0"
    class="no-results"
    >
    Keine passenden Ausschreibungen gefunden.
    </div>

    <table v-else class="table">
    <thead>
    <tr>
        <th>Tier</th>
        <th>Ort</th>
        <th>Besitzer</th>
        <th>Status</th>
        <th>Bearbeiten</th>
        <th>Löschen</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
        <tr
        v-for="a in filteredAusschreibungen"
        :key="a.id"
        >
        <td data-label="Tier">
            {{ a.petName }}
        </td>

        <td data-label="Ort">
         {{ a.postalCode }}
         {{ a.city }}
        </td>

        <td data-label="Besitzer">
            {{ a.owner?.firstName }}
            {{ a.owner?.lastName }}
        </td>

        <td data-label="Status">
        {{ a.status }}
        </td>

        <td data-label="Aktion">
            <RouterLink :to="`/ausschreibung/${a.id}`">
                <Button variant="secondary">
                    Bearbeiten
                </Button>
            </RouterLink>
        </td>
        <td data-label="Löschen">
          <Button
            variant="secondary"
            @click="askDeleteConfirmation(a.id)"
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
  text="Möchtest du diese Ausschreibung wirklich löschen?"
  @confirm="deleteAusschreibung(selectedId)"
  @cancel="cancelDelete"
/>
<Popup
  v-if="showDeleteSuccess"
  type="success"
  text="Ausschreibung erfolgreich gelöscht."
/>
<Footer />
</template>

<style scoped>
.container{
  min-height: 70vh;
}
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}
.table {
  width: 100%;
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