// Fonction pour afficher une page spécifique
function showPage(pageId) {
    // Masquer toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Afficher la page sélectionnée
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Mettre à jour le menu actif
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) {
            link.classList.add('active');
        }
    });

    // Scroll vers le haut de la page
    window.scrollTo(0, 0);
}

// Gérer la soumission du formulaire de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const nom = document.getElementById('nom').value;
            const email = document.getElementById('email').value;
            const telephone = document.getElementById('telephone').value;
            const nombrePersonnes = document.getElementById('nombrePersonnes').value;
            const dateArrivee = document.getElementById('dateArrivee').value;
            const dateDepart = document.getElementById('dateDepart').value;
            const message = document.getElementById('message').value;

            // Afficher un message de confirmation
            alert(`Merci ${nom}!\n\nVotre réservation a été reçue.\n\nNous vous répondrons rapidement à l'adresse: ${email}\n\nEmail de destination: lerochersaintpierre1h@gmail.com`);
            
            // Réinitialiser le formulaire
            reservationForm.reset();
        });
    }
});

// Activer les liens de navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer l'ID de la page depuis l'attribut href
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
});