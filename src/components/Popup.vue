<script setup>
defineProps({
   text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success'
  }
})
</script>

<template>
  <div :class="['popup',type === 'success'
        ? 'success-popup': 'error-popup']"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 70px;
  border-radius: 25px;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 9999;
  text-align: center;
  min-width: 400px;
}
.success-popup {
  background-color: #9BAF96;
}

.error-popup {
  background-color: #D0A6A6;
}
</style>