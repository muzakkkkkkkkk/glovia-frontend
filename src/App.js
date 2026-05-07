import React, { useState, useEffect } from 'react';

const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { 
    backgroundColor: '#FFF9FB', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
    overflow: 'hidden' 
  },
  header: { 
    padding: '15px 20px', 
    backgroundColor: '#fff', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(255, 133, 161, 0.1)'
  },
  feedGrid: { 
    flex: 1, 
    overflowY: 'auto', 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '15px', 
    padding: '15px',
    paddingBottom: '80px' // Space for nav
  },
  postCard: { 
    backgroundColor: '#fff', 
    borderRadius: '20px', 
    overflow: 'hidden', 
    boxShadow: '0 8px 20px rgba(255, 133, 161, 0.12)',
    border: '1px solid #FFF0F3'
  },
  postImg: { 
    width: '100%', 
    aspectRatio: '0.85/1', 
    objectFit: 'cover' 
  },
  postInfo: { 
    padding: '10px',
    backgroundColor: '#fff'
  },
  navBar: { 
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: '20px',
    height: '65px', 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '35px',
    display: 'flex', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(214, 51, 132, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  navBtn: { 
    fontSize: '22px', 
    cursor: 'pointer', 
    background: 'none', 
    border: 'none',
    color: '#FF85A1'
  },
  plusBtn: { 
    backgroundColor: '#FF85A1', 
    color: '#fff', 
    width: '55px', 
    height: '55px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '28px', 
    border: 'none',
    boxShadow: '0 5px 15px rgba(255, 133, 161, 0.4)',
    transform: 'translateY(-10px)' // Makes it pop up like your image
  }
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
      if (!res.ok) throw new Error("Server response not ok");
      const data = await res.json();
      setFeed(data);
    } catch (err) { 
      console.error("Feed fetch error:", err);
    }
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
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        alert("Login failed! Please check your credentials. ✨");
      }
    } catch (err) { 
      alert("Still connecting to server... please wait 30 seconds and try again. 💕"); 
    }
  };

  const handleUpload = async () => {
    if (!newPost.imageUrl) return alert("Please provide an image URL! ✨");
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
    } catch (err) { alert("Upload failed. Try again! ✨"); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF5F7' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '30px', borderRadius: '20px', width: '280px', textAlign: 'center', boxShadow: '0 10px 25px rgba(214, 51, 132, 0.1)' }}>
          <h2 style={{ color: '#D63384' }}>Glovia 💕</h2>
          <input style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '10px', border: '1px solid #FEE2E9', outline: 'none' }} placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" style={{ width: '100%', margin: '10px 0', padding: '10px', borderRadius: '10px', border: '1px solid #FEE2E9', outline: 'none' }} placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button type="submit" style={{ background: '#FF85A1', color: '#fff', border: 'none', padding: '10px', width: '100%', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
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

      <div style={styles.feedGrid}>
        {activeTab === 'home' ? (
          feed.length > 0 ? feed.map((post, i) => (
            <div key={i} style={styles.postCard}>
              <img src={post.image_url} alt="post" style={styles.postImg} />
              <div style={styles.postInfo}>
                <p style={{ fontSize: '12px', margin: 0, fontWeight: 'bold' }}>{post.username}</p>
                <p style={{ fontSize: '10px', color: '#777', margin: 0 }}>{post.caption}</p>
              </div>
            </div>
          )) : <p style={{ gridColumn: 'span 2', textAlign: 'center', color: '#999', marginTop: '20px' }}>No posts yet. Be the first! ✨</p>
        ) : (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#D63384' }}>Chat and Games coming soon! 🎮</p>
          </div>
        )}
      </div>

      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,245,247,0.98)', zIndex: 1000, padding: '40px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
        <button style={styles.navBtn}>👤</button>
      </nav>
    </div>
  );
}

export default App;
