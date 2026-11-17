// ==========================================================================
// 1. NAVIGATION ENTRE LES PAGES & MENU MOBILE
// ==========================================================================

// Gérer l'ouverture/fermeture du menu sur mobile
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

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

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function reserverDirectly(event) {
    if (event) event.preventDefault();
    showPage('disponibilites');
    
    setTimeout(() => {
        const target = document.getElementById('section-reservation');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
            
            // Fermer le menu sur mobile après un clic
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
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

    const items = document.querySelectorAll('#appartement .gallery-item');
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

    document.addEventListener('click', function(e) {
        const clickedItem = e.target.closest('.gallery-item');
        if (!clickedItem) return;

        currentActiveItems = Array.from(document.querySelectorAll('.page.active .gallery-item.active'));
        currentIndex = currentActiveItems.indexOf(clickedItem);

        if (currentIndex !== -1) {
            openLightbox();
        }
    });

    function openLightbox() {
        if (!currentActiveItems[currentIndex]) return;
        const targetImg = currentActiveItems[currentIndex].querySelector('img');
        lightboxImg.src = targetImg.src;
        lightboxImg.alt = targetImg.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement de fond
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
        document.body.style.overflow = 'auto'; // Rétablir le défilement
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
// GESTION DES DEUX POP-UPS ET ENVOIS AJAX (RÉSERVATION & CONTACT)
// ==========================================================================

// 1. GESTION DE L'OUVERTURE ET FERMETURE DES POP-UPS
const modalResa = document.getElementById("modalReservation");
const btnOuvrirResa = document.getElementById("btnOuvrirResa");
const closeBtnResa = document.querySelector(".close-btn-resa");

if (btnOuvrirResa && modalResa) {
    btnOuvrirResa.addEventListener("click", () => modalResa.style.display = "block");
}
if (closeBtnResa && modalResa) {
    closeBtnResa.addEventListener("click", () => modalResa.style.display = "none");
}

const modalContact = document.getElementById("modalContact");
const btnContact = document.getElementById("btnContact");
const closeBtnContact = document.querySelector(".close-btn-contact");

if (btnContact && modalContact) {
    btnContact.addEventListener("click", () => modalContact.style.display = "block");
}
if (closeBtnContact && modalContact) {
    closeBtnContact.addEventListener("click", () => modalContact.style.display = "none");
}

// Clic à l'extérieur de la boite blanche pour fermer
window.addEventListener("click", (e) => {
    if (e.target === modalResa) modalResa.style.display = "none";
    if (e.target === modalContact) modalContact.style.display = "none";
});

// 2. ENVOI AJAX — FORMULAIRE DE RÉSERVATION (SANS REDIRECTION)
const reservationForm = document.getElementById("reservationForm");
if (reservationForm) {
    reservationForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Bloque la redirection vers Formspree
        
        const status = document.getElementById("form-status");
        const btnSubmit = reservationForm.querySelector('button[type="submit"]');
        const originalBtnText = btnSubmit.innerHTML;
        
        btnSubmit.innerHTML = "Envoi...";
        btnSubmit.disabled = true;

        fetch(reservationForm.action, {
            method: "POST",
            body: new FormData(reservationForm),
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.style.display = "block";
                status.style.backgroundColor = "#eafaf1";
                status.style.color = "#27ae60";
                
                const lang = localStorage.getItem('site_lang') || 'fr';
                status.innerHTML = lang === 'en' 
                    ? "Booking request sent!" 
                    : "Demande de réservation envoyée !";
                
                reservationForm.reset();
                
                // Fermeture automatique du pop-up après 3 secondes
                setTimeout(() => {
                    status.style.display = "none";
                    modalResa.style.display = "none";
                }, 3000);
            } else {
                status.style.display = "block";
                status.style.backgroundColor = "#fdf3f2";
                status.style.color = "#c0392b";
                status.innerHTML = "Oups ! Un problème est survenu.";
            }
        }).catch(error => {
            status.style.display = "block";
            status.style.backgroundColor = "#fdf3f2";
            status.style.color = "#c0392b";
            status.innerHTML = "Problème de connexion internet.";
        }).finally(() => {
            btnSubmit.innerHTML = originalBtnText;
            btnSubmit.disabled = false;
        });
    });
}

// 3. ENVOI AJAX — FORMULAIRE DE CONTACT (SANS REDIRECTION)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Bloque la redirection vers Formspree
        
        const status = document.getElementById("contact-form-status");
        const btnSubmit = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btnSubmit.innerHTML;
        
        btnSubmit.innerHTML = "Envoi...";
        btnSubmit.disabled = true;

        fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.style.display = "block";
                status.style.backgroundColor = "#eafaf1";
                status.style.color = "#27ae60";
                
                const lang = localStorage.getItem('site_lang') || 'fr';
                status.innerHTML = lang === 'en' 
                    ? "Message sent!" 
                    : "Message bien envoyé !";
                
                contactForm.reset();
                
                // Fermeture automatique du pop-up après 3 secondes
                setTimeout(() => {
                    status.style.display = "none";
                    modalContact.style.display = "none";
                }, 3000);
            } else {
                status.style.display = "block";
                status.style.backgroundColor = "#fdf3f2";
                status.style.color = "#c0392b";
                status.innerHTML = "Oups ! Un problème est survenu.";
            }
        }).catch(error => {
            status.style.display = "block";
            status.style.backgroundColor = "#fdf3f2";
            status.style.color = "#c0392b";
            status.innerHTML = "Problème de connexion internet.";
        }).finally(() => {
            btnSubmit.innerHTML = originalBtnText;
            btnSubmit.disabled = false;
        });
    });
}

// ==========================================================================
// 4. CALENDRIER DE DISPONIBILITÉS ET TARIFS (FIREBASE)
// ==========================================================================
const NOMS_MOIS = [
    "janvier", "février", "mars", "avril", "mai", "juin", 
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];
const NOMS_MOIS_EN = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

document.addEventListener("DOMContentLoaded", initCalendrier);

async function initCalendrier() {
    const grillePrincipale = document.getElementById("annualCalendarGrid");
    if (!grillePrincipale) return;

    generer12MoisGlissants([], {});

    try {
        const urlIcsFirebase = "https://firebasestorage.googleapis.com/v0/b/rochersaintpierre1h.firebasestorage.app/o/calendrier_site.ics?alt=media&v=" + Date.now();
        const urlTarifsFirebase = "https://firebasestorage.googleapis.com/v0/b/rochersaintpierre1h.firebasestorage.app/o/tarifs_site.json?alt=media&v=" + Date.now();

        const [responseIcs, responseTarifs] = await Promise.all([
            fetch(urlIcsFirebase),
            fetch(urlTarifsFirebase).catch(() => ({ ok: false })) 
        ]);

        let datesOccupees = [];
        let grilleTarifs = {};

        if (responseIcs.ok) {
            const texteICS = await responseIcs.text();
            if (texteICS.includes("BEGIN:VCALENDAR")) {
                datesOccupees = extraireDatesDepuisICS(texteICS);
            }
        }

        if (responseTarifs.ok) {
            grilleTarifs = await responseTarifs.json(); 
        }

        generer12MoisGlissants(datesOccupees, grilleTarifs);
        genererTableauTarifs(datesOccupees, grilleTarifs);
        
        // On force l'application de la langue actuelle après avoir généré le contenu dynamique
        const savedLang = localStorage.getItem('site_lang') || 'fr';
        setLanguage(savedLang);

    } catch (err) {
        console.error("Erreur de lecture Firebase :", err);
    }
}

function extraireDatesDepuisICS(texte) {
    const dates = [];
    const texteDeplie = texte.replace(/\r?\n[ \t]/g, "");
    const lignes = texteDeplie.split(/\r?\n/);
    let dateDebut = null; let dateFin = null;

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
            dateDebut = null; dateFin = null;
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

function getInfosSemaine(dateCle, datesOccupees, grilleTarifs) {
    const dateJour = new Date(dateCle + 'T12:00:00');
    const jourSemaine = dateJour.getDay();
    const diffSamedi = jourSemaine === 6 ? 0 : (jourSemaine === 0 ? -1 : -(jourSemaine + 1));
    
    const samediDebut = new Date(dateJour);
    samediDebut.setDate(samediDebut.getDate() + diffSamedi);
    const dateCleSemaine = formaterDateCle(samediDebut);

    let estOccupe = false;
    for (let i = 0; i < 7; i++) {
        let testDate = new Date(samediDebut);
        testDate.setDate(samediDebut.getDate() + i);
        if (datesOccupees.includes(formaterDateCle(testDate))) {
            estOccupe = true;
            break;
        }
    }

    const prix = grilleTarifs[dateCleSemaine] || "Sur demande";
    return { estOccupe, prix, dateCleSemaine, samediDebut };
}

function generer12MoisGlissants(datesOccupees, grilleTarifs) {
    const grillePrincipale = document.getElementById("annualCalendarGrid");
    if (!grillePrincipale) return;
    
    grillePrincipale.innerHTML = "";

    const aujourdhui = new Date();
    let anneeCourante = aujourdhui.getFullYear();
    let moisCourant = aujourdhui.getMonth();
    const currentLang = localStorage.getItem('site_lang') || 'fr';

    for (let m = 0; m < 12; m++) {
        const boiteMois = document.createElement("div");
        boiteMois.className = "month-box";

        const titre = document.createElement("div");
        titre.className = "month-title";
        // Ajout de la traduction pour le titre des mois
        titre.innerHTML = `<span data-fr="${NOMS_MOIS[moisCourant]} ${anneeCourante}" data-en="${NOMS_MOIS_EN[moisCourant]} ${anneeCourante}">${NOMS_MOIS[moisCourant]} ${anneeCourante}</span>`;
        boiteMois.appendChild(titre);

        const labelsSemaine = document.createElement("div");
        labelsSemaine.className = "week-days-labels";
        const labelsFr = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
        const labelsEn = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        
        labelsFr.forEach((lettre, index) => {
            const divLettre = document.createElement("div");
            // Ajout de la traduction pour les jours de la semaine
            divLettre.innerHTML = `<span data-fr="${lettre}" data-en="${labelsEn[index]}">${lettre}</span>`;
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

            const infosSemaine = getInfosSemaine(dateCle, datesOccupees, grilleTarifs);

            if (datesOccupees.includes(dateCle)) {
                caseJour.className = "day-cell occupe"; 
                // Stockage des traductions dans des attributs personnalisés pour l'info-bulle
                caseJour.setAttribute("data-tooltip-fr", "Occupé / Réservé");
                caseJour.setAttribute("data-tooltip-en", "Booked / Unavailable");
            } else {
                caseJour.className = "day-cell libre";
                caseJour.setAttribute("data-tooltip-fr", infosSemaine.estOccupe ? "Semaine partiellement occupée" : `Tarif semaine : ${infosSemaine.prix} €`);
                caseJour.setAttribute("data-tooltip-en", infosSemaine.estOccupe ? "Partially booked week" : `Weekly rate: €${infosSemaine.prix}`);
            }

            // On applique l'info-bulle dans la bonne langue au chargement
            caseJour.setAttribute("data-tooltip", caseJour.getAttribute("data-tooltip-" + currentLang));
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

function genererTableauTarifs(datesOccupees, grilleTarifs) {
    const container = document.getElementById("tarifs-container");
    if (!container) return;
    container.innerHTML = "";

    const aujourdhui = new Date();
    let dateDebutBoucle = new Date(aujourdhui);
    while(dateDebutBoucle.getDay() !== 6) {
        dateDebutBoucle.setDate(dateDebutBoucle.getDate() + 1);
    }

    let moisCourant = -1;
    let gridMois = null;

    for (let i = 0; i < 52; i++) {
        const dateSamediDebut = new Date(dateDebutBoucle);
        dateSamediDebut.setDate(dateSamediDebut.getDate() + (i * 7));
        
        const dateSamediFin = new Date(dateSamediDebut);
        dateSamediFin.setDate(dateSamediFin.getDate() + 7);

        let moisDeLaSemaine = dateSamediDebut.getMonth();
        if (moisDeLaSemaine !== moisCourant) {
            moisCourant = moisDeLaSemaine;
            
            const sectionMois = document.createElement("div");
            sectionMois.className = "tarif-month-section";
            
            const titreMois = document.createElement("h3");
            titreMois.className = "tarif-month-title";
            // Ajout de la traduction pour le titre des mois dans les cartes
            titreMois.innerHTML = `<span data-fr="${NOMS_MOIS[moisCourant]} ${dateSamediDebut.getFullYear()}" data-en="${NOMS_MOIS_EN[moisCourant]} ${dateSamediDebut.getFullYear()}">${NOMS_MOIS[moisCourant]} ${dateSamediDebut.getFullYear()}</span>`;
            
            gridMois = document.createElement("div");
            gridMois.className = "tarifs-grid";
            
            sectionMois.appendChild(titreMois);
            sectionMois.appendChild(gridMois);
            container.appendChild(sectionMois);
        }

        const dateCle = formaterDateCle(dateSamediDebut);
        const infosSemaine = getInfosSemaine(dateCle, datesOccupees, grilleTarifs);

        const carte = document.createElement("div");
        carte.className = `tarif-card ${infosSemaine.estOccupe ? 'occupe' : 'libre'}`;

        // Textes traduits pour les dates
        const phraseFr = `Du ${dateSamediDebut.getDate()} au ${dateSamediFin.getDate()} ${NOMS_MOIS[dateSamediFin.getMonth()]}`;
        const phraseEn = `${NOMS_MOIS_EN[dateSamediFin.getMonth()]} ${dateSamediDebut.getDate()} to ${dateSamediFin.getDate()}`;
        
        const htmlDates = `<div class="tc-date"><span data-fr="${phraseFr}" data-en="${phraseEn}">${phraseFr}</span></div>`;
        
        let htmlPrix = "";
        if (infosSemaine.estOccupe) {
            htmlPrix = `<div class="tc-price"><span class="badge-occupe" data-fr="Réservé" data-en="Booked">Réservé</span></div>`;
        } else {
            // Affichage Euro avant ou après selon la langue
            htmlPrix = `<div class="tc-price"><strong data-fr="${infosSemaine.prix} €" data-en="€${infosSemaine.prix}">${infosSemaine.prix} €</strong></div>`;
        }

        carte.innerHTML = htmlDates + htmlPrix;
        gridMois.appendChild(carte);
    }
}

// ==========================================================================
// 5. TRADUCTION DU SITE (FR / EN)
// ==========================================================================
function setLanguage(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + lang);
    if (activeBtn) activeBtn.classList.add('active');

    // Traduction classique des textes
    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + lang);
    });

    // Traduction dynamique des info-bulles du calendrier
    document.querySelectorAll('[data-tooltip-' + lang + ']').forEach(el => {
        el.setAttribute('data-tooltip', el.getAttribute('data-tooltip-' + lang));
    });

    // NOUVEAU : Traduction des placeholders (textes grisés dans les formulaires)
    document.querySelectorAll('[placeholder]').forEach(el => {
        if (el.hasAttribute('data-placeholder-' + lang)) {
            el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang));
        }
    });

    localStorage.setItem('site_lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('site_lang') || 'fr';
    if (savedLang === 'en') {
        setLanguage('en');
    }
});

// ==========================================================================
// 6. GESTION DES DATES DU FORMULAIRE
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    const inputArrivee = document.getElementById("dateArrivee");
    const inputDepart = document.getElementById("dateDepart");

    if (inputArrivee && inputDepart) {
        const dateAujourdhui = new Date().toISOString().split('T')[0];
        inputArrivee.setAttribute("min", dateAujourdhui);
        inputDepart.setAttribute("min", dateAujourdhui);

        function actualiserDepart() {
            if (inputArrivee.value) {
                const dateChoisie = new Date(inputArrivee.value + 'T12:00:00');
                dateChoisie.setDate(dateChoisie.getDate() + 1);
                const lendemain = dateChoisie.toISOString().split('T')[0];
                
                setTimeout(() => {
                    inputDepart.setAttribute("min", lendemain);
                    if (inputDepart.value && inputDepart.value < lendemain) {
                        inputDepart.value = "";
                    }
                }, 50);
            }
        }

        inputArrivee.addEventListener("change", actualiserDepart);
        inputArrivee.addEventListener("blur", actualiserDepart);
        inputDepart.addEventListener("focus", actualiserDepart);
        inputDepart.addEventListener("click", actualiserDepart);
        inputDepart.addEventListener("touchstart", actualiserDepart);
    }
});
