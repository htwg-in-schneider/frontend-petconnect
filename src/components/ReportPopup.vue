<script setup>
import Button from '@/components/Button.vue'

defineProps({
  report: Object,
  reportErrors: Object
})

const emit = defineEmits([
  'submit',
  'cancel',
   'clear-grund-error',
  'clear-beschreibung-error'
])
</script>

<template>
<div class="report-popup">
  <h3>Benutzer melden</h3>
  <select
    v-model="report.grund"
    class="form-control mb-3"
    :class="{ 'is-invalid': reportErrors.grund }"
    @change="emit('clear-grund-error')"
  >
    <option value="">
      Bitte wählen
    </option>
    <option value="Unangemessener Inhalt">
      Unangemessener Inhalt
    </option>
    <option value="Spam">
      Spam
    </option>
    <option value="Beleidigung">
      Beleidigung
    </option>
  </select>

  <div class="invalid-feedback d-block">
    {{ reportErrors.grund }}
  </div>

  <textarea
    v-model="report.beschreibung"
    class="form-control mb-3"
    :class="{ 'is-invalid': reportErrors.beschreibung }"
    @input="emit('clear-beschreibung-error')"
    placeholder="Beschreibung"
  />

  <div class="invalid-feedback d-block">
    {{ reportErrors.beschreibung }}
  </div>

  <div class="report-buttons">
    <Button
      variant="accent"
      @click="emit('submit')"
    >
      Melden
    </Button>
    <Button
      variant="secondary"
      @click="emit('cancel')"
    >
      Abbrechen
    </Button>
  </div>
</div>
</template>

<style scoped>
.report-popup {
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
.report-buttons {
display: flex;
justify-content: center;
gap: 20px;
}
</style>