import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [viewedProfile, setViewedProfile] = useState(null);

  if (!isLoggedIn) {
    return <AuthScreen onLogin={(u) => { setUsername(u); setIsLoggedIn(true); }} />;
  }

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* GLOBAL SEARCH HEADER */}
      <header style={{ padding: '15px', backgroundColor: '#fff', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #FEE2E9' }}>
        <h2 style={{ color: '#FF85A1', margin: 0, cursor: 'pointer' }} onClick={() => setActiveTab('home')}>Glovia 💕</h2>
        <input 
          placeholder="Search username + Enter 🔍"
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              try {
                const res = await fetch(`${BACKEND_URL}/search_user?username=${e.target.value}&viewer=${username}`);
                const data = await res.json();
                if (res.ok) { 
                  setViewedProfile(data); 
                  setActiveTab('profile'); 
                } else {
                  alert("User not found!");
                }
              } catch (err) { alert("Search failed. Check backend."); }
            }
          }}
          style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #FEE2E9', outline: 'none' }}
        />
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'profile' && (
          <ProfileView 
            user={viewedProfile || {username}} 
            isOwn={!viewedProfile || viewedProfile.username === username} 
            currentUser={username} 
            onProfileChange={setViewedProfile} 
          />
        )}
      </div>

      {/* NAVIGATION BAR */}
      <nav style={{ height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #FEE2E9' }}>
        <button onClick={() => {setActiveTab('home'); setViewedProfile(null);}} style={navBtnStyle}>🏠</button>
        <button onClick={() => setActiveTab('chat')} style={navBtnStyle}>💬</button>
        <button style={{ backgroundColor: '#FF85A1', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', border: 'none', fontSize: '24px', boxShadow: '0 4px 10px rgba(255, 133, 161, 0.4)' }}>+</button>
        <button onClick={() => setActiveTab('fun')} style={navBtnStyle}>🎮</button>
        <button onClick={() => {setViewedProfile(null); setActiveTab('profile');}} style={navBtnStyle}>👤</button>
      </nav>
    </div>
  );
}

const navBtnStyle = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };

function ChatSection({ currentUser }) {
  const [activeTab, setActiveTab] = useState('global');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/${activeTab === 'global' ? 0 : 1}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) { console.error("Sync error"); }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msgData = { sender: currentUser, text: text, group_id: activeTab === 'global' ? 0 : 1 };
    
    // Optimistic Update
    const tempMessages = [...messages, msgData];
    setMessages(tempMessages);
    setText("");

    try {
      await fetch(`${BACKEND_URL}/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) { alert("Failed to send"); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', padding: '15px', gap: '10px', backgroundColor: '#fff' }}>
        <button onClick={() => setActiveTab('global')} style={tabStyle(activeTab === 'global')}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveTab('groups')} style={tabStyle(activeTab === 'groups')}>My Groups 👥</button>
      </div>

      {activeTab === 'global' ? (
        <>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '8px 0', maxWidth: '75%' }}>
                <span style={{ fontSize: '11px', color: '#FF85A1', marginLeft: '5px', fontWeight: '600' }}>{m.sender}</span>
                <div style={{ 
                  backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff', 
                  color: m.sender === currentUser ? '#fff' : '#444', 
                  padding: '12px 16px', 
                  borderRadius: '20px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  fontSize: '14px' 
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px', backgroundColor: '#fff', borderTop: '1px solid #FEE2E9' }}>
            <input 
              value={text} 
              onChange={e => setText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type something cute..." 
              style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' }} 
            />
            <button onClick={handleSend} style={{ background: '#FF85A1', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: '#fff', cursor: 'pointer' }}>🚀</button>
          </div>
        </>
      ) : (
        <div style={{ padding: '15px' }}>
          {[
            { name: "Study Besties 📖", members: "25", color: "#B19CD9" },
            { name: "Outfit Inspo 👗", members: "42", color: "#FFB1C1" },
            { name: "Late Night Talks 🌙", members: "36", color: "#9575CD" }
          ].map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', marginBottom: '12px', boxShadow: '0 3px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '14px', backgroundColor: g.color }}></div>
              <div style={{ flex: 1 }}>
                <b style={{ color: '#333' }}>{g.name}</b><br/>
                <span style={{ fontSize: '13px', color: '#999' }}>{g.members} active members</span>
              </div>
              <span style={{ color: '#FF85A1', fontSize: '18px' }}>❯</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const tabStyle = (active) => ({
  flex: 1, padding: '12px', borderRadius: '25px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
  backgroundColor: active ? '#FF85A1' : '#FEE2E9', color: active ? '#fff' : '#FF85A1', transition: '0.3s'
});

function ProfileView({ user, isOwn, currentUser, onProfileChange }) {
  const handleFollow = async () => {
    try {
      await fetch(`${BACKEND_URL}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower: currentUser, followed: user.username })
      });
      onProfileChange({ ...user, is_following: true });
    } catch (err) { alert("Follow failed"); }
  };

  return (
    <div style={{ textAlign: 'center', padding: '30px 20px' }}>
      <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#FFB1C1', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px', color: '#fff', border: '4px solid #fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        {user.username[0].toUpperCase()}
      </div>
      <h2 style={{ margin: '0 0 20px', color: '#333' }}>@{user.username}</h2>
      
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '30px' }}>
        {!isOwn && (
          <button 
            onClick={handleFollow}
            style={{ padding: '12px 30px', borderRadius: '25px', border: 'none', backgroundColor: user.is_following ? '#E0E0E0' : '#FF85A1', color: user.is_following ? '#666' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {user.is_following ? 'Following' : 'Follow'}
          </button>
        )}
        <button style={{ padding: '12px 30px', borderRadius: '25px', border: '2px solid #FF85A1', color: '#FF85A1', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          Message
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ aspectRatio: '1/1', backgroundColor: '#FEE2E9', borderRadius: '10px' }}></div>)}
      </div>
    </div>
  );
}

function HomeFeed() { return <div style={{ padding: '40px', textAlign: 'center', color: '#FF85A1' }}><h3>✨ Home Feed ✨</h3><p>Coming soon!</p></div>; }

function AuthScreen({ onLogin }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9FB' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '85%', maxWidth: '400px', boxShadow: '0 15px 35px rgba(255, 133, 161, 0.15)' }}>
        <h1 style={{ color: '#FF85A1', fontSize: '32px', marginBottom: '10px' }}>Glovia 💕</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Connect with your girl squad</p>
        <input 
          value={u} 
          onChange={e => setU(e.target.value)} 
          placeholder="Enter username" 
          style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '15px', border: '1px solid #FEE2E9', outline: 'none' }} 
        />
        <button 
          onClick={() => u.trim() && onLogin(u.trim())} 
          style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#FF85A1', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
        >
          Enter Glovia ✨
        </button>
      </div>
    </div>
  );
}

export default App; // IMPORTANT: Resolves default export error
