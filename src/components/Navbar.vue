<template>
<nav class="navbar navbar-expand-lg">
    <div class="container">
        <img src="/images/logo.jpg" width="60" class="me-2" alt="PetConnectLogo"> 
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
                        <router-link class="nav-link" to="/ausschreibungen">
                          Ausschreibungen
                        </router-link>
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
</template>


<style scoped>
.navbar {
    background-color: #E8CFCF; 
}

/* Burger-Menü Button */
.navbar-toggler {
    border-color: #9BAF96; /* Setze die Rahmenfarbe des Burger-Menüs */
    background-color: #9BAF96;
}

/* Navbar Links */
.navbar-nav .nav-link {
    color: #D28C8C; /* Setze die Textfarbe der Links */
    font-weight: bold; /* Mach den Text fett */
}


.offcanvas-header {
    background-color: #E8CFCF;
} 

.offcanvas-body {
    display: flex;
    justify-content: flex-start; /* oben */
    align-items: flex-start;     /* links */
}
</style>