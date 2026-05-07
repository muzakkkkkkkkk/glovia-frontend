import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' },
  header: { padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(255, 133, 161, 0.1)' },
  searchBar: { padding: '10px 20px', backgroundColor: '#fff' },
  searchInput: { width: '100%', padding: '10px', borderRadius: '20px', border: '1px solid #FEE2E9', backgroundColor: '#FFF9FB', outline: 'none' },
  navBar: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '65px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '35px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(214, 51, 132, 0.15)', zIndex: 100 },
  // Adding the clicking effect style
  navBtn: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', transition: 'transform 0.1s', ':active': { transform: 'scale(0.8)' } },
  notificationPanel: { position: 'fixed', top: '70px', right: '20px', width: '250px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '15px', zIndex: 1000 }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // UI for the Search & Navigation
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={{ color: '#FF85A1', fontWeight: 'bold', fontSize: '24px' }}>Glovia 💕</span>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: 'pointer' }}>🔔</span>
        </div>
      </header>

      {/* SEARCH SECTION */}
      <div style={styles.searchBar}>
        <input 
          style={styles.searchInput} 
          placeholder="🔍 Search unique usernames..." 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* NOTIFICATION PANEL */}
      {showNotifications && (
        <div style={styles.notificationPanel}>
          <h4 style={{ color: '#FF85A1', margin: '0 0 10px 0' }}>Messages 💌</h4>
          <p style={{ fontSize: '12px', color: '#888' }}>No new messages yet!</p>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatRoom currentUser={username} />}
        {activeTab === 'fun' && <GameZone />}
        {activeTab === 'profile' && <ProfileView user={username} />}
      </div>

      {/* FLOATING NAV WITH CLICK EFFECTS */}
      <nav style={styles.navBar}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>🏠</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('chat')}>💬</button>
        <button style={{ ...styles.navBtn, backgroundColor: '#FF85A1', borderRadius: '50%', color: '#fff', width: '50px', height: '50px' }}>+</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('fun')}>🎮</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>👤</button>
      </nav>
    </div>
  );
}

// 2. CHAT COMPONENT (One-on-One)
function ChatRoom({ currentUser }) {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#FF85A1' }}>Personal Messages</h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '15px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ color: '#ccc' }}>Select a friend to start a one-on-one pink chat! ✨</p>
      </div>
    </div>
  );
}

// 3. GAME ZONE COMPONENT
function GameZone() {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#FF85A1' }}>Game Zone 🎮</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ background: '#FFEBF0', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
          <h4>Truth or Dare 😈</h4>
          <button style={{ background: '#FF85A1', color: '#fff', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>Challenge a Friend</button>
        </div>
        <div style={{ background: '#EBF4FF', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
          <h4>Puzzle Solve 🧩</h4>
          <button style={{ background: '#85A1FF', color: '#fff', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>Play Now</button>
        </div>
      </div>
    </div>
  );
}

export default App;
