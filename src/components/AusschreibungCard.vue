<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  ausschreibung: Object
})

</script>

<template>

<RouterLink
  :to="`/ausschreibung/${ausschreibung.id}`"
  class="card-link"
>
<div class="custom-card">

  <div class="image-wrapper">

    <img
      :src="ausschreibung.imageUrl"
      class="card-image"
      alt="Tierbild"
    >

    <span class="badge-custom">
      {{ ausschreibung.compensation }}
    </span>

  </div>

  <div class="card-content">

    <h3>
      {{ ausschreibung.petName }},
      {{ ausschreibung.petAge }} Jahre
    </h3>

    <p>
      <img src="../assets/images/Green_location_pin_icon.png" class="small-icon" alt="Standort">
      {{ ausschreibung.city }}
    </p>

    <p>
      <img src="../assets/images/calendar_icon.png" class="small-icon" alt="Kalender">
      {{ ausschreibung.dateFrom }} - {{ ausschreibung.dateTo }}
    </p>

  </div>

</div>

</RouterLink>

</template>

<style scoped>

.card-link {
    text-decoration: none;
    color: inherit;
}

.custom-card {
    background-color: #9BAF96;
    border-radius: 25px;
    overflow: hidden;
    max-width: 500px;
    margin: auto;
}

.image-wrapper {
    position: relative;
}

.card-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.small-icon {
    width: 80px;
    margin-right: 8px;
}

.badge-custom {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #B7A17A;
    color: white;
    padding: 10px 18px;
    border-radius: 20px;
    font-weight: bold;
}

.card-content {
    padding: 20px;
}

.card-content h3 {
    font-weight: bold;
    margin-bottom: 15px;
}

.card-content p{
  font-size: 1.2rem;
}
</style>