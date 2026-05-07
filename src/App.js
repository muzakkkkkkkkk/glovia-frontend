import React, { useState, useEffect } from 'react';

// ENSURE THIS URL MATCHES YOUR RENDER BACKEND EXACTLY
const BACKEND_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF9FB', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' },
  authScreen: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#FFF9FB' },
  authCard: { background: '#fff', padding: '40px 30px', borderRadius: '30px', width: '300px', textAlign: 'center', boxShadow: '0 20px 40px rgba(255, 133, 161, 0.15)', border: '1px solid #FFF0F3' },
  input: { width: '100%', margin: '8px 0', padding: '15px', borderRadius: '15px', border: '1px solid #FEE2E9', outline: 'none', backgroundColor: '#FFF9FB', boxSizing: 'border-box' },
  primaryBtn: { background: 'linear-gradient(135deg, #FF85A1 0%, #FFB1C1 100%)', color: '#fff', border: 'none', padding: '14px', width: '100%', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 5px 15px rgba(255, 133, 161, 0.3)', marginTop: '10px' },
  navBar: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', height: '65px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '35px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(214, 51, 132, 0.15)', backdropFilter: 'blur(10px)' },
  plusBtn: { backgroundColor: '#FF85A1', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: 'none', boxShadow: '0 5px 15px rgba(255, 133, 161, 0.4)', transform: 'translateY(-10px)' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [feed, setFeed] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ imageUrl: '', caption: '' });

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/feed`);
      if (res.ok) {
        const data = await res.json();
        setFeed(data);
      }
    } catch (err) { console.error("Feed error:", err); }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === 'home') fetchFeed();
  }, [isLoggedIn, activeTab]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/register' : '/login';
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (isSignup) {
          alert("Account created! You can now login. ✨");
          setIsSignup(false);
        } else {
          setIsLoggedIn(true);
        }
      } else {
        alert(data.error || "Something went wrong! 💕");
      }
    } catch (err) {
      alert("Waking up the Glovia server... please try again in 30 seconds! 🌸");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.authScreen}>
        <form onSubmit={handleAuth} style={styles.authCard}>
          <h2 style={{ color: '#FF85A1', marginBottom: '10px' }}>Glovia 💕</h2>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>{isSignup ? "Create your account" : "Welcome back, gorgeous!"}</p>
          <input style={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
          <input type="password" style={styles.input} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit" style={styles.primaryBtn}>{isSignup ? "Create Account" : "Login"}</button>
          <p onClick={() => setIsSignup(!isSignup)} style={{ color: '#FF85A1', marginTop: '20px', cursor: 'pointer', fontSize: '13px' }}>
            {isSignup ? "Already have an account? Login" : "New here? Create an account ✨"}
          </p>
        </form>
      </div>
    );
  }

 return (
    <div style={styles.container}>
      {/* 1. TOP HEADER */}
      <header style={styles.header}>
        <span style={{ color: '#FF85A1', fontWeight: 'bold', fontSize: '24px', letterSpacing: '-1px' }}>Glovia 💕</span>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>🔍 🔔</div>
      </header>

      {/* 2. CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '20px', padding: '10px 20px', backgroundColor: '#fff' }}>
        {['For you', 'Following', 'Outfits', 'Aesthetic'].map((tab) => (
          <span key={tab} style={{ 
            fontSize: '14px', 
            fontWeight: activeTab === tab ? 'bold' : 'normal',
            color: activeTab === tab ? '#FF85A1' : '#ccc',
            borderBottom: activeTab === tab ? '2px solid #FF85A1' : 'none',
            paddingBottom: '5px',
            cursor: 'pointer'
          }} onClick={() => setActiveTab(tab)}>
            {tab}
          </span>
        ))}
      </div>

      {/* 3. SCROLLABLE FEED */}
      <div style={styles.feedGrid}>
        {feed.length > 0 ? feed.map((post, i) => (
          <div key={i} style={styles.postCard}>
            <div style={{ position: 'relative' }}>
              <img src={post.image_url} alt="post" style={styles.postImg} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#fff', fontSize: '18px' }}>🤍</div>
            </div>
            <div style={styles.postInfo}>
              <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{post.username}</p>
              <p style={{ fontSize: '11px', color: '#888', lineHeight: '1.2' }}>{post.caption}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#FF85A1' }}>
                <span>❤️ 244</span> <span>💬 12</span>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '50px', color: '#FFB1C1' }}>
            <p>Loading your aesthetic feed... ✨</p>
          </div>
        )}
      </div>

      {/* 4. FLOATING BOTTOM NAV */}
      <nav style={styles.navBar}>
        <button style={styles.navBtn} onClick={() => setActiveTab('home')}>🏠</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('chat')}>💬</button>
        <button style={styles.plusBtn} onClick={() => setShowUpload(true)}>+</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('fun')}>🎮</button>
        <button style={styles.navBtn} onClick={() => setActiveTab('profile')}>👤</button>
      </nav>

      {/* UPLOAD OVERLAY */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 1000, padding: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={styles.authCard}>
            <h2 style={{ color: '#FF85A1' }}>Create Post ✨</h2>
            <input style={styles.input} placeholder="Paste Image URL" value={newPost.imageUrl} onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} />
            <textarea style={{ ...styles.input, height: '80px' }} placeholder="Caption..." value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} />
            <button style={styles.primaryBtn} onClick={handleUpload}>Post Now 💕</button>
            <p onClick={() => setShowUpload(false)} style={{ marginTop: '15px', color: '#999', cursor: 'pointer' }}>Close</p>
          </div>
        </div>
      )}
    </div>
  );

      <nav style={styles.navBar}>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>🏠</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>💬</button>
        <button style={styles.plusBtn} onClick={() => setShowUpload(true)}>+</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>🎮</button>
        <button style={{ background: 'none', border: 'none', fontSize: '22px' }}>👤</button>
      </nav>
      
      {/* Upload Modal (Hidden by default) */}
      {showUpload && (
         <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,245,247,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={styles.authCard}>
               <h3 style={{ color: '#FF85A1' }}>New Post 🌸</h3>
               <input style={styles.input} placeholder="Image URL" onChange={e => setNewPost({...newPost, imageUrl: e.target.value})} />
               <input style={styles.input} placeholder="Caption" onChange={e => setNewPost({...newPost, caption: e.target.value})} />
               <button style={styles.primaryBtn} onClick={async () => {
                  await fetch(`${BACKEND_URL}/create_post`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, image_url: newPost.imageUrl, caption: newPost.caption })
                  });
                  setShowUpload(false);
                  fetchFeed();
               }}>Share</button>
               <p onClick={() => setShowUpload(false)} style={{ marginTop: '10px', cursor: 'pointer' }}>Cancel</p>
            </div>
         </div>
      )}
    </div>
  );
}

export default App;
