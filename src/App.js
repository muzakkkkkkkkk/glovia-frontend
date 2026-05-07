import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

// --- Windows 10 Circular Loader ---
const Win10Loader = () => (
  <div style={{ position: 'relative', width: '60px', height: '60px', margin: '20px auto' }}>
    <style>{`
      .dot { position: absolute; width: 6px; height: 6px; background: #FF85A1; border-radius: 50%; opacity: 0; animation: move 3s infinite; }
      .dot:nth-child(1) { animation-delay: 0s; }
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
      .ripple { position: relative; overflow: hidden; }
      .ripple:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10,10); opacity: 0; transition: transform .5s, opacity 1s; }
      .ripple:active:after { transform: scale(0,0); opacity: .3; transition: 0s; }
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
    setTimeout(() => {
      setUsername(u);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 2500); 
  };

  if (!isLoggedIn) return <AuthScreen onLogin={handleLogin} isLoading={isLoading} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Bar with Search and Notification */}
      <header style={{ padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FEE2E9' }}>
        <h2 style={{ color: '#FF85A1', margin: 0, fontSize: '24px' }}>Glovia 💕</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="ripple" onClick={() => alert("Search coming soon!")} style={iconBtn}>🔍</button>
          <button className="ripple" onClick={() => alert("No new notifications")} style={iconBtn}>🔔</button>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'fun' && <GamesSection />}
        {activeTab === 'profile' && <ProfileView username={username} />}
      </div>

      {/* Navigation Bar */}
      <nav style={{ height: '75px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FEE2E9' }}>
        <button className="ripple" onClick={() => setActiveTab('home')} style={navBtn(activeTab === 'home')}>🏠<div>Home</div></button>
        <button className="ripple" onClick={() => setActiveTab('chat')} style={navBtn(activeTab === 'chat')}>💬<div>Chat</div></button>
        <button className="ripple" onClick={() => alert("Create a new post! ✨")} style={plusBtnStyle}>+</button>
        <button className="ripple" onClick={() => setActiveTab('fun')} style={navBtn(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button className="ripple" onClick={() => setActiveTab('profile')} style={navBtn(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>
    </div>
  );
}

// --- Dynamic Profile Component ---
function ProfileView({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Just a girl living her best life ✨");
  const [pfp, setPfp] = useState("https://i.pinimg.com/736x/8f/c9/26/8fc926d017a0224d4554b4231b4b1a45.jpg");

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 20px' }}>
        <img src={pfp} style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #FF85A1' }} alt="profile" />
        {isEditing && (
          <button onClick={() => setPfp(prompt("Enter Image URL:"))} style={editPfpBtn}>+</button>
        )}
      </div>
      <h2 style={{ color: '#333' }}>@{username}</h2>
      {isEditing ? (
        <textarea value={bio} onChange={e => setBio(e.target.value)} style={bioInput} />
      ) : (
        <p style={{ color: '#777', fontStyle: 'italic' }}>{bio}</p>
      )}
      <button className="ripple" onClick={() => setIsEditing(!isEditing)} style={editBtn}>
        {isEditing ? "Save Profile" : "Edit Profile"}
      </button>
    </div>
  );
}

// --- Chat Section with Dynamic Width Bubbles ---
function ChatSection({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/0`);
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error("Sync error"); }
    };
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msg = { sender: currentUser, text: text, group_id: 0 };
    setMessages(prev => [...prev, msg]);
    setText("");
    await fetch(`${BACKEND_URL}/send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
        {messages.map((m, i) => {
          const isMe = m.sender === currentUser;
          return (
            <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', margin: '8px 0', maxWidth: '75%' }}>
              <div style={{
                backgroundColor: isMe ? '#FF85A1' : '#fff',
                color: isMe ? '#fff' : '#333',
                padding: '10px 16px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                display: 'inline-block', // KEY: Makes bubble fit the message width
                width: 'auto'
              }}>
                <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px' }}>{m.sender}</div>
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#fff' }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={chatInput} placeholder="Type a message..." />
        <button onClick={handleSend} className="ripple" style={sendBtn}>🚀</button>
      </div>
    </div>
  );
}

// --- Components & Styling ---
function AuthScreen({ onLogin, isLoading }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9FB' }}>
      <div style={{ textAlign: 'center', width: '80%' }}>
        <h1 style={{ color: '#FF85A1' }}>Glovia 💕</h1>
        {isLoading ? <Win10Loader /> : (
          <>
            <input value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key === 'Enter' && u && onLogin(u)} placeholder="Username" style={authInput} />
            <button onClick={() => u && onLogin(u)} style={authBtn}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

function HomeFeed() { return <div style={{padding: '20px', color: '#FF85A1'}}>Welcome Home! No posts yet. 🎀</div>; }
function GamesSection() { return <div style={{padding: '20px', color: '#FF85A1'}}>Games Zone coming soon! 🎮</div>; }

// --- CSS STYLES ---
const navBtn = (active) => ({ background: 'none', border: 'none', color: active ? '#FF85A1' : '#BBB', cursor: 'pointer', fontSize: '10px' });
const plusBtnStyle = { backgroundColor: '#FF85A1', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', border: 'none', fontSize: '28px', boxShadow: '0 4px 10px rgba(255,133,161,0.4)', transform: 'translateY(-10px)' };
const iconBtn = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' };
const chatInput = { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' };
const sendBtn = { background: '#FF85A1', color: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px' };
const authInput = { width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', marginBottom: '15px' };
const authBtn = { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#FF85A1', color: '#fff', fontWeight: 'bold' };
const editBtn = { background: 'none', border: '2px solid #FF85A1', color: '#FF85A1', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' };
const bioInput = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #FEE2E9', marginBottom: '10px' };
const editPfpBtn = { position: 'absolute', bottom: 0, right: 0, background: '#FF85A1', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px' };

export default App;
