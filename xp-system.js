// Laad XP in vanuit localStorage, of start op 0 als er niets is
let xp = parseInt(localStorage.getItem('dyloki_xp')) || 0;

function updateUI() {
    // UI Elementen ophalen
    const xpCounter = document.getElementById('xp-counter');
    const rankTag = document.getElementById('rank-tag');

    // XP Display updaten
    if (xpCounter) {
        xpCounter.innerText = `XP: ${xp}`;
    }

    // Rank berekenen op basis van XP
    let rank = "ROOKIE";
    if (xp >= 100) rank = "AGENT";
    if (xp >= 500) rank = "ELITE";
    if (xp >= 1500) rank = "MASTER";
    if (xp >= 5000) rank = "LEGEND";
    if (xp >= 10000) rank = "OVERLORD";

    // Rank Display updaten
    if (rankTag) {
        rankTag.innerText = `RANK: ${rank}`;
    }

    // Opslaan in LocalStorage
    localStorage.setItem('dyloki_xp', xp);
}

// Elke 60 seconden (1 minuut) 10 XP toevoegen
setInterval(() => {
    xp += 10;
    console.log("+10 XP verdiend! Totaal: " + xp);
    updateUI();
}, 60000);

// Roep direct aan bij het laden van de pagina
updateUI();
