<template>
<!-- NAVBAR START -->
    <nav class="navbar navbar-expand-lg">
    <div class="container">
        <img src="./assets/images/logo.jpg" width="60" class="me-2" alt="PetConnectLogo"> 
        <a class="navbar-brand" href="#">PetConnect</a>
       
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOffcanvasLg" aria-controls="navbarOffcanvasLg" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="navbarOffcanvasLg">
            <div class="offcanvas-header">
                <h5 id="navbarOffcanvasLgLabel">PetConnect</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <!-- FIX: UL ist jetzt IM offcanvas-body -->
            <div class="offcanvas-body">
                <ul class="navbar-nav ms-auto"> <!-- ms-auto hier fügt die "Right-Aligment" hinzu -->
                    <li class="nav-item">
                        <a class="nav-link" href="#">Ausschreibungen</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Über uns</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Anmelden</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Registrieren</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
          
    <!-- NAVBAR END -->


<section class="top py-5"> <!--py-5 = Bootstrap (viel Abstand oben/unten)-->
  <div class="container">
    <div class="row align-items-center"> <!--row → Zeile align-items-center → vertikal mittig-->

      <!-- TEXT -->
      <div class="col-lg-6 text-center text-lg-start"> 
        <!--col-lg-6        auf Desktop: 50% Breite auf Mobile: 100%
        text-center         Mobile
        text-lg-start       Desktop links-->
        <h1>Willkommen bei PetConnect!</h1>
        <p>
          Suchst du einen zuverlässigen Tiersitter für dein Haustier oder möchtest selbst einer werden?
          Wir helfen dir, die perfekte Betreuung zu finden –
          schnell und unkompliziert.
        </p>
        <button class="btn btn2">Ausschreibung hochladen</button>
      </div>

      
      <div class="col-lg-6 position-relative text-center mt-4 mt-lg-0">

        <div class="image-main">
          <img src="./assets/images/goldenretriever.jpg" class="img-fluid" alt="GoldenRetriever"> <!--passt sich Bildschirm an wird nicht zu groß-->
        </div>

        <div class="image-small-left">
          <img src="./assets/images/hundundkatze.jpg" alt="HundUndKatze">
        </div>

        <div class="image-small-right">
          <img src="./assets/images/hund-header.jpg" alt="Hund">
        </div>

      </div>

    </div>
  </div>
</section>


<section class="funktion py-5 text-center">
  <div class="container">

    <h2>So funktioniert’s</h2>
    <img src="./assets/images/Colorful_paws.png" class="mb-3" width="120" alt="FarbigePfotenabdrücke">

    <div class="row mt-4 g-4">

      <div class="col-md-4"> <!-- 4 von 12 Spalten-->
        <img src="./assets/images/User_Icon_Green.png" class="icon mb-2" alt="UserIcon">
        <h5><span class="number">1</span> Registrieren</h5>
        <p>Erstelle ein Profil als Tierbesitzer oder Tiersitter - kostenlos und einfach.</p>
      </div>

      <div class="col-md-4">
        <img src="./assets/images/Lupe_Icon_Rosa.png" class="icon mb-2" alt="LupeIcon">
        <h5><span class="number">2</span> Finden</h5>
        <p>Durchsuche passende Anzeigen in deiner Umgebung.</p>
      </div>

      <div class="col-md-4">
        <img src="./assets/images/Speechbubble_Icon_green.png" class="icon mb-2" alt="SprechblaseIcon">
        <h5><span class="number">3</span> Verbinden</h5>
        <p>Nehmt Kontakt auf und besprecht privat alle Details.</p>
      </div>

    </div>
  </div>
</section>


<section class="warum py-5 text-center">
  <div class="container">

    <h2>Warum PetConnect?</h2>
    <img src="./assets/images/Colorful_paws.png" class="mb-4" width="120" alt="FarbigePfotenabdrücke">

    <div class="row mt-4 g-4"> <!--g-4 = Abstand zwischen Spalten-->

      <div class="col-md-4">
        <div class="card-box">
          <img src="./assets/images/Green_location_pin_icon.png" class="icon mb-2" alt="LocationIcon">
          <h6>In deiner Umgebung</h6>
          <p>Filtere nach Standort und finde Tierbesitzer ganz in deiner Nähe</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card-box">
          <img src="./assets/images/calendar_icon.png" class="icon mb-2" alt="KalenderIcon">
          <h6>Schnell & unkompliziert</h6>
          <p>Einfach, benutzerfreundlich und in wenigen Klicks startklar</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card-box">
          <img src="./assets/images/shield_icon.png" class="icon mb-2" alt="ShieldIcon">
          <h6>Direkter Austausch</h6>
          <p>Chatfunktion und Profilbewertungen schaffen Vertrauen</p>
        </div>
      </div>

    </div>
  </div>
</section>


<section class="bewertungen py-5 text-center">
  <div class="container">

    <div class="bewertung-header">
  <h2>Überzeug dich selbst: Das sagen unsere Nutzer über uns...</h2>
  <img src="./assets/images/knochen.png" class="knochenbild" alt="Hundeknochen">
</div>

    <div class="review">
      <p>"Ich bin froh auf diese Website gestoßen zu sein! Endlich habe ich jemanden gefunden der meinen Wolfi ausführt."</p>
      <small>~ Manuela, 73 aus Bremen</small>
    </div>

    <div class="review">
      <p>"“Durch PetConnect habe ich eine neue Freundin gefunden. 
        Ein Wochenende nehme ich ihre Hündin Paula zu mir, ein anderes Wochenende nimmt sie meine Hündin Mia zu sich 
        - und ab und zu ist noch Zeit für ein Kaffee !”</p>
      <small>~ Rebecca, 26 aus Berlin</small>
    </div>

    <div class="review">
      <p>"Ich liebe PetConnect!!!"</p>
      <small>~ Lucas, 9 aus München</small>
    </div>

  </div>
</section>


<footer class="footer py-4 text-center">
    <img src="./assets/images/logo.jpg" width="60" alt="PetConnectLogo">
    <p><a href="#">Impressum</a> | 
      <a href="#">Datenschutz</a> | 
      <a href="#">Kontakt</a></p>
</footer>

</template>

