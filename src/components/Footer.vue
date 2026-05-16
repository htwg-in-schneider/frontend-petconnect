<script setup>
import FooterLink from '@/components/FooterLink.vue'
</script>

<template>
<footer class="footer py-4 text-center">
    <img src="../assets/images/logo.jpg" width="60" alt="PetConnectLogo">

     <p>
    <FooterLink text="Impressum" label="Zum Impressum" href="#"/>
    |
    <FooterLink text="Datenschutz" label="Zum Datenschutz"href="#"/>
    |
    <FooterLink text="Kontakt" label="Zur Kontaktseite" href="#"/>
  </p>

</footer>
</template>

<style scoped>
.footer {
    background-color: #E8CFCF;
    font-weight: bold;
}
</style>