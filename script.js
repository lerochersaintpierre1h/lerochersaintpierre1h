// ==========================================================================
// 1. NAVIGATION, GALERIE ET FORMULAIRES GENERAL
// ==========================================================================

// Fonction pour afficher une page spécifique
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) selectedPage.classList.add('active');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) link.classList.add('active');
    });
    window.scrollTo(0, 0);
}

// Gérer la soumission du formulaire de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nom = document.getElementById('nom').value;
            const email = document.getElementById('email').value;
            alert(`Merci ${nom}!\n\nVotre réservation a été reçue.\n\nNous vous répondrons rapidement à l'adresse: ${email}\n\nEmail de destination: lerochersaintpierre1h@gmail.com`);
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
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
});

// Filtrer la galerie d'images
function filterGallery(category) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');

    const items = document.querySelectorAll('.gallery-item');
    const lowerCategory = category.toLowerCase();
    items.forEach(item => {
        if (item.classList.contains(lowerCategory)) item.classList.add('active');
        else item.classList.remove('active');
    });
}

// Lightbox pour visionner les photos
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentActiveItems = [];
    let currentIndex = 0;

    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        gallerySection.addEventListener('click', function(e) {
            const clickedItem = e.target.closest('.gallery-item');
            if (!clickedItem) return;
            currentActiveItems = Array.from(document.querySelectorAll('.gallery-item.active'));
            currentIndex = currentActiveItems.indexOf(clickedItem);
            if (currentIndex !== -1) openLightbox();
        });
    }

    function openLightbox() {
        const targetImg = currentActiveItems[currentIndex].querySelector('img');
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt;
        lightbox.classList.add('active');
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentActiveItems.length;
        openLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentActiveItems.length) % currentActiveItems.length;
        openLightbox();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) lightbox.classList.remove('active');
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
});
// ==========================================================================
// CONFIGURATION DU CALENDRIER VIA GENS DE CONFIANCE (ICAL)
// ==========================================================================

// Votre lien de calendrier Gens de Confiance officiel
const URL_ICAL_GDC = "https://static.gensdeconfiance.com/calendars/91f96a3d-cf71-4903-bc29-161a9b58e509.calendar.ics";

const occupiedDates = new Set();
const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

document.addEventListener("DOMContentLoaded", initCalendrier);

async function initCalendrier() {
    console.log("Connexion au calendrier Gens de Confiance...");

    // Jeton anti-cache en temps réel pour forcer la mise à jour à chaque seconde
    const jetonAntiCache = "&nocache=" + new Date().getTime();
    const urlProxy = "https://allorigins.win" + encodeURIComponent(URL_ICAL_GDC + jetonAntiCache);

    try {
        const response = await fetch(urlProxy);
        if (!response.ok) throw new Error("Le serveur proxy n'a pas répondu");
        
        const texteICS = await response.text();
        console.log("Fichier iCal GdC récupéré. Extraction des dates occupées...");
        
        extraireDatesDepuisICS(texteICS);
        console.log("Synchronisation réussie. Nombre de jours bloqués en rouge :", occupiedDates.size);

    } catch (error) {
        console.error("Erreur lors de la synchronisation iCal :", error);
    }

    // Lance le tracé du calendrier (on utilise l'année en cours : 2026)
    renderCalendar(2026);
}

// ==========================================================================
// DECODER ULTRA-ROBUSTE POUR FICHIER .ICS
// ==========================================================================
function extraireDatesDepuisCSV(texteICS) { // Nom conservé pour éviter tout conflit interne
    extraireDatesDepuisICS(texteICS);
}

function extraireDatesDepuisICS(texteICS) {
    const lignes = texteICS.replace(/\r/g, "").split("\n");
    let dateDebut = null;
    let dateFin = null;

    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        if (!ligne) continue;

        // Détection de DTSTART (gère aussi DTSTART;VALUE=DATE:...)
        if (ligne.startsWith("DTSTART")) {
            const indexDeuxPoints = ligne.indexOf(":");
            if (indexDeuxPoints !== -1) {
                dateDebut = interpreterDateICS(ligne.substring(indexDeuxPoints + 1));
            }
        } 
        // Détection de DTEND
        else if (ligne.startsWith("DTEND")) {
            const indexDeuxPoints = ligne.indexOf(":");
            if (indexDeuxPoints !== -1) {
                dateFin = interpreterDateICS(ligne.substring(indexDeuxPoints + 1));
            }
        } 
        // Fin de l'événement de réservation : on marque les jours en rouge
        else if (ligne.startsWith("END:VEVENT")) {
            if (dateDebut && dateFin) {
                let courant = new Date(dateDebut);
                // On remplit le Set du jour de l'arrivée jusqu'à la veille du départ
                while (courant < dateFin) {
                    const annee = courant.getFullYear();
                    const mois = String(courant.getMonth() + 1).padStart(2, '0');
                    const jour = String(courant.getDate()).padStart(2, '0');
                    
                    occupiedDates.add(`${annee}-${mois}-${jour}`);
                    courant.setDate(courant.getDate() + 1);
                }
            }
            dateDebut = null;
            dateFin = null;
        }
    }
}

// Convertit les formats iCal (ex: "20260906" ou "20260906T120000Z") en objet Date
function interpreterDateICS(valeur) {
    if (!valeur || valeur.length < 8) return null;
    const propre = valeur.replace(/[^0-9]/g, ""); // Ne garde que les chiffres
    
    const annee = parseInt(propre.substring(0, 4), 10);
    const mois = parseInt(propre.substring(4, 6), 10) - 1;
    const jour = parseInt(propre.substring(6, 8), 10);
    
    return new Date(annee, mois, jour, 12, 0, 0); // Calage fixe à midi anti-décalage horaire
}

// ==========================================================================
// MOTEUR GRAPHIQUE DU CALENDRIER (S'INJECTE DANS annualCalendarGrid)
// ==========================================================================
function renderCalendar(year) {
    const container = document.getElementById("annualCalendarGrid");
    if (!container) return;

    container.innerHTML = "";

    const dateActuelle = new Date();
    let anneeCourante = dateActuelle.getFullYear();
    let moisCourant = dateActuelle.getMonth();

    // Génération dynamique de votre calendrier sur 12 mois glissants
    for (let i = 0; i < 12; i++) {
        let indexMois = (moisCourant + i) % 12;
        let anneeCible = anneeCourante + Math.floor((moisCourant + i) / 12);

        const monthBox = document.createElement("div");
        monthBox.className = "month-box";

        const title = document.createElement("div");
        title.className = "month-title";
        title.textContent = `${monthNames[indexMois]} ${anneeCible}`;
        monthBox.appendChild(title);

        const labels = document.createElement("div");
        labels.className = "week-days-labels";
        weekDays.forEach(day => {
            const cell = document.createElement("div");
            cell.textContent = day;
            labels.appendChild(cell);
        });
        monthBox.appendChild(labels);

        const daysGrid = document.createElement("div");
        daysGrid.className = "days-grid";

        let firstDay = new Date(anneeCible, indexMois, 1).getDay();
        let offset = firstDay === 0 ? 6 : firstDay - 1; // Alignement semaine française (Lundi)

        for (let j = 0; j < offset; j++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "day-cell empty";
            daysGrid.appendChild(emptyCell);
        }

        const daysInMonth = new Date(anneeCible, indexMois + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(anneeCible, indexMois, day);
            
            const anneeF = date.getFullYear();
            const moisF = String(date.getMonth() + 1).padStart(2, '0');
            const jourF = String(date.getDate()).padStart(2, '0');
            const cleDate = `${anneeF}-${moisF}-${jourF}`;

            const cell = document.createElement("div");
            cell.textContent = day;

            if (occupiedDates.has(cleDate)) {
                cell.className = "day-cell occupe"; // Applique votre classe rouge CSS
            } else {
                cell.className = "day-cell libre";  // Applique votre classe verte CSS
            }
            daysGrid.appendChild(cell);
        }
        monthBox.appendChild(daysGrid);
        container.appendChild(monthBox);
    }
}
