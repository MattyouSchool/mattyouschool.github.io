import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// JOUW FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCi5LxXD-FGvdmlZGXPENYBWraWdDUNck0",
    authDomain: "dyloki-cloud.firebaseapp.com",
    projectId: "dyloki-cloud",
    storageBucket: "dyloki-cloud.firebasestorage.app",
    messagingSenderId: "486650834826",
    appId: "1:486650834826:web:d5efeb0af6cc574d0c2273",
    measurementId: "G-40YRW3TTGR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = JSON.parse(localStorage.getItem('dyloki_session')) || null;

// --- REGISTREREN ---
window.register = async function() {
    const user = document.getElementById('reg-user').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    
    if(!user || !pass) return alert("Vul alle velden in!");

    const userRef = ref(db, 'accounts/' + user);
    const snapshot = await get(userRef);

    if(snapshot.exists()) {
        alert("Deze naam is al bezet in de database!");
    } else {
        await set(userRef, {
            username: user,
            password: pass,
            xp: 0,
            coins: 0,
            rank: "Novice"
        });
        alert("Account succesvol aangemaakt! Je kunt nu inloggen.");
    }
};

// --- INLOGGEN ---
window.login = async function() {
    const user = document.getElementById('log-user').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;

    const userRef = ref(db, 'accounts/' + user);
    const snapshot = await get(userRef);

    if(snapshot.exists() && snapshot.val().password === pass) {
        currentUser = snapshot.val();
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        location.reload();
    } else {
        alert("Onjuiste gebruikersnaam of wachtwoord.");
    }
};

// --- UITLOGGEN ---
window.logout = function() {
    localStorage.removeItem('dyloki_session');
    location.reload();
};

// --- XP SYSTEEM ---
function startPassiveEarning() {
    if(!currentUser) return;
    setInterval(async () => {
        currentUser.xp += 1;
        currentUser.coins += 5;
        
        const userRef = ref(db, 'accounts/' + currentUser.username);
        await update(userRef, { xp: currentUser.xp, coins: currentUser.coins });
        
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    }, 5000); // Elke 5 seconden winst
}

function updateUI() {
    if(currentUser) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        document.getElementById('nav-xp').innerText = "XP: " + currentUser.xp;
        document.getElementById('nav-coins').innerText = "🪙 " + currentUser.coins;
        document.getElementById('xp-display').innerText = currentUser.xp;
        document.getElementById('coin-display').innerText = currentUser.coins;
        document.getElementById('user-welcome').innerText = currentUser.username.toUpperCase();

        let rank = "NOVICE";
        if(currentUser.xp >= 1000) rank = "ELITE";
        if(currentUser.xp >= 5000) rank = "CYBER LORD";
        document.getElementById('rank-display').innerText = rank;
        
        document.getElementById('progress-bar').style.width = (currentUser.xp % 100) + "%";
    }
}

updateUI();
if(currentUser) startPassiveEarning();
