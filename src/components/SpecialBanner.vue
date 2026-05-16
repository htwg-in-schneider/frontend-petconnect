<script setup>
import { useBannerStore } from '@/stores/banner'
const bannerStore = useBannerStore()
</script>

<template>
<div
  v-if="bannerStore.isVisible"
  class="special-banner"
>

  <span>
    🐾 Jetzt kostenlos registrieren und Tiersitter finden!
  </span>

  <button
    class="close-button"
    @click="bannerStore.hideBanner"
  >
    ✕
  </button>

</div>
</template>

<style scoped>
.special-banner {
    background-color: #9BAF96;
    color: white;
    padding: 15px 50px 15px 15px;
    text-align: center;
    font-weight: bold;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 15px;

    background: none;
    border: none;

    color: white;
    font-size: 1.3rem;
    cursor: pointer;
}

.close-button:hover {
    opacity: 0.7;
}
</style>