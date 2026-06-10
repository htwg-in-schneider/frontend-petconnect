<script setup>

import { useAuth0 } from '@auth0/auth0-vue'
import Button from '@/components/Button.vue'

const {

  loginWithRedirect,
  logout,
  user,
  isAuthenticated,
  isLoading

} = useAuth0()

const handleLogin = () => {
  console.log('Login geklickt')
  loginWithRedirect({
    authorizationParams: {
      prompt: "consent"
    }
  })
}


const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}
</script>

<template>
<div v-if="!isLoading">

  <Button
    v-if="!isAuthenticated"
    variant="secondary"
    @click="handleLogin"

  >
    Anmelden
  </Button>

  <div
    v-else
    class="dropdown"
  >

    <a

      href="#"

      class="d-block text-decoration-none dropdown-toggle"

      data-bs-toggle="dropdown"

    >

      <img

        :src="user.picture"

        :alt="user.name"

        width="40"

        height="40"

        class="rounded-circle"

      >

    </a>

    <ul
      class="dropdown-menu shadow"
      style="right:0; left:auto;"
    >

      <li>

        <RouterLink
          class="dropdown-item"
          to="/profile"
        >

          Profil

        </RouterLink>

      </li>

      <li>

        <hr class="dropdown-divider">

      </li>

      <li>

        <button
          class="dropdown-item"
          @click="handleLogout"
        >

          Abmelden

        </button>

      </li>

    </ul>

  </div>

</div>

</template>

<style scoped>

.dropdown-toggle::after {

  display: none;

}

</style>