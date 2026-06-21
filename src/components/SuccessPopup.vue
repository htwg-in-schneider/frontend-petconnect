<script setup>
defineProps({
  text: String
})
</script>

<template>
  <div class="success-popup">
    {{ text }}
  </div>
</template>

<style scoped>
.success-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 70px;
  border-radius: 25px;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  background-color: #9BAF96;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 9999;
  text-align: center;
  min-width: 400px;
}
</style>