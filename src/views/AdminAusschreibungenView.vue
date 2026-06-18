<script setup>
import { ref, onMounted, computed } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import SearchBar from '@/components/SearchBar.vue'

const ausschreibungen = ref([])
const search = ref('')

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
    v-if="filteredAusschreibungen.length === 0"
    class="no-results"
    >
    Keine passenden Ausschreibungen gefunden.
    </div>

    <table class="table">
    <thead>
    <tr>
        <th>Tier</th>
        <th>Ort</th>
        <th>Besitzer</th>
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

        <td data-label="Aktion">
            <RouterLink :to="`/ausschreibung/${a.id}`">
                <Button variant="secondary">
                    Bearbeiten
                </Button>
            </RouterLink>
        </td>
        </tr>
    </tbody>
    </table>
    </div>

<Footer />
</template>

<style scoped>
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