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
// ==========================================================================
// CONFIGURATION DU CALENDRIER & LIEN ICS
// ==========================================================================

// 1. Définissez ici votre lien de calendrier Airbnb ou Booking (.ics)
const URL_ICS_BRUT = "REMPLACEZ_PAR_VOTRE_LIEN_ICS_ICI";

// Utilisation d'un proxy public gratuit pour contourner le blocage de sécurité (CORS) du navigateur
const URL_ICS_PROXIFIEE = "https://allorigins.win" + encodeURIComponent(URL_ICS_BRUT);

// Noms des mois pour l'affichage en français
const NOMS_MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin", 
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", initCalendrier);

async function initCalendrier() {
    let datesOccupees = [];

    // Tenter de charger les vraies dates depuis Airbnb/Booking
    try {
        const response = await fetch(URL_ICS_PROXIFIEE);
        if (!response.ok) throw new Error("Erreur réseau");
        
        const texteICS = await response.text();
        datesOccupees = extraireDatesDepuisICS(texteICS);
    } catch (error) {
        console.warn("Impossible de charger le lien ICS (Affichage d'un calendrier vide) :", error);
    }

    // Lancer la génération visuelle des 12 mois
    generer12MoisGlissants(datesOccupees);
}

// ==========================================================================
// DECODAGE ANALYSE DU FICHIER ICS (SANS BIBLIOTHÈQUE LOURDE)
// ==========================================================================
function extraireDatesDepuisICS(texte) {
    const dates = [];
    const lignes = texte.split(/\r?\n/);
    let dateDebut = null;
    let dateFin = null;

    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        
        if (ligne.startsWith("DTSTART")) {
            dateDebut = interpreterDateICS(ligne.split(":")[1]);
        } else if (ligne.startsWith("DTEND")) {
            dateFin = interpreterDateICS(ligne.split(":")[1]);
        } else if (ligne.startsWith("END:VEVENT")) {
            // Quand un événement se termine, on calcule tous les jours occupés
            if (dateDebut && dateFin) {
                let courant = new Date(dateDebut);
                // On boucle jour par jour jusqu'à la veille du départ
                while (courant < dateFin) {
                    dates.push(formaterDateCle(courant));
                    courant.setDate(courant.getDate() + 1);
                }
            }
            dateDebut = null;
            dateFin = null;
        }
    }
    return dates;
}

// Convertit une chaîne ICS (Ex: 20261225T120000Z ou 20261225) en objet Date JavaScript
function interpreterDateICS(chaine) {
    if (!chaine) return null;
    const a = chaine.substring(0, 4);
    const m = chaine.substring(4, 6) - 1;
    const j = chaine.substring(6, 8);
    return new Date(a, m, j, 12, 0, 0); // calé à midi pour éviter les sauts d'heures d'été/hiver
}

// Crée une clé universelle au format "AAAA-MM-JJ"
function formaterDateCle(date) {
    const a = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const j = String(date.getDate()).padStart(2, '0');
    return `${a}-${m}-${j}`;
}

// ==========================================================================
// GENERATION DYNAMIQUE DU HTML DES 12 MOIS
// ==========================================================================
function generer12MoisGlissants(datesOccupees) {
    const grillePrincipale = document.getElementById("annualCalendarGrid");
    if (!grillePrincipale) return;
    
    grillePrincipale.innerHTML = ""; // Vider le conteneur

    const aujourdhui = new Date();
    let anneeCourante = aujourdhui.getFullYear();
    let moisCourant = aujourdhui.getMonth();

    // Boucle pour générer exactement 12 mois à partir de ce mois-ci
    for (let m = 0; m < 12; m++) {
        // Créer la boîte du mois
        const boiteMois = document.createElement("div");
        boiteMois.className = "month-box";

        // Titre du mois (Ex: "décembre 2026")
        const titre = document.createElement("div");
        titre.className = "month-title";
        titre.textContent = `${NOMS_MOIS[moisCourant]} ${anneeCourante}`;
        boiteMois.appendChild(titre);

        // Labels des jours de la semaine (L M M J V S D)
        const labelsSemaine = document.createElement("div");
        labelsSemaine.className = "week-days-labels";
        ["L", "M", "M", "J", "V", "S", "D"].forEach(lettre => {
            const divLettre = document.createElement("div");
            divLettre.textContent = lettre;
            labelsSemaine.appendChild(divLettre);
        });
        boiteMois.appendChild(labelsSemaine);

        // Grille des jours
        const grilleJours = document.createElement("div");
        grilleJours.className = "days-grid";

        // Déterminer le premier jour du mois (0 = Dimanche, 1 = Lundi...)
        let premierJourIndex = new Date(anneeCourante, moisCourant, 1).getDay();
        // Convertir le format pour commencer par Lundi (0 = Lundi ... 6 = Dimanche)
        premierJourIndex = premierJourIndex === 0 ? 6 : premierJourIndex - 1;

        // Nombre de jours total dans ce mois
        const totalJoursMois = new Date(anneeCourante, moisCourant + 1, 0).getDate();

        // 1. Ajouter les cases vides du début de mois (alignement du calendrier)
        for (let vide = 0; vide < premierJourIndex; vide++) {
            const caseVide = document.createElement("div");
            caseVide.className = "day-cell empty";
            grilleJours.appendChild(caseVide);
        }

        // 2. Ajouter les vrais jours du mois
        for (let jour = 1; jour <= totalJoursMois; jour++) {
            const dateActuelle = new Date(anneeCourante, moisCourant, jour);
            const dateCle = formaterDateCle(dateActuelle);

            const caseJour = document.createElement("div");
            caseJour.className = "day-cell";
            caseJour.textContent = jour;

            // Comparer avec la liste des réservations extraites du fichier ICS
            if (datesOccupees.includes(dateCle)) {
                caseJour.classList.add("occupe");
            } else {
                caseJour.classList.add("libre");
            }

            grilleJours.appendChild(caseJour);
        }

        boiteMois.appendChild(grilleJours);
        grillePrincipale.appendChild(boiteMois);

        // Passer au mois suivant dans la boucle
        moisCourant++;
        if (moisCourant > 11) {
            moisCourant = 0;
            anneeCourante++;
        }
    }
}
