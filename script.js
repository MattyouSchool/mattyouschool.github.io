// --- DYLOKI CORE ENGINE v2.0 ---
// Made by mattyou studios™ x Dylano

let currentUser = JSON.parse(localStorage.getItem('dyloki_session')) || null;

// Systeem om XP en Coins bij te werken
function updateProgress() {
    if (!currentUser) return;

    currentUser.xp += 1; // 10 XP per minuut (bij interval van 6 sec)
    currentUser.coins += 5; // 50 Coins per minuut
    
    saveUser();
    updateUI();
}

function saveUser() {
    if (!currentUser) return;
    localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
    
    // Update ook in de database van alle accounts
    let accounts = JSON.parse(localStorage.getItem('dyloki_accounts')) || [];
    let index = accounts.findIndex(a => a.username === currentUser.username);
    if (index !== -1) {
        accounts[index] = currentUser;
        localStorage.setItem('dyloki_accounts', JSON.stringify(accounts));
    }
}

function updateUI() {
    if (!currentUser) {
        if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'block';
        if (document.getElementById('main-content')) document.getElementById('main-content').style.display = 'none';
        return;
    }

    if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
    if (document.getElementById('main-content')) document.getElementById('main-content').style.display = 'block';

    // UI Elementen vullen
    const elements = {
        'nav-xp': `XP: ${currentUser.xp}`,
        'nav-coins': `🪙 ${currentUser.coins}`,
        'xp-display': currentUser.xp,
        'coin-display': currentUser.coins,
        'user-welcome': currentUser.username
    };

    for (let id in elements) {
        if (document.getElementById(id)) document.getElementById(id).innerText = elements[id];
    }

    // Rank systeem
    let rank = "Beginner";
    let color = "#00f2fe";
    if (currentUser.xp >= 5000) { rank = "Dyloki Legend"; color = "#ff00ff"; }
    else if (currentUser.xp >= 1000) { rank = "Elite Gamer"; color = "#4facfe"; }
    else if (currentUser.xp >= 500) { rank = "Pro Player"; color = "#ffd700"; }

    if (document.getElementById('rank-display')) {
        document.getElementById('rank-display').innerText = rank;
        document.getElementById('rank-display').style.color = color;
    }
    
    if (document.getElementById('progress-bar')) {
        let prog = (currentUser.xp % 1000) / 10; 
        document.getElementById('progress-bar').style.width = prog + "%";
    }
}

// Account Functies
function register() {
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    if (!user || !pass) return alert("Vul alles in!");

    let accounts = JSON.parse(localStorage.getItem('dyloki_accounts')) || [];
    if (accounts.find(a => a.username === user)) return alert("Naam bestaat al!");

    let newUser = { username: user, password: pass, xp: 0, coins: 0, inventory: [] };
    accounts.push(newUser);
    localStorage.setItem('dyloki_accounts', JSON.stringify(accounts));
    alert("Account aangemaakt! Je kunt nu inloggen.");
}

function login() {
    const user = document.getElementById('log-user').value;
    const pass = document.getElementById('log-pass').value;
    
    let accounts = JSON.parse(localStorage.getItem('dyloki_accounts')) || [];
    let found = accounts.find(a => a.username === user && a.password === pass);

    if (found) {
        currentUser = found;
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    } else {
        alert("Foutieve inloggegevens!");
    }
}

function logout() {
    localStorage.removeItem('dyloki_session');
    location.reload();
}

// Shop
function buyItem(itemName, price) {
    if (currentUser.coins >= price) {
        currentUser.coins -= price;
        currentUser.inventory.push(itemName);
        saveUser();
        updateUI();
        alert(`Je hebt ${itemName} gekocht! Check je profiel.`);
    } else {
        alert("Niet genoeg coins!");
    }
}

// Intervals
setInterval(updateProgress, 6000);
window.onload = updateUI;
