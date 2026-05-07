import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [username, setUsername] = useState("Angel");

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>🔍 🔔</div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'profile' && <ProfileView username={username} />}
        {activeTab === 'home' && <div style={placeholderStyle}>Feed coming soon! ✨</div>}
        {activeTab === 'fun' && <div style={placeholderStyle}>Games coming soon! 🎮</div>}
      </main>

      {/* --- Create Post Modal --- */}
      {showCreatePost && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ color: '#FF85A1' }}>Create Post ✨</h3>
            <textarea placeholder="Write something aesthetic..." style={postInput} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCreatePost(false)} style={cancelBtn}>Cancel</button>
              <button onClick={() => { alert("Posted! ✨"); setShowCreatePost(false); }} style={postBtn}>Post 🎀</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      <nav style={navStyle}>
        <button onClick={() => setActiveTab('home')} style={navBtnStyle(activeTab === 'home')}>🏠<div>Home</div></button>
        <button onClick={() => setActiveTab('chat')} style={navBtnStyle(activeTab === 'chat')}>💬<div>Chat</div></button>
        
        <button onClick={() => setShowCreatePost(true)} style={bigPlusBtn}>+</button>
        
        <button onClick={() => setActiveTab('fun')} style={navBtnStyle(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>

      <style>{`
        @keyframes slideUpMiddle {
          0% { transform: translate(-50%, 100vh); opacity: 0; }
          60% { transform: translate(-50%, -55%); opacity: 1; }
          100% { transform: translate(-50%, -50%); opacity: 1; }
        }
        .celebration-pop {
          animation: slideUpMiddle 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          background: linear-gradient(135deg, #FFB6C1 0%, #FF85A1 100%);
        }
      `}</style>
    </div>
  );
}

function ChatSection({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = { sender: currentUser, text: text, group_id: 0 };
    setMessages([...messages, msg]);
    setText("");
    await fetch(`${BACKEND_URL}/send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === currentUser ? 'right' : 'left', margin: '10px 0' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: m.sender === currentUser ? '#FFB6C1' : '#FFF',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              maxWidth: '80%',
              textAlign: 'left'
            }}>
              <small style={{ display: 'block', color: '#FF85A1', fontSize: '10px' }}>{m.sender}</small>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#FFF' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} style={chatInput} placeholder="Message..." />
        <button onClick={sendMessage} style={sendBtn}>🚀</button>
      </div>
    </div>
  );
}

function ProfileView({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("✨ Stay sparkling ✨");
  const [showCelebration, setShowCelebration] = useState(false);

  const saveProfile = () => {
    setIsEditing(false);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={profileCircle}>👤</div>
      <h2 style={{ color: '#333' }}>@{username}</h2>
      
      {isEditing ? (
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={bioEdit} />
      ) : (
        <p style={{ color: '#888', marginBottom: '20px' }}>{bio}</p>
      )}

      <button onClick={() => isEditing ? saveProfile() : setIsEditing(true)} style={editBtn}>
        {isEditing ? "Save Profile ✨" : "Edit Bio"}
      </button>

      {showCelebration && (
        <div className="celebration-pop" style={celebrationOverlay}>
          <div style={{ fontSize: '40px' }}>🎉✨🥳</div>
          <h3 style={{ margin: '10px 0' }}>Updated!</h3>
          <p style={{ fontSize: '14px' }}>Your profile looks amazing, girl! ✨</p>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const containerStyle = { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' };
const headerStyle = { padding: '15px 20px', background: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FFE4E9' };
const navStyle = { height: '75px', background: '#FFF', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FFE4E9' };
const bigPlusBtn = { width: '55px', height: '55px', borderRadius: '50%', background: '#FF85A1', color: '#FFF', border: 'none', fontSize: '30px', transform: 'translateY(-15px)', boxShadow: '0 5px 15px rgba(255,133,161,0.4)', cursor: 'pointer' };
const navBtnStyle = (active) => ({ background: 'none', border: 'none', color: active ? '#FF85A1' : '#CCC', cursor: 'pointer', fontSize: '11px', textAlign: 'center' });
const celebrationOverlay = { position: 'fixed', top: '50%', left: '50%', color: '#FFF', padding: '30px', borderRadius: '30px', textAlign: 'center', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', width: '75%' };
const profileCircle = { width: '100px', height: '100px', borderRadius: '50%', background: '#FFE4E9', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '3px solid #FF85A1' };
const editBtn = { padding: '10px 25px', borderRadius: '20px', border: 'none', background: '#FF85A1', color: '#FFF', fontWeight: 'bold' };
const bioEdit = { width: '100%', padding: '10px', borderRadius: '15px', border: '1px solid #FFB6C1', marginBottom: '15px', height: '80px', outline: 'none' };
const chatInput = { flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #FFE4E9', outline: 'none' };
const sendBtn = { background: '#FF85A1', color: '#FFF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalContent = { background: '#FFF', padding: '25px', borderRadius: '25px', width: '85%', textAlign: 'center' };
const postInput = { width: '100%', height: '120px', borderRadius: '15px', border: '1px solid #FFE4E9', padding: '15px', marginBottom: '15px', outline: 'none' };
const postBtn = { flex: 1, padding: '12px', borderRadius: '15px', border: 'none', background: '#FF85A1', color: '#FFF', fontWeight: 'bold' };
const cancelBtn = { flex: 1, padding: '12px', borderRadius: '15px', border: 'none', background: '#FFE4E9', color: '#FF85A1' };
const placeholderStyle = { padding: '50px', textAlign: 'center', color: '#FF85A1', fontSize: '18px' };

export default App;
