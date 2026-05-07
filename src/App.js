import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

// --- Windows 10 Loading Component ---
const Win10Loading = () => (
  <div className="win10-loader">
    <style>{`
      .win10-loader { position: relative; width: 50px; height: 50px; margin: 20px auto; }
      .dot { position: absolute; width: 5px; height: 5px; background: #FF85A1; borderRadius: 50%; opacity: 0; animation: move 2.5s infinite; }
      .dot:nth-child(2) { animation-delay: 0.1s; }
      .dot:nth-child(3) { animation-delay: 0.2s; }
      .dot:nth-child(4) { animation-delay: 0.3s; }
      .dot:nth-child(5) { animation-delay: 0.4s; }
      @keyframes move {
        0% { transform: rotate(225deg); opacity: 1; animation-timing-function: ease-out; }
        7% { transform: rotate(345deg); animation-timing-function: linear; }
        30% { transform: rotate(455deg); animation-timing-function: ease-in-out; }
        39% { transform: rotate(690deg); animation-timing-function: linear; }
        70% { transform: rotate(815deg); opacity: 1; animation-timing-function: ease-out; }
        75% { transform: rotate(945deg); animation-timing-function: ease-out; }
        76% { transform: rotate(945deg); opacity: 0; }
        100% { transform: rotate(945deg); opacity: 0; }
      }
    `}</style>
    {[...Array(5)].map((_, i) => <div key={i} className="dot" />)}
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (u) => {
    setIsLoading(true);
    // Simulate loading for the animation effect
    setTimeout(() => {
      setUsername(u);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 2000);
  };

  if (!isLoggedIn) return <AuthScreen onLogin={handleLogin} isLoading={isLoading} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #FEE2E9', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>🔍 🔔</div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'fun' && <GamesSection />}
        {activeTab === 'profile' && <ProfileView username={username} />}
      </div>

      {/* FIXED NAVIGATION BAR */}
      <nav style={{ height: '75px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FEE2E9', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('home')} style={navBtn}>🏠<div style={{fontSize:'10px'}}>Home</div></button>
        <button onClick={() => setActiveTab('chat')} style={navBtn}>💬<div style={{fontSize:'10px'}}>Chat</div></button>
        <button style={plusBtn}>+</button>
        <button onClick={() => setActiveTab('fun')} style={navBtn}>🎮<div style={{fontSize:'10px'}}>Fun</div></button>
        <button onClick={() => setActiveTab('profile')} style={navBtn}>👤<div style={{fontSize:'10px'}}>Profile</div></button>
      </nav>
    </div>
  );
}

// --- COMPONENTS ---

function ChatSection({ currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('global');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/${activeSubTab === 'global' ? 0 : 1}`);
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error("Sync error"); }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeSubTab]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msgData = { sender: currentUser, text: text, group_id: activeSubTab === 'global' ? 0 : 1 };
    setMessages([...messages, msgData]);
    setText("");
    try {
      await fetch(`${BACKEND_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) { alert("Fail"); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
        <button onClick={() => setActiveSubTab('global')} style={subTabStyle(activeSubTab === 'global')}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveSubTab('groups')} style={subTabStyle(activeSubTab === 'groups')}>My Groups 👥</button>
      </div>
      
      {activeSubTab === 'global' ? (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
                <div style={{ backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff', color: m.sender === currentUser ? '#fff' : '#333', padding: '10px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <strong>{m.sender}:</strong> {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#fff' }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd' }} placeholder="Type..." />
            <button onClick={handleSend} style={{ background: '#FF85A1', border: 'none', borderRadius: '50%', color: '#fff', width: '40px' }}>🚀</button>
          </div>
        </div>
      ) : <GroupsList />}
    </div>
  );
}

function HomeFeed() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#FF85A1', color: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
        <h3>Welcome back! ✨</h3>
        <p>Check out what's new in your girl squad today.</p>
      </div>
      <div style={{ height: '200px', backgroundColor: '#FEE2E9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF85A1' }}>
        New Posts Coming Soon...
      </div>
    </div>
  );
}

function GamesSection() {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#FF85A1' }}>Games & Fun 🎮</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {['Trivia 🧩', 'Dress Up 👗', 'Daily Poll 📊', 'Mini Golf ⛳'].map(game => (
          <div key={game} style={{ height: '100px', backgroundColor: '#fff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FEE2E9', fontWeight: 'bold' }}>{game}</div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ username }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#FF85A1', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#fff' }}>{username[0].toUpperCase()}</div>
      <h2 style={{ color: '#333' }}>@{username}</h2>
      <button style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #FF85A1', color: '#FF85A1', background: 'none' }}>Edit Profile</button>
    </div>
  );
}

function AuthScreen({ onLogin, isLoading }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9FB' }}>
      <div style={{ textAlign: 'center', width: '80%' }}>
        <h1 style={{ color: '#FF85A1' }}>Glovia 💕</h1>
        {isLoading ? <Win10Loading /> : (
          <>
            <input 
              value={u} 
              onChange={e => setU(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && u && onLogin(u)} // ENTER KEY FIX
              placeholder="Username" 
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', marginBottom: '15px' }} 
            />
            <button onClick={() => u && onLogin(u)} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#FF85A1', color: '#fff', fontWeight: 'bold' }}>Enter</button>
          </>
        )}
      </div>
    </div>
  );
}

function GroupsList() {
  return (
    <div style={{ padding: '15px' }}>
      {['Study Besties 📖', 'Outfit Inspo 👗', 'Late Night Talks 🌙'].map(g => (
        <div key={g} style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '10px', border: '1px solid #FEE2E9' }}>{g}</div>
      ))}
    </div>
  );
}

// --- STYLES ---
const navBtn = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' };
const plusBtn = { backgroundColor: '#FF85A1', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', border: 'none', fontSize: '24px', boxShadow: '0 4px 10px rgba(255,133,161,0.3)' };
const subTabStyle = (active) => ({ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: active ? '#FF85A1' : '#FEE2E9', color: active ? '#fff' : '#FF85A1', fontWeight: 'bold' });

export default App;
