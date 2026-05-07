import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

function App() {
  const [activeTab, setActiveTab] = useState('home');
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
              } catch (err) { alert("Server error. Try again later."); }
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

  const groups = [
    { name: "Study Besties 📖", members: "25 members", color: "#B19CD9" },
    { name: "Outfit Inspo 👗", members: "42 members", color: "#FFB1C1" },
    { name: "Late Night Talks 🌙", members: "36 members", color: "#9575CD" }
  ];

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/messages/${activeTab === 'global' ? 0 : 1}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) { console.error("Chat sync error"); }
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
        <button onClick={() => setActiveTab('global')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'global' ? '#FF85A1' : '#fff', color: activeTab === 'global' ? '#fff' : '#FF85A1', fontWeight: 'bold' }}>All Girls Chat 🌸</button>
        <button onClick={() => setActiveTab('groups')} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: activeTab === 'groups' ? '#FF85A1' : '#fff', color: activeTab === 'groups' ? '#fff' : '#FF85A1', fontWeight: 'bold' }}>My Groups 👥</button>
      </div>

      {activeTab === 'global' ? (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === currentUser ? 'flex-end' : 'flex-start', margin: '5px 0', maxWidth: '80%' }}>
                <span style={{ fontSize: '10px', color: '#FF85A1', marginLeft: '5px' }}>{m.sender}</span>
                <div style={{ backgroundColor: m.sender === currentUser ? '#FF85A1' : '#fff', color: m.sender === currentUser ? '#fff' : '#333', padding: '10px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '15px', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Type something cute..." style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #FEE2E9' }} />
            <button onClick={handleSend} style={{ background: '#FF85A1', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff' }}>🚀</button>
          </div>
        </>
      ) : (
        <div style={{ padding: '15px' }}>
          {groups.map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: g.color }}></div>
              <div style={{ flex: 1 }}><b>{g.name}</b><br/><span style={{ fontSize: '12px', color: '#888' }}>{g.members}</span></div>
              <span style={{ color: '#FF85A1' }}>❯</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ user, isOwn, currentUser, onProfileChange }) {
  const handleFollow = async () => {
    const res = await fetch(`${BACKEND_URL}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower: currentUser, followed: user.username })
    });
    if (res.ok) onProfileChange({ ...user, is_following: true });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#FFB1C1', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#fff' }}>{user.username[0].toUpperCase()}</div>
      <h2>@{user.username}</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isOwn && (
          <button onClick={handleFollow} style={{ padding: '10px 25px', borderRadius: '20px', border: 'none', backgroundColor: user.is_following ? '#FEE2E9' : '#FF85A1', color: user.is_following ? '#FF85A1' : '#fff', fontWeight: 'bold' }}>
            {user.is_following ? 'Following' : 'Follow'}
          </button>
        )}
        <button style={{ padding: '10px 25px', borderRadius: '20px', border: '1px solid #FF85A1', color: '#FF85A1', background: 'none', fontWeight: 'bold' }}>Message</button>
      </div>
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ aspectRatio: '1/1', backgroundColor: '#FEE2E9', borderRadius: '5px' }}></div>)}
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E9' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '80%', maxWidth: '400px' }}>
        <h2 style={{ color: '#FF85A1' }}>Glovia 💕</h2>
        <input value={u} onChange={e => setU(e.target.value)} placeholder="Username" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '15px', border: '1px solid #FEE2E9' }} />
        <button onClick={() => onLogin(u)} style={{ width: '100%', padding: '12px', borderRadius: '15px', border: 'none', backgroundColor: '#FF85A1', color: '#fff', fontWeight: 'bold' }}>Login</button>
      </div>
    </div>
  );
}

function HomeFeed() {
  return <div style={{ padding: '20px', textAlign: 'center', color: '#FF85A1' }}><h3>Welcome to your Feed 🎀</h3></div>;
}

export default App; // THIS LINE FIXES THE BUILD ERROR
