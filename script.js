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
function filterGallery(category) {
    // 1. Mettre à jour l'état actif des boutons d'onglets
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    // 2. Filtrer et afficher uniquement les images de l'onglet sélectionné
    const items = document.querySelectorAll('.gallery-item');
    const lowerCategory = category.toLowerCase(); // Force la catégorie en minuscules

    items.forEach(item => {
        if (item.classList.contains(lowerCategory)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentActiveItems = []; // Stocke les images de l'onglet actif
    let currentIndex = 0;        // Index de l'image ouverte

    // Événement : Clic sur une image de la galerie
    document.querySelector('.gallery-section').addEventListener('click', function(e) {
        // On vérifie qu'on a cliqué sur une image dans un item de galerie
        const clickedItem = e.target.closest('.gallery-item');
        if (!clickedItem) return;

        // On récupère TOUTES les images actuellement visibles dans l'onglet actif
        currentActiveItems = Array.from(document.querySelectorAll('.gallery-item.active'));
        
        // On cherche la position de l'image cliquée dans cette liste
        currentIndex = currentActiveItems.indexOf(clickedItem);

        if (currentIndex !== -1) {
            openLightbox();
        }
    });

    // Fonction pour ouvrir et afficher l'image
    function openLightbox() {
        const targetImg = currentActiveItems[currentIndex].querySelector('img');
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt;
        lightbox.classList.add('active');
    }

    // Image suivante
    function nextImage() {
        currentIndex = (currentIndex + 1) % currentActiveItems.length;
        openLightbox();
    }

    // Image précédente
    function prevImage() {
        currentIndex = (currentIndex - 1 + currentActiveItems.length) % currentActiveItems.length;
        openLightbox();
    }

    // Fermer la lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    // Liens vers les boutons
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    closeBtn.addEventListener('click', closeLightbox);

    // Fermer si on clique sur le fond noir en dehors de l'image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Optionnel : Permettre de naviguer avec le clavier (flèches gauche/droite et Échap)
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeLightbox();
    });
});
