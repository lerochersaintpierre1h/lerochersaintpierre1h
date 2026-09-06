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

// 1. Définissez ici votre lien de calendrier (.ics)
const URL_ICS_BRUT = "https://ical.booking.com/v1/export?t=c2e693d7-90d5-4cb8-a2ee-4ee8f2536e2b";

// Utilisation du proxy AllOrigins pour contourner le blocage CORS du navigateur
const URL_ICS_PROXIFIEE = "https://allorigins.win" + encodeURIComponent(URL_ICS_BRUT);

const NOMS_MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin", 
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

document.addEventListener("DOMContentLoaded", initCalendrier);

async function initCalendrier() {
    let datesOccupees = [];
    console.log("Tentative de chargement du calendrier...");

    try {
        const response = await fetch(URL_ICS_PROXIFIEE);
        if (!response.ok) throw new Error("Erreur réseau ou proxy indisponible");
        
        const texteICS = await response.text();
        console.log("Fichier ICS récupéré avec succès. Analyse en cours...");
        datesOccupees = extraireDatesDepuisICS(texteICS);
        console.log("Dates occupées trouvées :", datesOccupees);
    } catch (error) {
        console.error("Erreur lors du chargement du fichier ICS :", error);
    }

    // On génère le calendrier (même s'il est vide suite à une erreur, pour afficher les mois)
    generer12MoisGlissants(datesOccupees);
}

// ==========================================================================
// DECODAGE ET ANALYSE ROBUSTE DU FICHIER ICS
// ==========================================================================
function extraireDatesDepuisICS(texte) {
    const dates = [];
    // Découpage propre des lignes pour éviter les retours chariots Windows/Mac
    const lignes = texte.replace(/\r/g, "").split("\n");
    
    let dateDebut = null;
    let dateFin = null;

    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        
        // Détection du début de réservation (DTSTART)
        if (ligne.startsWith("DTSTART")) {
            const parties = ligne.split(":");
            if (parties.length > 1) dateDebut = interpreterDateICS(parties[1]);
        } 
        // Détection de la fin de réservation (DTEND)
        else if (ligne.startsWith("DTEND")) {
            const parties = ligne.split(":");
            if (parties.length > 1) dateFin = interpreterDateICS(parties[1]);
        } 
        // Fin de l'événement : on enregistre les jours
        else if (ligne.startsWith("END:VEVENT")) {
            if (dateDebut && dateFin) {
                let courant = new Date(dateDebut);
                // Boucle du jour d'arrivée jusqu'à la veille du départ
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

// Convertisseur ICS -> Date JavaScript (Prend en compte les formats AAAAMMJJ et AAAAMMJJTHHMMSSZ)
function interpreterDateICS(valeur) {
    if (!valeur || valeur.length < 8) return null;
    
    // On extrait l'année, le mois (0-11 en JS) et le jour depuis la chaîne
    const annee = parseInt(valeur.substring(0, 4), 10);
    const mois = parseInt(valeur.substring(4, 6), 10) - 1;
    const jour = parseInt(valeur.substring(6, 8), 10);
    
    // On crée la date calée à midi pour éviter les bugs de fuseaux horaires
    return new Date(annee, mois, jour, 12, 0, 0);
}

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
    if (!grillePrincipale) {
        console.error("Élément #annualCalendarGrid introuvable dans le HTML !");
        return;
    }
    
    grillePrincipale.innerHTML = ""; 

    const aujourdhui = new Date();
    let anneeCourante = aujourdhui.getFullYear();
    let moisCourant = aujourdhui.getMonth();

    for (let m = 0; m < 12; m++) {
        const boiteMois = document.createElement("div");
        boiteMois.className = "month-box";

        const titre = document.createElement("div");
        titre.className = "month-title";
        titre.textContent = `${NOMS_MOIS[moisCourant]} ${anneeCourante}`;
        boiteMois.appendChild(titre);

        const labelsSemaine = document.createElement("div");
        labelsSemaine.className = "week-days-labels";
        ["L", "M", "M", "J", "V", "S", "D"].forEach(lettre => {
            const divLettre = document.createElement("div");
            divLettre.textContent = lettre;
            labelsSemaine.appendChild(divLettre);
        });
        boiteMois.appendChild(labelsSemaine);

        const grilleJours = document.createElement("div");
        grilleJours.className = "days-grid";

        let premierJourIndex = new Date(anneeCourante, moisCourant, 1).getDay();
        // Ajustement pour commencer la semaine le Lundi en France
        premierJourIndex = premierJourIndex === 0 ? 6 : premierJourIndex - 1;

        const totalJoursMois = new Date(anneeCourante, moisCourant + 1, 0).getDate();

        // 1. Cases vides
        for (let vide = 0; vide < premierJourIndex; vide++) {
            const caseVide = document.createElement("div");
            caseVide.className = "day-cell empty";
            grilleJours.appendChild(caseVide);
        }

        // 2. Vrais jours
        for (let jour = 1; jour <= totalJoursMois; jour++) {
            const dateActuelle = new Date(anneeCourante, moisCourant, jour);
            const dateCle = formaterDateCle(dateActuelle);

            const caseJour = document.createElement("div");
            caseJour.className = "day-cell";
            caseJour.textContent = jour;

            if (datesOccupees.includes(dateCle)) {
                caseJour.classList.add("occupe"); // Applique le rouge transparent du CSS
            } else {
                caseJour.classList.add("libre");  // Applique le vert transparent du CSS
            }

            grilleJours.appendChild(caseJour);
        }

        boiteMois.appendChild(grilleJours);
        grillePrincipale.appendChild(boiteMois);

        moisCourant++;
        if (moisCourant > 11) {
            moisCourant = 0;
            anneeCourante++;
        }
    }
}
