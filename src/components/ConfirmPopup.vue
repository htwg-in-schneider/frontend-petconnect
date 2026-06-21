<script setup>
import Button from '@/components/Button.vue'

defineProps({
  text: String
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div class="confirm-popup">
    <p>{{ text }}</p>

    <div class="confirm-buttons">
      <Button
        variant="secondary"
        @click="emit('confirm')"
      >
        Ja
      </Button>

      <Button
        variant="accent"
        @click="emit('cancel')"
      >
        Nein
      </Button>
    </div>
  </div>
</template>

<style scoped>
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
  min-width: 400px;
}
.confirm-popup p {
font-size: 1.5rem;
 margin-bottom: 30px;
}
.confirm-buttons {
display: flex;
justify-content: center;
gap: 20px;
}
</style>