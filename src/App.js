import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Handler for login
  const handleLogin = (name) => {
    if (name.trim()) {
      setUsername(name);
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={containerStyle}>
      {/* Header */}
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
        {activeTab === 'home' && <div style={placeholderStyle}>Welcome Home, {username}! Feed coming soon! ✨</div>}
        {activeTab === 'fun' && <div style={placeholderStyle}>Games coming soon! 🎮</div>}
      </main>

      {/* Create Post Modal */}
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

      {/* Navigation Bar */}
      <nav style={navStyle}>
        <button className="ripple" onClick={() => setActiveTab('home')} style={navBtnStyle(activeTab === 'home')}>🏠<div>Home</div></button>
        <button className="ripple" onClick={() => setActiveTab('chat')} style={navBtnStyle(activeTab === 'chat')}>💬<div>Chat</div></button>
        
        <button className="ripple" onClick={() => setShowCreatePost(true)} style={bigPlusBtn}>+</button>
        
        <button className="ripple" onClick={() => setActiveTab('fun')} style={navBtnStyle(activeTab === 'fun')}>🎮<div>Fun</div></button>
        <button className="ripple" onClick={() => setActiveTab('profile')} style={navBtnStyle(activeTab === 'profile')}>👤<div>Profile</div></button>
      </nav>

      <style>{`
        .ripple { position: relative; overflow: hidden; transition: transform 0.2s; border: none; background: none; }
        .ripple:active { transform: scale(0.9); }
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

// --- Auth Screen Component ---
function AuthScreen({ onLogin }) {
  const [name, setName] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E9' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#FF85A1' }}>Welcome to Glovia 💕</h2>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && onLogin(name)}
          placeholder="Enter your name" 
          style={{ padding: '12px', borderRadius: '10px', border: '1px solid #FEE2E9', marginBottom: '15px', width: '200px', outline: 'none' }} 
        />
        <br/>
        <button onClick={() => onLogin(name)} style={{ background: '#FF85A1', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
      </div>
    </div>
  );
}

// --- Chat Section Component ---
function ChatSection({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = { sender: currentUser, text: text, group_id: 0 };
    setMessages(prev => [...prev, msg]);
    setText("");
    try {
      await fetch(`${BACKEND_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
    } catch (e) { console.error("Server error"); }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === currentUser ? 'right' : 'left', margin: '10px 0' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: m.sender === currentUser ? '#FFB6C1' : '#FFF',
              color: m.sender === currentUser ? '#fff' : '#333',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              maxWidth: '80%',
              textAlign: 'left'
            }}>
              <small style={{ display:
