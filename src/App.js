import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [username, setUsername] = useState("User");

  return (
    <div style={containerStyle}>
      {/* Dynamic Header with Search and Notification */}
      <header style={headerStyle}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px', cursor: 'pointer' }}>
          <span onClick={() => alert("Searching...")}>🔍</span>
          <span onClick={() => alert("No new notifications")}>🔔</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'profile' && <ProfileView username={username} />}
        {activeTab === 'home' && <div style={placeholderStyle}>Feed coming soon! ✨</div>}
        {activeTab === 'fun' && <div style={placeholderStyle}>Games coming soon! 🎮</div>}
      </main>

      {/* Functional Create Post Modal */}
      {showCreatePost && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>New Post ✨</h3>
            <textarea placeholder="Share something cute..." style={postInput} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCreatePost(false)} style={cancelBtn}>Cancel</button>
              <button onClick={() => { alert("Posted!"); setShowCreatePost(false); }} style={postBtn}>Post 🎀</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar with Middle Plus Button */}
      <nav style={navStyle}>
        <button className="ripple" onClick={() => setActiveTab('home')} style={navBtnStyle(activeTab === 'home')}>🏠<div>Home</div></button>
        <button className="ripple" onClick={() => setActiveTab('chat')} style={navBtnStyle(activeTab === 'chat')}>💬<div>Chat</div></button>
        
        {/* The Big Middle Plus Button */}
        <button className="ripple" onClick={() => setShowCreatePost(true)} style={bigPlusBtn}>+</button>
        
        <button className="ripple" onClick={() => setActiveTab('fun')} style={navBtnStyle(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button className="ripple" onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>

      <style>{`
        .ripple { position: relative; overflow: hidden; transition: background 0.4s; }
        .ripple:active { background-color: rgba(255, 182, 193, 0.3); transform: scale(0.95); }
        @keyframes slideUpMiddle {
          0% { transform: translate(-50%, 100vh); opacity: 0; }
          100% { transform: translate(-50%, -50%); opacity: 1; }
        }
        .celebration-block {
          animation: slideUpMiddle 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
          <div key={i} style={{ 
            textAlign: m.sender === currentUser ? 'right' : 'left',
            margin: '10px 0' 
          }}>
            <div style={{
              display: 'inline-block', // Fix: Width according to message text
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: m.sender === currentUser ? '#FFB6C1' : '#FFF',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              maxWidth: '80%'
            }}>
              <small style={{ display: 'block', color: '#FF85A1', fontSize: '10px' }}>{m.sender}</small>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#FFF' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} style={chatInput} placeholder="Type..." />
        <button onClick={sendMessage} style={sendBtn}>🚀</button>
      </div>
    </div>
  );
}

function ProfileView({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("✨ Living my sparkle life ✨");
  const [showCelebration, setShowCelebration] = useState(false);

  const saveProfile = () => {
    setIsEditing(false);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3500);
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={profileCircle}>👤</div>
      <h2>@{username}</h2>
      
      {isEditing ? (
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={bioEdit} />
      ) : (
        <p style={{ color: '#888' }}>{bio}</p>
      )}

      <button onClick={() => isEditing ? saveProfile() : setIsEditing(true)} style={editBtn}>
        {isEditing ? "Save Bio ✨" : "Edit Profile"}
      </button>

      {showCelebration && (
        <div className="celebration-block" style={celebrationOverlay}>
          <h1 style={{ fontSize: '40px', margin: 0 }}>🎉✨🥳</h1>
          <h3>Updated!</h3>
          <p>Looking aesthetic, girl!</p>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const containerStyle = { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column' };
const headerStyle = { padding: '15px 20px', background: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #FFE4E9' };
const navStyle = { height: '75px', background: '#FFF', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FFE4E9', position: 'relative' };
const bigPlusBtn = { width: '55px', height: '55px', borderRadius: '50%', background: '#FF85A1', color: '#FFF', border: 'none', fontSize: '30px', transform: 'translateY(-15px)', boxShadow: '0 5px 15px rgba(255,133,161,0.4)', cursor: 'pointer' };
const navBtnStyle = (active) => ({ background: 'none', border:
