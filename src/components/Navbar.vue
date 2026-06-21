<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Button from '@/components/Button.vue'
import UserMenu from './UserMenu.vue'

const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const role = ref(null)

async function loadRole() {
  if (!isAuthenticated.value) {
    role.value = null
    return
  }
  try {
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
      role.value = user.role
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(loadRole)
watch(isAuthenticated, () => {
  loadRole()
})
</script>

<template>
<nav class="navbar navbar-expand-lg">
    <div class="container">
        <img src="../assets/images/logo.jpg" width="60" class="me-2" alt="PetConnectLogo"> 
        <a class="navbar-brand" href="#">PetConnect</a>

        <div class="d-flex align-items-center order-lg-last">
            <UserMenu class="ms-2 me-2 me-lg-0" />
            <button
            class="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarOffcanvasLg"
            aria-controls="navbarOffcanvasLg"
            >
        <span class="navbar-toggler-icon"></span>
        </button>

        </div>
       
        <div class="offcanvas offcanvas-end" tabindex="-1" id="navbarOffcanvasLg">
            <div class="offcanvas-header">
                <h5 id="navbarOffcanvasLgLabel">PetConnect</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

        
            <div class="offcanvas-body">
                <ul class="navbar-nav ms-auto"> <!-- ms-auto hier fügt die "Right-Aligment" hinzu -->

                    <li
                    v-if="role === 'ADMIN'"
                    class="nav-item"
                    >
                        <RouterLink to="/admin">
                            <Button variant="secondary">
                                Benutzerverwaltung
                            </Button>
                        </RouterLink>
                    </li>

                    <li
                    v-if="role === 'ADMIN'"
                    class="nav-item"
                    >
                        <RouterLink to="/admin/ausschreibungen">
                            <Button variant="secondary">
                                Ausschreibungen verwalten
                            </Button>
                        </RouterLink>
                    </li>

                    <li
                    v-if="role === 'ADMIN'"
                    class="nav-item"
                    >
                        <RouterLink to="/admin/meldungen">
                            <Button variant="secondary">
                                Gemeldete Profile
                            </Button>
                        </RouterLink>
                    </li>

                    <li
                    v-if="role === 'TIERBESITZER' || role === 'TIERSUCHER'"
                    class="nav-item"
                    >
                        <RouterLink to="/meine-nachrichten">
                            <Button variant="secondary">
                                Meine Nachrichten
                            </Button>
                        </RouterLink>
                    </li>

                    <li
                    v-if="role === 'TIERBESITZER'"
                    class="nav-item"
                    >
                        <RouterLink to="/meine-ausschreibungen">
                            <Button variant="secondary"
                            >
                                Meine Ausschreibungen
                            </Button>
                        </RouterLink>
                    </li>


                    <li 
                    v-if="role !== 'ADMIN'"
                    class="nav-item" 
                    >
                        <RouterLink to="/ausschreibungen">
                            <Button variant="secondary">
                                Ausschreibungen
                            </Button>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
</template>


<style scoped>
.navbar {
    background-color: #E8CFCF; 
}

.nav-item {
    margin-bottom: 15px;
}

/* Burger-Menü Button */
.navbar-toggler {
    border-color: #9BAF96; /* Setze die Rahmenfarbe des Burger-Menüs */
    background-color: #9BAF96;
}

/* Navbar Links */
.navbar-nav .nav-link {
    color: #D28C8C; /* Setze die Textfarbe der Links */
    font-weight: bold; /* Mach den Text fett */
}


.offcanvas-header {
    background-color: #E8CFCF;
} 

.offcanvas-body {
    display: flex;
    justify-content: flex-start; /* oben */
    align-items: flex-start;     /* links */
}

@media (min-width: 992px) {
  .nav-item {
    margin-bottom: 0;
  }
}
</style>