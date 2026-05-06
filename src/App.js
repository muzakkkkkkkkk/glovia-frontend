import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF5F7', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' },
  header: { padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #FEE2E9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  feedGrid: { flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' },
  postCard: { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' },
  postImg: { width: '100%', aspectRatio: '1/1', objectFit: 'cover' },
  postInfo: { padding: '8px' },
  navBar: { height: '60px', backgroundColor: '#fff', borderTop: '1px solid #FEE2E9', display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  navBtn: { fontSize: '20px', cursor: 'pointer', background: 'none', border: 'none' },
  plusBtn: { backgroundColor: '#FF85A1', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: 'none' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [feed, setFeed] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ imageUrl: '', caption: '' });

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/feed`);
      const data = await res.json();
      setFeed(data);
    } catch (err) { console.error("Feed error:", err); }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === 'home') {
      fetchFeed();
    }
  }, [isLoggedIn, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) setIsLoggedIn(true);
      else alert("Login failed! ✨");
    } catch (err) { alert("Server connection error"); }
  };

  const handleUpload = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/create_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          image_url: newPost.imageUrl,
          caption: newPost.caption
        })
      });
      if (res.ok) {
        setShowUpload(false);
        setNewPost({ imageUrl: '', caption: '' });
        fetchFeed();
      }
    } catch (err) { alert("Upload failed"); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF5F7' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '280px', textAlign: 'center' }}>
          <h2 style={{ color: '#D63384' }}>Glovia 💕</h2>
          <input style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button style={{ background: '#FF85A1', color: '#fff', border: 'none', padding: '10px', width: '100%', borderRadius: '10px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={{ color: '#D63384', fontWeight: 'bold', fontSize: '20px' }}>Glovia 💕</span>
        <div>🔍 🔔</div>
      </header>

      {activeTab === 'home' && (
        <div style={styles.feedGrid}>
          {feed.length > 0 ? feed.map((post, i) => (
            <div key={i} style={styles.postCard}>
              <img src={post.image_url} alt="post" style={styles.postImg} />
              <div style={styles.postInfo}>
                <p style={{ fontSize: '12px', margin: 0, fontWeight: 'bold' }}>{post.username}</p>
                <p style={{ fontSize: '10px', color: '#777', margin: 0 }}>{post.caption}</p>
              </div>
            </div>
          )) : <p style={{ gridColumn: 'span 2', textAlign: 'center', color: '#999', marginTop: '20px' }}>No posts yet. Be the first! ✨</p>}
        </div>
      )}

      {activeTab === 'chat' && (
        <div style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#D63384' }}>Chatting as <strong>{username}</strong>...</p>
        </div>
      )}

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,245,247,0.98)', zIndex: 1000, padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '30px', boxShadow: '0 15px 35px rgba(214, 51, 132, 0.1)' }}>
            <h2 style={{ color: '#D63384', textAlign: 'center', marginBottom: '20px' }}>New Post ✨</h2>
            <input style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', outline: 'none' }} placeholder="Paste Image URL..." value={newPost.imageUrl} onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} />
            <textarea style={{ width: '100%', padding: '12px', height: '100px', marginBottom: '20px', borderRadius: '15px', border: '1px solid #FEE2E9', outline: 'none', resize: 'none' }} placeholder="Write a cute caption..." value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} />
            <button onClick={handleUpload} style={{ width: '100%', backgroundColor: '#FF85A1', color: '#fff', border: 'none', padding: '14px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Share to Glovia 💕</button>
            <p onClick={() => setShowUpload(false)} style={{ textAlign: 'center', color: '#999', marginTop: '15px', cursor: 'pointer', fontSize: '14px' }}>Cancel</p>
          </div>
        </div>
      )}

      <nav style={styles.navBar}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>🏠</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('chat')}>💬</button>
        <button style={styles.plusBtn} onClick={() => setShowUpload(true)}>+</button>
        <button style={styles.navBtn}>🎮</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>👤</button>
      </nav>
    </div>
  );
}

export default App;
