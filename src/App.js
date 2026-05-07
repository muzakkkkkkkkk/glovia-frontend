import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // Default to chat to test
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [viewedProfile, setViewedProfile] = useState(null);

  if (!isLoggedIn) return <AuthScreen onLogin={(u) => { setUsername(u); setIsLoggedIn(true); }} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '15px', backgroundColor: '#fff', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <input 
          placeholder="Search username + Enter 🔍"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              try {
                const res = await fetch(`${BACKEND_URL}/search_user?username=${e.target.value}&viewer=${username}`);
                const data = await res.json();
                if (res.ok) { setViewedProfile(data); setActiveTab('profile'); }
                else alert("User not found!");
              } catch (err) { alert("Search error."); }
            }
          }}
          style={{ flex: 1, padding: '8px 15px', borderRadius: '20px', border: '1px solid #FEE2E9' }}
        />
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'profile' && <ProfileView user={viewedProfile || {username}} isOwn={!viewedProfile} currentUser={username} onProfileChange={setViewedProfile} />}
      </div>

      <nav style={{ position: 'fixed', bottom: 0, width: '100%', height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FEE2E9' }}>
        <button onClick={() => {setActiveTab('home'); setViewedProfile(null);}} style={{ background: 'none', border: 'none', fontSize: '24px' }}>🏠</button>
        <button onClick={() => setActiveTab('chat')} style={{ background: 'none', border: 'none', fontSize: '24px' }}>💬</button>
        <button style={{ backgroundColor: '#FF85A1', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', border: 'none', fontSize: '24px' }}>+</button>
        <button onClick={() => setActiveTab('fun')} style={{ background: 'none', border: 'none', fontSize: '24px' }}>🎮</button>
        <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', fontSize: '24px' }}>👤</button>
      </nav>
    </div>
  );
}

function ChatSection({ currentUser }) {
  const [activeTab, setActiveTab] = useState('global');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // FETCH MESSAGES EVERY 2 SECONDS
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/${activeTab === 'global' ? 0 : 1}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) { console.error("Sync error"); }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 2000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // SCROLL TO BOTTOM WHEN NEW MSG ARRIVES
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msgData = { sender: currentUser, text: text, group_id: activeTab === 'global' ? 0 : 1 };
    
    // OPTIMISTIC UPDATE: Show msg immediately
    setMessages([...messages, msgData]);
    const currentText = text;
    setText(""); 

    try {
      await fetch(`${BACKEND_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) { 
      alert("Failed to send"); 
      setText(currentText); // Restore text if failed
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
        <button onClick={() => setActiveTab('global')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'global' ? '#FF85A1' : '#fff', color: activeTab === 'global' ? '#fff' : '#FF85A1', fontWeight: 'bold' }}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveTab('groups')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'groups' ? '#FF85A1' : '#fff', color: activeTab === 'groups' ? '#fff' : '#FF85A1', fontWeight: 'bold' }}>My Groups 👥</button>
      </div>

      {activeTab === 'global' ? (
        <>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '5px 0', maxWidth: '80%' }}>
                <span style={{ fontSize: '10px', color: '#FF85A1', marginLeft: '5px' }}>{m.sender}</span>
                <div style={{ backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff', color: m.sender === currentUser ? '#fff' : '#333', padding: '12px', borderRadius: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
            <input 
              value={text} 
              onChange={e => setText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type something cute..." 
              style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' }} 
            />
            <button onClick={handleSend} style={{ background: '#FF85A1', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🚀</button>
          </div>
        </>
      ) : (
        <div style={{ padding: '15px' }}>
          {[
            { name: "Study Besties 📖", members: "25", color: "#B19CD9" },
            { name: "Outfit Inspo 👗", members: "42", color: "#FFB1C1" },
            { name: "Late Night Talks 🌙", members: "36", color: "#9575CD" }
          ].map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: g.color }}></div>
              <div style={{ flex: 1 }}><b>{g.name}</b><br/><span style={{ fontSize: '12px', color: '#888' }}>{g.members} members</span></div>
              <span style={{ color: '#FF85A1' }}>❯</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthScreen({ onLogin })
