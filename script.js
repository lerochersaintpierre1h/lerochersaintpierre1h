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
    });

    // Ajouter la classe active au lien cliqué
    event.target.classList.add('active');

    // Scroll vers le haut de la page
    window.scrollTo(0, 0);
}

// Gérer la soumission du formulaire de réservation avec EmailJS
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

            // Préparer le contenu de l'email
            const emailContent = `
Nouvelle demande de réservation:

Nom: ${nom}
Email: ${email}
Téléphone: ${telephone}
Nombre de personnes: ${nombrePersonnes}
Date d'arrivée: ${dateArrivee}
Date de départ: ${dateDepart}

Message:
${message}
            `;

            // Envoyer l'email via EmailJS
            const formData = new FormData(this);
            
            fetch('https://formspree.io/f/mjkqarqq', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert(`Merci ${nom}!\n\nVotre réservation a été envoyée avec succès.\n\nNous vous répondrons rapidement à l'adresse: ${email}\n\nEmail de confirmation: lerochersaintpierre1h@gmail.com`);
                    reservationForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            })
            .catch(error => {
                alert('Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.');
                console.error('Erreur:', error);
            });
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