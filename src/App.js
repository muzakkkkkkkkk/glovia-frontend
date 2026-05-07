import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [viewedProfile, setViewedProfile] = useState(null); // Stores searched user data

  if (!isLoggedIn) return <AuthScreen onLogin={(u) => { setUsername(u); setIsLoggedIn(true); }} />;

  return (
    <div style={{ backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER & SEARCH */}
      <header style={{ padding: '15px', backgroundColor: '#fff', display: 'flex', gap: '10px' }}>
        <h2 style={{ color: '#FF85A1', margin: 0 }}>Glovia 💕</h2>
        <input 
          placeholder="Search username + Enter 🔍"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const res = await fetch(`${BACKEND_URL}/search_user?username=${e.target.value}&viewer=${username}`);
              const data = await res.json();
              if (res.ok) { setViewedProfile(data); setActiveTab('profile'); }
              else alert("User not found!");
            }
          }}
          style={{ flex: 1, padding: '8px 15px', borderRadius: '20px', border: '1px solid #FEE2E9' }}
        />
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'profile' && <ProfileView user={viewedProfile || {username}} isOwn={!viewedProfile} />}
      </div>

      {/* BOTTOM NAV BAR */}
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

  const groups = [
    { name: "Study Besties 📖", members: "25 members", color: "#B19CD9" },
    { name: "Outfit Inspo 👗", members: "42 members", color: "#FFB1C1" },
    { name: "Late Night Talks 🌙", members: "36 members", color: "#9575CD" }
  ];

  // Fetch messages (Global = groupId 0)
  useEffect(() => {
    const fetchMsgs = () => {
      fetch(`${BACKEND_URL}/messages/${activeTab === 'global' ? 0 : 1}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await fetch(`${BACKEND_URL}/send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: currentUser, text, group_id: activeTab === 'global' ? 0 : 1 })
    });
    setText("");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
        <button onClick={() => setActiveTab('global')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'global' ? '#FF85A1' : '#fff', color: activeTab === 'global' ? '#fff' : '#FF85A1' }}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveTab('groups')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'groups' ? '#FF85A1' : '#fff', color: activeTab === 'groups' ? '#fff' : '#FF85A1' }}>My Groups 👥</button>
      </div>

      {activeTab === 'global' ? (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
                <span style={{ fontSize: '10px', color: '#FF85A1' }}>{m.sender}</span>
                <div style={{ backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff', color: m.sender === currentUser ? '#fff' : '#333', padding: '10px', borderRadius: '15px', maxWidth: '80%' }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Type something cute..." style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #FEE2E9' }} />
            <button onClick={handleSend} style={{ background: '#FF85A1', border: 'none', borderRadius: '50%', width: '40px', color: '#fff' }}>🚀</button>
          </div>
        </>
      ) : (
        <div style={{ padding: '15px' }}>
          {groups.map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: g.color }}></div>
              <div style={{ flex: 1 }}><b>{g.name}</b><br/><span style={{ fontSize: '12px', color: '#888' }}>{g.members}</span></div>
              <span>❯</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ user, isOwn }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#FFB1C1', margin: '0 auto' }}></div>
      <h2>@{user.username}</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isOwn && <button style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: user.is_following ? '#FEE2E9' : '#FF85A1', color: user.is_following ? '#FF85A1' : '#fff' }}>{user.is_following ? 'Following' : 'Follow'}</button>}
        <button style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #FF85A1', color: '#FF85A1', background: 'none' }}>Message</button>
      </div>
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
        {/* Post Grid Placeholder */}
        {[1, 2, 3].map(i => <div key={i} style={{ aspectRatio: '1/1', backgroundColor: '#eee' }}></div>)}
      </div>
    </div>
  );
}

// ... AuthScreen and HomeFeed placeholders as previously defined
