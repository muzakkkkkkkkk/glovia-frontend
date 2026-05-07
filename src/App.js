import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('chat'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  if (!isLoggedIn) return <AuthScreen onLogin={(u) => { setUsername(u); setIsLoggedIn(true); }} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #FEE2E9' }}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'home' && <div style={{padding: '20px'}}>Welcome Home, {username}! 🎀</div>}
      </div>

      <nav style={{ height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FEE2E9' }}>
        <button onClick={() => setActiveTab('home')} style={navBtn}>🏠</button>
        <button onClick={() => setActiveTab('chat')} style={navBtn}>💬</button>
        <button style={plusBtn}>+</button>
        <button style={navBtn}>🎮</button>
        <button style={navBtn}>👤</button>
      </nav>
    </div>
  );
}

function ChatSection({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // 1. FETCH MESSAGES AUTOMATICALLY EVERY 3 SECONDS
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/messages/0`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) { console.error("Could not sync messages"); }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. AUTO-SCROLL TO BOTTOM
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 3. SEND MESSAGE FUNCTION
  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessage = { sender: currentUser, text: text, group_id: 0 };
    
    // Optimistic Update: Show it immediately
    setMessages(prev => [...prev, newMessage]);
    setText("");

    try {
      await fetch(`${BACKEND_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
    } catch (err) { alert("Message failed to send to server."); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start',
            textAlign: m.sender === currentUser ? 'right' : 'left',
            margin: '10px 0'
          }}>
            <small style={{ color: '#FF85A1', display: 'block', marginBottom: '2px' }}>{m.sender}</small>
            <div style={{ 
              display: 'inline-block',
              backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff',
              color: m.sender === currentUser ? '#fff' : '#333',
              padding: '10px 15px',
              borderRadius: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '15px', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // ENTER TO SEND
          placeholder="Type something cute..." 
          style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' }}
        />
        <button onClick={handleSend} style={sendBtn}>🚀</button>
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [name, setName] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E9' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#FF85A1' }}>Welcome to Glovia 💕</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ padding: '10px', marginBottom: '10px', width: '100%' }} />
        <button onClick={() => name && onLogin(name)} style={{ background: '#FF85A1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px' }}>Login</button>
      </div>
    </div>
  );
}

const navBtn = { background: 'none', border: 'none', fontSize: '24px' };
const plusBtn = { backgroundColor: '#FF85A1', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', border: 'none', fontSize: '24px' };
const sendBtn = { background: '#FF85A1', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: '#fff' };

export default App;
