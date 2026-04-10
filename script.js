// --- DYLOKI CLOUD CORE v4.0 ---
// Config is al ingevuld op basis van jouw eerdere afbeelding.

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
    if (!user || !pass) return alert("ACCESS DENIED: FILL ALL FIELDS");

    const userRef = ref(db, 'users/' + user);
    const snapshot = await get(userRef);
    if (snapshot.exists()) return alert("ERROR: NAME ALREADY IN DATABASE");

    await set(userRef, { username: user, password: pass, xp: 0, coins: 0 });
    alert("IDENTITY CREATED. YOU CAN NOW LOGIN.");
};

window.login = async function() {
    const user = document.getElementById('log-user').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;

    const userRef = ref(db, 'users/' + user);
    const snapshot = await get(userRef);

    if (snapshot.exists() && snapshot.val().password === pass) {
        currentUser = snapshot.val();
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        location.reload(); 
    } else {
        alert("ACCESS DENIED: INVALID CREDENTIALS");
    }
};

window.logout = function() {
    localStorage.removeItem('dyloki_session');
    location.reload();
};

function startPassiveEarning() {
    if (!currentUser) return;
    setInterval(async () => {
        currentUser.xp += 1;
        currentUser.coins += 5;
        const userRef = ref(db, 'users/' + currentUser.username);
        await update(userRef, { xp: currentUser.xp, coins: currentUser.coins });
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    }, 6000);
}

function updateUI() {
    if (currentUser) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        document.getElementById('nav-xp').innerText = "XP: " + currentUser.xp;
        document.getElementById('nav-coins').innerText = currentUser.coins;
        document.getElementById('xp-display').innerText = currentUser.xp;
        document.getElementById('coin-display').innerText = currentUser.coins;
        document.getElementById('user-welcome').innerText = currentUser.username.toUpperCase();

        let rank = "RECRUIT";
        if (currentUser.xp >= 5000) rank = "CYBER LORD";
        else if (currentUser.xp >= 1000) rank = "ELITE AGENT";
        else if (currentUser.xp >= 500) rank = "STRIKER";

        document.getElementById('rank-display').innerText = rank;
        document.getElementById('progress-bar').style.width = (currentUser.xp % 1000) / 10 + "%";
    }
}

updateUI();
if (currentUser) startPassiveEarning();
