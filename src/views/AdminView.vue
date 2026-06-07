<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const users = ref([])
const search = ref('')
const selectedUser = ref(null)
const showEditPopup = ref(false)
const { getAccessTokenSilently } = useAuth0()


async function fetchUsers() {
  const response =
    await fetch(
      'http://localhost:8081/api/users'
    )
  users.value =
    await response.json()
}
function editUser(user) {
  selectedUser.value = { ...user }
  showEditPopup.value = true
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const searchText = search.value.toLowerCase()
    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase()
    return (
      fullName.includes(searchText)
      ||
      user.email?.toLowerCase().includes(searchText)
    )
  })
})

async function saveUser() {
const token = await getAccessTokenSilently()
const response = await fetch(
  `http://localhost:8081/api/users/${selectedUser.value.id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(selectedUser.value)
  }
)

  if (response.ok) {
    showEditPopup.value = false
    fetchUsers()
  }
}
</script>

<template>

  <Navbar />

  <div class="container py-5">
    <h1>Admin-Bereich</h1>
    <p>Benutzerverwaltung</p>
  </div>

  
<div class="search-box mb-5">
  <input
    v-model="search"
    class="form-control search-input"
    placeholder="Nach Name oder E-Mail suchen..."
/>
</div>

<div
  v-if="filteredUsers.length === 0"
  class="no-results"
>
Keine passenden Accounts gefunden.
</div>


  <table class="table">

  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Rolle</th>
    </tr>
  </thead>

  <tbody>

    <tr
      v-for="user in filteredUsers"
      :key="user.id"
    >

      <td data-label="Name">{{ user.firstName }} {{user.lastName}}</td>
      <td data-label="E-Mail">{{ user.email }}</td>
      <td data-label="Rolle">{{ user.role }}</td>
    
    <td data-label="Aktion">
        <Button
          variant="secondary"
          @click="editUser(user)"
        >
          Bearbeiten
        </Button>
      </td>
    </tr>

  </tbody>

</table>

<div
  v-if="showEditPopup"
  class="confirm-popup"
>
  <h3>Benutzer bearbeiten</h3>

  <input
    v-model="selectedUser.firstName"
    class="form-control mb-3"
  >

  <input
    v-model="selectedUser.lastName"
    class="form-control mb-3"
  >

  <select
    v-model="selectedUser.role"
    class="form-control mb-3"
  >
    <option value="ADMIN">ADMIN</option>
    <option value="TIERBESITZER">TIERBESITZER</option>
    <option value="TIERSUCHER">TIERSUCHER</option>
  </select>

  <div class="confirm-buttons">
    <Button
      variant="accent"
      @click="saveUser"
    >
      Speichern
    </Button>

    <Button
      variant="secondary"
      @click="showEditPopup = false"
    >
      Abbrechen
    </Button>
  </div>
</div>


  <Footer />

</template>

<style scoped>
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}
.search-box {
  display: flex;
  justify-content: center;
}

.search-input { /* suchleiste*/
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  border: 2px solid #D0A6A6;
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: 0.2s;
}
.search-input:focus {  /* focus -> ändert farbe von rosa zu grün beim anklicken*/
  outline: none;
  border-color: #9BAF96;
  box-shadow: 0 0 8px rgba(155,175,150,0.4);
}
.confirm-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: white;
  padding: 40px;
  border-radius: 25px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.3);

  z-index: 9999;
  text-align: center;
  min-width: 450px;
}

.confirm-popup h3 {
  margin-bottom: 25px;
}

.confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
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