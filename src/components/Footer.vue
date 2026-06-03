<script setup>
import FooterLink from '@/components/FooterLink.vue'
</script>

<template>
<footer class="footer py-4 text-center">
    <img src="../assets/images/logo.jpg" width="60" alt="PetConnectLogo">

     <p>
     <router-link to="/impressum">Impressum</router-link>

    |
    <router-link to="/datenschutz">Datenschutz</router-link>
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
a{
  color: black;

}
a:hover {
  color: #9BAF96;
}


datenschutz{
  color:black;
}
datenschutz:hover{
   color: #9BAF96;
}

</style>