import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', Roboto, sans-serif", overflow: 'hidden' },
  header: { padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(255, 133, 161, 0.1)' },
  feedGrid: { flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px', paddingBottom: '100px' },
  postCard: { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(255, 133, 161, 0.12)', border: '1px solid #FFF0F3' },
  navBar: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '65px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '35px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(214, 51, 132, 0.15)', backdropFilter: 'blur(10px)', zIndex: 10 },
  plusBtn: { backgroundColor: '#FF85A1', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: 'none', boxShadow: '0 5px 15px rgba(255, 133, 161, 0.4)', transform: 'translateY(-15px)' },
  authCard: { background: '#fff', padding: '40px 30px', borderRadius: '30px', width: '300px', textAlign: 'center', boxShadow: '0 20px 40px rgba(255, 133, 161, 0.15)' },
  input: { width: '100%', margin: '8px 0', padding: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', outline: 'none', backgroundColor: '#FFF9FB', boxSizing: 'border-box' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('For you');
  const [feed, setFeed] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ imageUrl: '', caption: '' });

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/feed`);
      if (res.ok) setFeed(await res.json());
    } catch (err) { console.error("Feed error:", err); }
  };

  useEffect(() => { if (isLoggedIn) fetchFeed(); }, [isLoggedIn]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/register' : '/login';
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        if (isSignup) { alert("Welcome to Glovia! Please login now. ✨"); setIsSignup(false); } 
        else { setIsLoggedIn(true); }
      } else { alert("Error: Check credentials or if user exists 💕"); }
    } catch (err) { alert("Still connecting to server... wait 30 seconds for the backend to wake up! 🌸"); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF9FB' }}>
        <form onSubmit={handleAuth} style={styles.authCard}>
          <h2 style={{ color: '#FF85A1', marginBottom: '10px' }}>Glovia 💕</h2>
          <input style={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
          <input type="password" style={styles.input} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" style={{ ...styles.input, backgroundColor: '#FF85A1', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {isSignup ? "Create Account" : "Login"}
          </button>
          <p onClick={() => setIsSignup(!isSignup)} style={{ color: '#FF85A1', marginTop: '20px', cursor: 'pointer', fontSize: '13px' }}>
            {isSignup ? "Already have an account? Login" : "New here? Create account ✨"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={{ color: '#FF85A1', fontWeight: 'bold', fontSize: '24px' }}>Glovia 💕</span>
        <div style={{ fontSize: '20px' }}>🔍 🔔</div>
      </header>

      <div style={{ display: 'flex', gap: '20px', padding: '10px 20px', backgroundColor: '#fff', borderBottom: '1px solid #FFF0F3' }}>
        {['For you', 'Following', 'Outfits'].map(tab => (
          <span key={tab} onClick={() => setActiveTab(tab)} style={{ 
            fontSize: '14px', color: activeTab === tab ? '#FF85A1' : '#ccc', 
            fontWeight: activeTab === tab ? 'bold' : 'normal', borderBottom: activeTab === tab ? '2px solid #FF85A1' : 'none', paddingBottom: '5px' 
          }}>{tab}</span>
        ))}
      </div>

      <div style={styles.feedGrid}>
        {feed.map((post, i) => (
          <div key={i} style={styles.postCard}>
            <img src={post.image_url} alt="post" style={{ width: '100%', aspectRatio: '0.8/1', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{post.username}</p>
              <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{post.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <nav style={styles.navBar}>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>🏠</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>💬</button>
        <button style={styles.plusBtn} onClick={() => setShowUpload(true)}>+</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>🎮</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>👤</button>
      </nav>

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={styles.authCard}>
            <h3 style={{ color: '#FF85A1' }}>New Post 🌸</h3>
            <input style={styles.input} placeholder="Image URL" onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} />
            <input style={styles.input} placeholder="Caption" onChange={e => setNewPost({...newPost, caption: e.target.value})} />
            <button style={{ ...styles.input, backgroundColor: '#FF85A1', color: '#fff', border: 'none' }} onClick={async () => {
              await fetch(`${BACKEND_URL}/create_post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, image_url: newPost.imageUrl, caption: newPost.caption })
              });
              setShowUpload(false); fetchFeed();
            }}>Post</button>
            <p onClick={() => setShowUpload(false)} style={{ cursor: 'pointer', marginTop: '10px' }}>Cancel</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
