import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setSignup] = useState(false);
  const [err, setErr] = useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      if (isSignup) {
        await axios.post(`${API}/signup`, { username, password });
        setSignup(false);
        setErr("Registreren gelukt. Je kunt nu inloggen.");
      } else {
        const r = await axios.post(`${API}/login`, { username, password });
        setToken(r.data.token);
      }
    } catch (e) {
      setErr("Fout: " + (e.response?.data.error || "Onbekend"));
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>{isSignup ? "Registreren" : "Inloggen"}</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Gebruikersnaam" required/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" required/>
      <button type="submit">{isSignup ? "Registreer" : "Login"}</button>
      <a href="#" onClick={e => {setSignup(!isSignup);e.preventDefault();}}>{isSignup ? "Heb je al een account?" : "Account maken"}</a>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  );
}

function Dashboard({ token, setToken }) {
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get(`${API}/profile`, {headers:{Authorization: `Bearer ${token}`}})
      .then(r=>setProfile(r.data));
    axios.get(`${API}/leaderboard`)
      .then(r=>setLeaderboard(r.data));
  }, [token]);

  // Simpele game beloning
  const reward = () => {
    axios.post(`${API}/game/reward`, {coins: 10, xp: 20}, {headers:{Authorization: `Bearer ${token}`}})
      .then(r => setProfile({...profile, ...r.data}));
  };

  return (
    <div>
      <h2>Welkom {profile?.username}</h2>
      <p>Coins: {profile?.coins} | XP: {profile?.xp}</p>
      <button onClick={reward}>Speel mini-game (krijg coins+XP)</button>
      <button onClick={() => setToken(null)}>Uitloggen</button>
      <h3>Leaderboard (top XP)</h3>
      <ol>
        {leaderboard.map(u => <li key={u.username}>{u.username}: {u.xp} XP, {u.coins} coins</li>)}
      </ol>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token")||null);
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <div style={{maxWidth:400,margin:'2em auto'}}>
      <h1>MattyouSchool Webgame Platform 🚀</h1>
      {token ? <Dashboard token={token} setToken={setToken}/> : <Login setToken={setToken}/>}
    </div>
  );
}
export default App;