<script setup>

defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Suchen...'
  }
})

defineEmits(['update:modelValue'])

</script>

<template>

<div class="search-box mb-5">
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="form-control search-input"
    :placeholder="placeholder"
  >
</div>

</template>

<style scoped>
.no-results {
  text-align: center;
  margin: 50px;
  font-size: 1.3rem;
  color: #777;
}

.search-box {
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  border: 2px solid #D0A6A6;
  padding: 12px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #9BAF96;
  box-shadow: 0 0 8px rgba(155,175,150,0.4);
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }
}

</style>