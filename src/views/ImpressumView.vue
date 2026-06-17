<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

</script>

<template>

  <Navbar />
  <section class="kontakt py-5">
    <div class="container">
      <h1>Impressum</h1>
    
    <div class="adresse-box">
    Hochschule Konstanz <br>
    Technik, Wirtschaft und Gestaltung <br>
    Alfred-Wachtel-Str. 8 <br>
    78462 Konstanz <br><br><br><br><br>

     Hinweis: Diese Website ist ein studentisches Projekt im Rahmen des Moduls Webtechnologien an der HTWG Konstanz.
    </div>
    </div>
  
       
    
  </section>

  <Footer />
</template>

<style scoped>

a {
    color:black;
}

.adresse-box{
  margin-top:40px;
  padding: 15px;
  border: 4px solid #9BAF96;
  border-radius: 20px;
  display: inline-block;
  background: white; 
}

</style>
