import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

// --- Windows 10 Loader Component ---
const Win10Loader = () => (
  <div style={{ position: 'relative', width: '50px', height: '50px', margin: '20px auto' }}>
    <style>{`
      .win-dot { position: absolute; width: 6px; height: 6px; background: #FFB1C1; borderRadius: 50%; opacity: 0; animation: dotMove 3s infinite; }
      .win-dot:nth-child(1) { animation-delay: 0s; }
      .win-dot:nth-child(2) { animation-delay: 0.1s; }
      .win-dot:nth-child(3) { animation-delay: 0.2s; }
      .win-dot:nth-child(4) { animation-delay: 0.3s; }
      .win-dot:nth-child(5) { animation-delay: 0.4s; }
      @keyframes dotMove {
        0% { transform: rotate(220deg); opacity: 1; animation-timing-function: ease-out; }
        7% { transform: rotate(340deg); animation-timing-function: linear; }
        30% { transform: rotate(460deg); animation-timing-function: ease-in-out; }
        39% { transform: rotate(680deg); animation-timing-function: linear; }
        70% { transform: rotate(800deg); opacity: 1; animation-timing-function: ease-out; }
        75% { transform: rotate(920deg); animation-timing-function: ease-out; }
        76% { transform: rotate(920deg); opacity: 0; }
        100% { transform: rotate(920deg); opacity: 0; }
      }
    `}</style>
    {[...Array(5)].map((_, i) => <div key={i} className="win-dot" />)}
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (u) => {
    setIsLoading(true); // Triggers the loader
    // Force a 2-second load time to show the animation properly
    setTimeout(() => {
      setUsername(u);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 2000); 
  };

  if (!isLoggedIn) return <AuthScreen onLogin={handleLogin} isLoading={isLoading} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#333' }}>
      <header style={{ padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FFF0F3' }}>
        <div style={{ color: '#FF85A1', fontWeight: 'bold', fontSize: '24px' }}>Glovia 💕</div>
        <div style={{ fontSize: '20px' }}>🔍 🔔</div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'fun' && <GamesSection />}
        {activeTab === 'profile' && <ProfileView username={username} />}
      </div>

      <nav style={{ height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FFF0F3' }}>
        <button onClick={() => setActiveTab('home')} style={navBtnStyle(activeTab === 'home')}>🏠<div>Home</div></button>
        <button onClick={() => setActiveTab('chat')} style={navBtnStyle(activeTab === 'chat')}>💬<div>Chat</div></button>
        <button style={plusBtnStyle}>+</button>
        <button onClick={() => setActiveTab('fun')} style={navBtnStyle(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>
    </div>
  );
}

// --- Dynamic Profile Component (Photo, Bio, Edit, Save) ---
function ProfileView({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("✨ Seeking adventure and pastel aesthetics. ✨");
  const [photoUrl, setPhotoUrl] = useState("https://i.pinimg.com/736x/8f/c9/26/8fc926d017a0224d4554b4231b4b1a45.jpg");

  const saveProfile = () => {
    // Backend API call placeholder (e.g., fetch(`${BACKEND_URL}/save_profile`, { method: 'POST', ... }))
    alert("Profile saved! (Requires Backend Update 3)");
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      {/* Photo (Upload Simulation) */}
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
        <img src={photoUrl} alt="pfp" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #FF85A1' }} />
        {isEditing && (
          <button onClick={() => setPhotoUrl(prompt("Paste a URL for your new photo:", photoUrl))} style={{ position: 'absolute', bottom: 0, right: 0, background: '#FF85A1', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px' }}>+</button>
        )}
      </div>
      
      {/* Username and Bio */}
      <h2 style={{ color: '#FF85A1', margin: '0 0 10px 0' }}>@{username}</h2>
      
      {isEditing ? (
        <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: '100%', height: '80px', borderRadius: '15px', border: '1px solid #FEE2E9', padding: '10px', backgroundColor: '#FFF9FB' }} />
      ) : (
        <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic', marginBottom: '20px' }}>{bio}</p>
      )}

      {/* Stats Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-around', background: '#FFF0F3', borderRadius: '15px', padding: '10px', marginBottom: '25px', color: '#FF85A1' }}>
        <div><b>12</b><br/>Posts</div><div><b>240</b><br/>Following</div><div><b>1.2k</b><br/>Squad</div>
      </div>

      {/* Edit/Save Toggle */}
      {isEditing ? (
        <button onClick={saveProfile} style={{ ...primaryBtnStyle, width: '150px' }}>Save Changes</button>
      ) : (
        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: '2px solid #FF85A1', color: '#FF85A1', padding: '10px 25px', borderRadius: '25px', cursor: 'pointer' }}>Edit Profile</button>
      )}
    </div>
  );
}

// --- Optimized ChatSection: Polls Real-Time and Sized Bubbles ---
function ChatSection({ currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('global');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // Poll for messages every 3 seconds to get others' messages
  useEffect(() => {
    const syncChat = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/${activeSubTab === 'global' ? 0 : 1}`);
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error("Chat sync error"); }
    };
    syncChat();
    const interval = setInterval(syncChat, 3000); 
    return () => clearInterval(interval);
  }, [activeSubTab]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
    } catch (err) { alert("Fail to send"); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
        <button onClick={() => setActiveSubTab('global')} style={subTabStyle(activeSubTab === 'global')}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveSubTab('groups')} style={subTabStyle(activeSubTab === 'groups')}>My Groups 👥</button>
      </div>

      {activeSubTab === 'global' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((m, i) => {
              const isMe = m.sender === currentUser;
              return (
                <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
                  {!isMe && <span style={{ fontSize: '10px', color: '#FF85A1', marginLeft: '5px' }}>{m.sender}</span>}
                  <div style={{ display: 'inline-block', maxWidth: '80%', padding: '10px 15px', borderRadius: isMe ? '15px 15px 5px 15px' : '15px 15px 15px 5px', backgroundColor: isMe ? '#FF85A1' : '#fff', color: isMe ? '#fff' : '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '14px' }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#fff', borderTop: '1px solid #FFF0F3' }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type..." style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' }} />
            <button onClick={handleSend} style={{ background: '#FF85A1', color: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '20px' }}>🚀</button>
          </div>
        </div>
      ) : <div style={{ padding: '20px', color: '#FF85A1' }}>My Groups Coming Soon...</div>}
    </div>
  );
}

// --- AuthScreen with Windows 10 Loader ---
function AuthScreen({ onLogin, isLoading }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9FB', color: '#333' }}>
      <div style={{ textAlign: 'center', width: '80%' }}>
        <h1 style={{ color: '#FF85A1', marginBottom: '20px' }}>Glovia 💕</h1>
        {isLoading ? <Win10Loader /> : (
          <>
            <input value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key === 'Enter' && u && onLogin(u)} placeholder="Username" style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', marginBottom: '15px', backgroundColor: '#fff', outline: 'none' }} />
            <button onClick={() => u && onLogin(u)} style={primaryBtnStyle}>Enter</button>
          </>
        )}
      </div>
    </div>
  );
}

// --- Home and Games Placeholders ---
function HomeFeed() { return <div style={p20Style}><div style={{ background: '#FEE2E9', color: '#FF85A1', padding: '20px', borderRadius: '20px', fontWeight: 'bold' }}>Welcome Home! Posts coming soon... 🎀</div></div>; }
function GamesSection() { return <div style={p20Style}><h3 style={{color: '#FF85A1'}}>Games Zone 🎮</h3><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}><div style={gameCard}>Trivia 🧩</div><div style={gameCard}>Dress Up 👗</div></div></div>; }

// --- Consolidated Styles ---
const p20Style = { padding: '20px' };
const gameCard = { height: '100px', backgroundColor: '#fff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FF85A1', border: '1px solid #FEE2E9' };
const navBtnStyle = (active) => ({ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: active ? '#FF85A1' : '#BBB', textAlign: 'center', fontSize: '10px' });
const plusBtnStyle = { backgroundColor: '#FF85A1', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', border: 'none', fontSize: '28px', transform: 'translateY(-10px)', boxShadow: '0 4px 12px rgba(255,133,161,0.3)' };
const subTabStyle = (active) => ({ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: active ? '#FF85A1' : '#FEE2E9', color: active ? '#fff' : '#FF85A1', fontWeight: 'bold' });
const primaryBtnStyle = { width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#FF85A1', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' };

export default App;
