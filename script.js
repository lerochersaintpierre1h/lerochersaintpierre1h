// ==========================================================================
// 1. NAVIGATION ENTRE LES PAGES
// ==========================================================================
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) {
            link.classList.add('active');
        }
    });

    window.scrollTo(0, 0);
}

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

// ==========================================================================
// 2. GALERIE DE PHOTOS ET LIGHTBOX
// ==========================================================================
function filterGallery(category) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    const items = document.querySelectorAll('.gallery-item');
    const lowerCategory = category.toLowerCase();

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
    
    let currentActiveItems = [];
    let currentIndex = 0;

    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        gallerySection.addEventListener('click', function(e) {
            const clickedItem = e.target.closest('.gallery-item');
            if (!clickedItem) return;

            currentActiveItems = Array.from(document.querySelectorAll('.gallery-item.active'));
            currentIndex = currentActiveItems.indexOf(clickedItem);

            if (currentIndex !== -1) {
                openLightbox();
            }
        });
    }

    function openLightbox() {
        if (!currentActiveItems[currentIndex]) return;
        const targetImg = currentActiveItems[currentIndex].querySelector('img');
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt;
        lightbox.classList.add('active');
    }

    function nextImage() {
        if (currentActiveItems.length === 0) return;
        currentIndex = (currentIndex + 1) % currentActiveItems.length;
        openLightbox();
    }

    function prevImage() {
        if (currentActiveItems.length === 0) return;
        currentIndex = (currentIndex - 1 + currentActiveItems.length) % currentActiveItems.length;
        openLightbox();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeLightbox();
    });
});

// ==========================================================================
// 3. FORMULAIRE DE RÉSERVATION (GÉNÉRATION DU MAILTO)
// ==========================================================================
function genererMailto(event) {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const emailClient = document.getElementById('email').value;
    const adulte = document.getElementById('nombreAdultes').value;
    const enfant = document.getElementById('nombreEnfants').value;
    const telephone = document.getElementById('telephone').value;
    const arrivee = document.getElementById('dateArrivee').value;
    const depart = document.getElementById('dateDepart').value;
    const message = document.getElementById('message').value;

    const emailDestinataire = "lerochersaintpierre1h@gmail.com";
    const sujet = encodeURIComponent(`Demande de réservation - ${nom}`);

    let corps = `Bonjour,%0D%0A%0D%0A`;
    corps += `Vous avez reçu une nouvelle demande de réservation :%0D%0A`;
    corps += `==================================================%0D%0A`;
    corps += `• Nom complet        : ${nom}%0D%0A`;
    corps += `• Email du client    : ${emailClient}%0D%0A`;
    corps += `• Téléphone          : ${telephone}%0D%0A`;
    corps += `• Voyageurs          : ${adulte} adulte(s) et ${enfant} enfant(s)%0D%0A`;
    corps += `• Période du séjour  : du ${arrivee} au ${depart}%0D%0A`;
    corps += `==================================================%0D%0A%0D%0A`;
    corps += `MESSAGE :%0D%0A${encodeURIComponent(message)}%0D%0A`;

    window.location.href = `mailto:${emailDestinataire}?subject=${sujet}&body=${corps}`;
}

// ==========================================================================
// 4. CALENDRIER DE DISPONIBILITÉS (FICHIER LOCAL GITHUB)
// ==========================================================================
const NOMS_MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin", 
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

document.addEventListener("DOMContentLoaded", initCalendrier);

async function initCalendrier() {
    const grillePrincipale = document.getElementById("annualCalendarGrid");
    if (!grillePrincipale) return;

    // 1. Calendrier neutre par défaut
    generer12MoisGlissants([]);

    try {
        // Lecture directe du fichier local booking.ics
        const response = await fetch("./booking.ics?v=" + Date.now());
        if (!response.ok) throw new Error("Fichier booking.ics introuvable");

        const texteICS = await response.text();

        if (texteICS && texteICS.includes("BEGIN:VCALENDAR")) {
            const datesOccupees = extraireDatesDepuisICS(texteICS);
            console.log("Dates chargées depuis booking.ics :", datesOccupees.length);
            generer12MoisGlissants(datesOccupees);
        } else {
            console.error("Le fichier booking.ics est vide ou invalide.");
        }
    } catch (err) {
        console.error("Erreur de lecture du calendrier local :", err);
    }
}

function extraireDatesDepuisICS(texte) {
    const dates = [];
    const texteDeplie = texte.replace(/\r?\n[ \t]/g, "");
    const lignes = texteDeplie.split(/\r?\n/);

    let dateDebut = null;
    let dateFin = null;

    lignes.forEach(ligne => {
        const l = ligne.trim();

        if (l.startsWith("DTSTART")) {
            const match = l.match(/\d{8}/);
            if (match) dateDebut = parseYYYYMMDD(match[0]);
        } 
        else if (l.startsWith("DTEND")) {
            const match = l.match(/\d{8}/);
            if (match) dateFin = parseYYYYMMDD(match[0]);
        } 
        else if (l.startsWith("END:VEVENT")) {
            if (dateDebut && dateFin) {
                let courant = new Date(dateDebut);
                while (courant < dateFin) {
                    dates.push(formaterDateCle(courant));
                    courant.setDate(courant.getDate() + 1);
                }
            }
            dateDebut = null;
            dateFin = null;
        }
    });

    return Array.from(new Set(dates));
}

function parseYYYYMMDD(str) {
    const annee = parseInt(str.substring(0, 4), 10);
    const mois = parseInt(str.substring(4, 6), 10) - 1;
    const jour = parseInt(str.substring(6, 8), 10);
    return new Date(annee, mois, jour, 12, 0, 0);
}

function formaterDateCle(date) {
    const a = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const j = String(date.getDate()).padStart(2, '0');
    return `${a}-${m}-${j}`;
}

function generer12MoisGlissants(datesOccupees) {
    const grillePrincipale = document.getElementById("annualCalendarGrid");
    if (!grillePrincipale) return;
    
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
        ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].forEach(lettre => {
            const divLettre = document.createElement("div");
            divLettre.textContent = lettre;
            labelsSemaine.appendChild(divLettre);
        });
        boiteMois.appendChild(labelsSemaine);

        const grilleJours = document.createElement("div");
        grilleJours.className = "days-grid";

        let premierJourIndex = new Date(anneeCourante, moisCourant, 1).getDay();
        premierJourIndex = premierJourIndex === 0 ? 6 : premierJourIndex - 1;

        const totalJoursMois = new Date(anneeCourante, moisCourant + 1, 0).getDate();

        for (let vide = 0; vide < premierJourIndex; vide++) {
            const caseVide = document.createElement("div");
            caseVide.className = "day-cell empty";
            grilleJours.appendChild(caseVide);
        }

        for (let jour = 1; jour <= totalJoursMois; jour++) {
            const dateActuelle = new Date(anneeCourante, moisCourant, jour);
            const dateCle = formaterDateCle(dateActuelle);

            const caseJour = document.createElement("div");
            caseJour.textContent = jour;

            if (datesOccupees.includes(dateCle)) {
                caseJour.className = "day-cell occupe"; 
            } else {
                caseJour.className = "day-cell libre";
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