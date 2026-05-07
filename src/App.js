import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

// --- Windows 10 Circular Loader ---
const Win10Loader = () => (
  <div style={{ position: 'relative', width: '60px', height: '60px', margin: '20px auto' }}>
    <style>{`
      .dot { position: absolute; width: 6px; height: 6px; background: #FFB1C1; border-radius: 50%; opacity: 0; animation: move 3s infinite; }
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
      @keyframes slideUpMiddle {
        0% { transform: translateY(100vh); opacity: 0; }
        60% { transform: translateY(-20px); opacity: 1; }
        100% { transform: translateY(0); opacity: 1; }
      }
      .success-popup {
        animation: slideUpMiddle 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        background: linear-gradient(135deg, #FFB1C1 0%, #FF85A1 100%);
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
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogin = (u) => {
    setIsLoading(true);
    setTimeout(() => {
      setUsername(u);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 2000); 
  };

  if (!isLoggedIn) return <AuthScreen onLogin={handleLogin} isLoading={isLoading} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <header style={{ padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FFF0F3' }}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>🔍 🔔</div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'fun' && <GamesSection />}
        {activeTab === 'profile' && <ProfileView username={username} />}
      </div>

      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}

      <nav style={{ height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FFF0F3' }}>
        <button onClick={() => setActiveTab('home')} style={navBtnStyle(activeTab === 'home')}>🏠<div>Home</div></button>
        <button onClick={() => setActiveTab('chat')} style={navBtnStyle(activeTab === 'chat')}>💬<div>Chat</div></button>
        <button onClick={() => setShowCreatePost(true)} style={plusBtnStyle}>+</button>
        <button onClick={() => setActiveTab('fun')} style={navBtnStyle(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>
    </div>
  );
}

// --- Dynamic Profile Component with Aesthetic Success Block ---
function ProfileView({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("✨ Pastel vibes & sweet times ✨");
  const [pfp, setPfp] = useState("https://i.pinimg.com/736x/8f/c9/26/8fc926d017a0224d4554b4231b4b1a45.jpg");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
        <img src={pfp} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '5px solid #FFB1C1' }} alt="pfp" />
        {isEditing && (
          <button onClick={() => setPfp(prompt("Paste Image URL:"))} style={editPfpBtnStyle}>+</button>
        )}
      </div>

      <h2 style={{ color: '#333', marginBottom: '5px' }}>@{username}</h2>
      
      {isEditing ? (
        <textarea value={bio} onChange={e => setBio(e.target.value)} style={bioEditStyle} />
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '20px' }}>{bio}</p>
      )}

      <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} style={editBtnStyle}>
        {isEditing ? "✨ Save Bio ✨" : "Edit Profile"}
      </button>

      {showSuccess && (
        <div className="success-popup" style={successBlockStyle}>
          <div style={{fontSize: '30px'}}>🎉✨🥳</div>
          <h3 style={{margin: '10px 0'}}>Profile Updated!</h3>
          <p>Your aesthetic is now perfect.</p>
        </div>
      )}
    </div>
  );
}

// --- Create Post Modal ---
function CreatePostModal({ onClose }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{color: '#FF85A1'}}>Create New Post ✨</h3>
        <textarea placeholder="What's on your mind, girl?" style={postInputStyle} />
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => { alert("Post shared!"); onClose(); }} style={postBtnStyle}>Post 🎀</button>
        </div>
      </div>
    </div>
  );
}

// --- Chat Section ---
function ChatSection({ currentUser }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMsgs = async () => {
      const res = await fetch(`${BACKEND_URL}/messages/0`);
      if (res.ok) setMsgs(await res.json());
    };
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const m = { sender: currentUser, text: text, group_id: 0 };
    setMsgs([...msgs, m]);
    setText("");
    await fetch(`${BACKEND_URL}/send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(m)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '5px 0', display: 'flex', flexDirection: 'column' }}>
             <div style={{ 
               backgroundColor: m.sender === currentUser ? '#FFB1C1' : '#fff', 
               padding: '10px 15px', 
               borderRadius: '15px', 
               maxWidth: 'fit-content',
               boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
               alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start'
             }}>
               <small style={{display: 'block', fontSize: '10px', color: '#FF85A1'}}>{m.sender}</small>
               {m.text}
             </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '15px', background: '#fff', display: 'flex', gap: '10px' }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={chatInputStyle} placeholder="Message..." />
        <button onClick={send} style={sendBtnStyle}>🚀</button>
      </div>
    </div>
  );
}

// --- Helper Components ---
function AuthScreen({ onLogin, isLoading }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent:
