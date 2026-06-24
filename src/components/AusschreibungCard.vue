<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  ausschreibung: Object,
  showStatus: {
    type: Boolean,
    default: false
  }
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('de-DE')
}

function statusLabel(status) {
  const labels = {
    VERFUEGBAR: 'Verfügbar',
    VERGEBEN: 'Vergeben',
    ABGESCHLOSSEN: 'Abgeschlossen'
  }
  return labels[status] || status
}
</script>

<template>
<RouterLink
  :to="`/ausschreibung/${ausschreibung.id}`"
  class="card-link"
>
<div class="custom-card">

  <div class="image-wrapper">

    <img
      :src="ausschreibung.imageUrl ||
    'https://placehold.co/600x400?text=Kein+Bild'"
      class="card-image"
      alt="Tierbild"
    >

    <span class="badge-custom">
      {{ ausschreibung.compensation }}
    </span>

     <!-- Status-Badge -->
    <span
      v-if="showStatus"
      :class="['status-badge', ausschreibung.status?.toLowerCase()]"
    >
      {{ statusLabel(ausschreibung.status) }}
    </span>
  </div>

  <div class="card-content">
    <h3>
      {{ ausschreibung.petName }},
      {{ ausschreibung.petAge }} Jahre
    </h3>

    <p>
      <img src="../assets/images/Green_location_pin_icon.png" class="small-icon" alt="Standort">
      {{ ausschreibung.postalCode }}
      {{ ausschreibung.city }}
    </p>

    <p>
      <img src="../assets/images/calendar_icon.png" class="small-icon" alt="Kalender">
      {{ formatDate(ausschreibung.dateFrom) }} - {{ formatDate(ausschreibung.dateTo) }}
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
    height: 160px;
    object-fit: cover;
}
.small-icon {
    width: 70px;
    height: 45px;
    margin-right: 6px;
}
.badge-custom {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #B7A17A;
    color: white;
    padding: 8px 14px;
    border-radius: 20px;
    font-weight: bold;
    font-size:0.8rem;
}
.status-badge {
  position: absolute;
  left: 15px;
  top: 15px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}
.status-badge.verfuegbar {
 background: #dff5e1;
  color: green;
}
.status-badge.vergeben {
  background: #fff4d6;
  color: #a97900;
}
.status-badge.abgeschlossen {
background: #ffe1e1;
  color: red;
}
.card-content {
    padding: 12px;
}
.card-content h3 {
    font-weight: bold;
    font-size:1rem;
    margin-bottom: 15px;
}
.card-content p{
  font-size: 0.9rem;
  margin-bottom:8px;
}
</style>