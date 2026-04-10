import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCi5LxXD-FGvdmLZGXPENYBWraWdDUNck0",
    authDomain: "dyloki-cloud.firebaseapp.com",
    databaseURL: "https://dyloki-cloud-default-rtdb.firebaseio.com",
    projectId: "dyloki-cloud",
    storageBucket: "dyloki-cloud.firebasestorage.app",
    messagingSenderId: "486650834826",
    appId: "1:486650834826:web:d5efeb0af6cc574d0c2273",
    measurementId: "G-40YRW3TTGR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let currentUser = JSON.parse(localStorage.getItem('dyloki_session')) || null;

window.register = async function() {
    const user = document.getElementById('reg-user').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    if (!user || !pass) return alert("VUL ALLE VELDEN IN!");

    const userRef = ref(db, 'accounts/' + user);
    const snap = await get(userRef);
    if (snap.exists()) return alert("NAAM BESTAAT AL");

    await set(userRef, { username: user, password: pass, xp: 0, coins: 0, rank: "NOVICE" });
    alert("ACCOUNT SUCCESVOL GEREGISTREERD!");
};

window.login = async function() {
    const user = document.getElementById('log-user').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;
    const userRef = ref(db, 'accounts/' + user);
    const snap = await get(userRef);

    if (snap.exists() && snap.val().password === pass) {
        currentUser = snap.val();
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        location.reload(); 
    } else { alert("GEGEVENS ONJUIST"); }
};

window.logout = function() { localStorage.removeItem('dyloki_session'); location.reload(); };

// DIT IS HET XP SYSTEEM DAT ELKE 5 SECONDEN WERKT
function startPassiveEarning() {
    if (!currentUser) return;
    setInterval(async () => {
        currentUser.xp += 5; // Verhoogt XP met 5
        currentUser.coins += 10; // Verhoogt Coins met 10
        
        const userRef = ref(db, 'accounts/' + currentUser.username);
        await update(userRef, { xp: currentUser.xp, coins: currentUser.coins });
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    }, 5000);
}

function updateUI() {
    if (currentUser) {
        if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
        if(document.getElementById('main-content')) document.getElementById('main-content').style.display = 'block';
        
        document.getElementById('nav-xp').innerText = "XP: " + currentUser.xp;
        document.getElementById('nav-coins').innerText = "🪙 " + currentUser.coins;
        if(document.getElementById('xp-display')) document.getElementById('xp-display').innerText = currentUser.xp;
        if(document.getElementById('coin-display')) document.getElementById('coin-display').innerText = currentUser.coins;
        if(document.getElementById('user-welcome')) document.getElementById('user-welcome').innerText = currentUser.username.toUpperCase();

        // Rank Berekening
        let rank = "NOVICE";
        if (currentUser.xp >= 10000) rank = "ELITE GHOST";
        else if (currentUser.xp >= 5000) rank = "CYBER LORD";
        else if (currentUser.xp >= 1000) rank = "STRIKER";
        else if (currentUser.xp >= 500) rank = "AGENT";

        if(document.getElementById('rank-display')) document.getElementById('rank-display').innerText = rank;
        
        // Progress bar (tot volgende 1000 XP)
        if(document.getElementById('progress-bar')) {
            let progress = (currentUser.xp % 1000) / 10;
            document.getElementById('progress-bar').style.width = progress + "%";
        }
    }
}

updateUI();
if (currentUser) startPassiveEarning();
