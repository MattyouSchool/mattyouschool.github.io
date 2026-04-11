// UNIVERSEEL XP SYSTEEM
const XP_STORAGE_KEY = 'user_total_xp';

function addXP(amount) {
    let currentXP = parseInt(localStorage.getItem(XP_STORAGE_KEY)) || 0;
    currentXP += amount;
    localStorage.setItem(XP_STORAGE_KEY, currentXP);
    updateDisplays();
}

function updateDisplays() {
    const currentXP = parseInt(localStorage.getItem(XP_STORAGE_KEY)) || 0;
    
    // Update teller op homepagina/games
    const counter = document.getElementById('xp-counter');
    if (counter) counter.innerText = currentXP + " XP";

    // Update balk op homepagina
    const bar = document.getElementById('xp-bar');
    if (bar) {
        let progress = (currentXP % 100); // Voorbeeld: elke 100 XP is een nieuwe mijlpaal
        bar.style.width = progress + "%";
    }
}

// Elke minuut 10 XP erbij
setInterval(() => {
    addXP(10);
}, 60000);

// Update direct bij laden
window.addEventListener('load', updateDisplays);
