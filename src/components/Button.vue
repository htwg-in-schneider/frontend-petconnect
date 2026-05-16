<script setup>
const props = defineProps({
type: { type: String, default: 'button'},
variant: { type: String, default: 'accent'},
onClick: { type: Function, default: null}})

const buttonClass = `btn btn-${props.variant}`
</script>

<template>
    <button :type="type" :class="buttonClass" @click="onClick">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    border-radius: 30px;
    padding: 0.6rem 1.5rem;
    font-weight: bold;
}

.btn-accent {
    background-color: #9BAF96;
    color: white;
    border: none;
    transition: 0.3s;
}

.btn-accent:hover {
    background-color: #7f927a;
    color: white;
}

.btn-secondary {
    background-color: #D0A6A6;
    color: white;
    border: none;
}

.btn-secondary:hover {
    background-color: #cf9090;
    color: white;
}
</style>