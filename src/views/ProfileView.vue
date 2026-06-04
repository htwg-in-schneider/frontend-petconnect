<script setup>

import { useAuth0 } from '@auth0/auth0-vue'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const {

  user,
  isAuthenticated,
  isLoading

} = useAuth0()

</script>

<template>

<Navbar />

<div
  class="container py-5"
>

  <div
    v-if="isLoading"
    class="text-center"
  >

    Lädt...

  </div>

  <div
    v-else-if="isAuthenticated && user"
    class="card mx-auto p-4"
    style="max-width:600px;"
  >

    <div class="text-center">

      <img

        :src="user.picture"

        :alt="user.name"

        class="rounded-circle mb-3"

        width="150"

      >

      <h2>

        {{ user.name }}

      </h2>

      <p>

        {{ user.email }}

      </p>

    </div>

    <hr>

    <pre>

{{ JSON.stringify(user,null,2) }}

    </pre>

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