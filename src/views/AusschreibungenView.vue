<script setup>
import { ausschreibungen } from '../data.js'
</script>

<template>

<section class="container py-5">

  <h1 class="text-center fw-bold mb-5">
    Meine Ausschreibungen
  </h1>

  <div class="row g-5">

    <div
      v-for="ausschreibung in ausschreibungen"
      :key="ausschreibung.id"
      class="col-md-6"
    >

      <div class="custom-card">

        <div class="image-wrapper">

          <img
            :src="ausschreibung.imageUrl"
            class="card-image"
            alt="Tierbild"
          >

          <span class="badge-custom">
            {{ ausschreibung.type }}
          </span>

        </div>

        <div class="card-content">

          <h3>
            {{ ausschreibung.name }},
            {{ ausschreibung.age }} Jahre
          </h3>

          <p>
          <!--<img src="/images/Green_location_pin_icon.png" class="small-icon" alt="Standort">-->
           {{ ausschreibung.city }}
          </p>

          <p>
          <!-- <img src="/images/calendar_icon.png" class="small-icon" alt="Kalender"-->
  >
           {{ ausschreibung.date }}
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

</template>