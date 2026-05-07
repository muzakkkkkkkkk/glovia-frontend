import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' },
  header: { padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(255, 133, 161, 0.1)' },
  navBar: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '65px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '35px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(214, 51, 132, 0.15)', zIndex: 100 },
  navBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', transition: 'transform 0.1s' },
  activeBtn: { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 5px #FF85A1)' },
  searchBar: { padding: '10px 20px', backgroundColor: '#fff' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '20px', border: '1px solid #FEE2E9', backgroundColor: '#FFF9FB', outline: 'none' },
  postCard: { backgroundColor: '#fff', borderRadius: '20px', margin: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  if (!isLoggedIn) return <AuthScreen onLogin={(user) => { setUsername(user); setIsLoggedIn(true); }} />;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={{ color: '#FF85A1', fontWeight: 'bold', fontSize: '24px' }}>Glovia 💕</span>
        <div style={{ position: 'relative' }}>
          <span onClick={() => setShowNotif(!showNotif)} style={{ cursor: 'pointer', fontSize: '20px' }}>🔔</span>
          {showNotif && (
            <div style={{ position: 'absolute', right: 0, top: '30px', width: '200px', backgroundColor: '#fff', borderRadius: '15px', padding: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', zIndex: 200 }}>
              <p style={{ fontSize: '12px', color: '#FF85A1', fontWeight: 'bold' }}>Recent Messages 💌</p>
              <p style={{ fontSize: '11px', color: '#999' }}>No new alerts.</p>
            </div>
          )}
        </div>
      </header>

      <div style={styles.searchBar}>
        <input 
          style={styles.searchInput} 
          placeholder="🔍 Search unique usernames..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        {activeTab === 'home' && <HomeFeed searchQuery={searchQuery} />}
        {activeTab === 'chat' && <ChatSection currentUser={username} />}
        {activeTab === 'fun' && <GameZone />}
        {activeTab === 'profile' && <ProfileView username={username} />}
      </div>

      <nav style={styles.navBar}>
        <button onClick={() => setActiveTab('home')} style={{...styles.navBtn, ...(activeTab==='home' ? styles.activeBtn : {})}}>🏠</button>
        <button onClick={() => setActiveTab('chat')} style={{...styles.navBtn, ...(activeTab==='chat' ? styles.activeBtn : {})}}>💬</button>
        <button style={{ backgroundColor: '#FF85A1', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', border: 'none', fontSize: '25px', transform: 'translateY(-10px)' }}>+</button>
        <button onClick={() => setActiveTab('fun')} style={{...styles.navBtn, ...(activeTab==='fun' ? styles.activeBtn : {})}}>🎮</button>
        <button onClick={() => setActiveTab('profile')} style={{...styles.navBtn, ...(activeTab==='profile' ? styles.activeBtn : {})}}>👤</button>
      </nav>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HomeFeed({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_URL}/feed`).then(res => res.json()).then(data => setPosts(data));
  }, []);

  const filteredPosts = posts.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '5px' }}>
      {filteredPosts.map((post, i) => (
        <div key={i} style={styles.postCard}>
          <img src={post.image_url} alt="post" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
          <div style={{ padding: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{post.username} <span style={{ float: 'right' }}>❤️</span></p>
            <p style={{ fontSize: '10px', color: '#777', margin: 0 }}>{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatSection({ currentUser }) {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#FF85A1' }}>1-on-1 Messages 💌</h3>
      <div style={{ background: '#fff', borderRadius: '20px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
        Search a user to start chatting!
      </div>
    </div>
  );
}

function GameZone() {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#FF85A1' }}>Fun Zone 🎮</h3>
      {['Truth or Dare', 'Never Have I Ever', 'Rage Bait'].map(game => (
        <div key={game} style={{ background: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{game}</span>
          <button style={{ backgroundColor: '#FF85A1', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '10px' }}>Challenge</button>
        </div>
      ))}
    </div>
  );
}

function ProfileView({ username }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#FFB1C1', margin: '0 auto 15px' }}></div>
      <h2 style={{ color: '#FF85A1' }}>@{username}</h2>
      <p style={{ color: '#888' }}>Pink lover & Aesthetic seeker ✨</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div><b>24</b><br/><span style={{fontSize:'12px'}}>Posts</span></div>
        <div><b>128</b><br/><span style={{fontSize:'12px'}}>Followers</span></div>
      </div>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [u, setU] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF9FB' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '30px', width: '280px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#FF85A1' }}>Glovia 💕</h2>
        <input style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '15px', border: '1px solid #FEE2E9' }} placeholder="Username" onChange={e => setU(e.target.value)} />
        <button onClick={() => onLogin(u)} style={{ width: '100%', padding: '12px', backgroundColor: '#FF85A1', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}>Enter Glovia</button>
      </div>
    </div>
  );
}

export default App;
