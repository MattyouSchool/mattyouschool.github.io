// --- DYLOKI CLOUD CORE v4.1 ---
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

// REGISTER FUNCTIE (Maakt het mapje 'accounts' aan bij de eerste user)
window.register = async function() {
    const user = document.getElementById('reg-user').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    if (!user || !pass) return alert("FOUT: VUL ALLES IN");

    // We kijken nu in het mapje 'accounts'
    const userRef = ref(db, 'accounts/' + user);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
        return alert("FOUT: DEZE NAAM BESTAAT AL IN ACCOUNTS");
    }

    await set(userRef, { 
        username: user, 
        password: pass, 
        xp: 0, 
        coins: 0,
        rank: "Novice"
    });
    
    alert("ACCOUNT AANGEMAAKT IN DATABASE!");
};

// LOGIN FUNCTIE
window.login = async function() {
    const user = document.getElementById('log-user').value.trim().toLowerCase();
    const pass = document.getElementById('log-pass').value;

    const userRef = ref(db, 'accounts/' + user);
    const snapshot = await get(userRef);

    if (snapshot.exists() && snapshot.val().password === pass) {
        currentUser = snapshot.val();
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        location.reload(); 
    } else {
        alert("TOEGANG GEWEIGERD: GEGEVENS ONJUIST");
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
        // Update in het accounts mapje
        const userRef = ref(db, 'accounts/' + currentUser.username);
        await update(userRef, { xp: currentUser.xp, coins: currentUser.coins });
        localStorage.setItem('dyloki_session', JSON.stringify(currentUser));
        updateUI();
    }, 6000);
}

function updateUI() {
    if (currentUser) {
        if(document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
        if(document.getElementById('main-content')) document.getElementById('main-content').style.display = 'block';
        
        const xpElements = [document.getElementById('nav-xp'), document.getElementById('xp-display')];
        const coinElements = [document.getElementById('nav-coins'), document.getElementById('coin-display')];
        
        xpElements.forEach(el => { if(el) el.innerText = (el.id.includes('nav') ? "XP: " : "") + currentUser.xp; });
        coinElements.forEach(el => { if(el) el.innerText = (el.id.includes('nav') ? "🪙 " : "") + currentUser.coins; });
        
        if(document.getElementById('user-welcome')) document.getElementById('user-welcome').innerText = currentUser.username.toUpperCase();

        let rank = "Novice";
        if (currentUser.xp >= 5000) rank = "CYBER LORD";
        else if (currentUser.xp >= 1000) rank = "ELITE AGENT";
        
        if(document.getElementById('rank-display')) document.getElementById('rank-display').innerText = rank;
        if(document.getElementById('progress-bar')) document.getElementById('progress-bar').style.width = (currentUser.xp % 1000) / 10 + "%";
    }
}

updateUI();
if (currentUser) startPassiveEarning();
