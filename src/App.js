import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "https://glovia-backend-i15x.onrender.com";
const BACKEND_URL = "https://glovia-backend-i15x.onrender.com"; // For API calls

const styles = {
  container: { backgroundColor: '#FFF5F7', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' },
  header: { padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #FEE2E9', textAlign: 'center' },
  headerTitle: { color: '#D63384', fontSize: '24px', fontWeight: 'bold', margin: 0 },
  loginOverlay: { position: 'fixed', inset: 0, backgroundColor: '#FFF5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  loginBox: { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '320px', textAlign: 'center' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '20px', border: '1px solid #FEE2E9', outline: 'none', boxSizing: 'border-box' },
  button: { backgroundColor: '#FF85A1', color: '#fff', border: 'none', padding: '12px', borderRadius: '25px', fontWeight: 'bold', width: '100%', cursor: 'pointer', marginTop: '10px' },
  toggleText: { color: '#D63384', fontSize: '13px', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
      setSocket(newSocket);
      newSocket.emit('join', { room: 'default' });
      newSocket.on("message", (msg) => setChat(prev => [...prev, msg]));
      return () => newSocket.close();
    }
  }, [isLoggedIn]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';
    
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isRegistering) {
          alert("Account created! Now please login. ✨");
          setIsRegistering(false);
        } else {
          setIsLoggedIn(true);
          setUserProfile(data.user); // Store unique user data
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <form style={styles.loginBox} onSubmit={handleAuth}>
          <h1 style={styles.headerTitle}>Glovia 💕</h1>
          <p style={{ color: '#999', fontSize: '13px' }}>{isRegistering ? 'Create your unique account' : 'Welcome back, gorgeous!'}</p>
          
          <input style={styles.input} placeholder="Unique Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <button type="submit" style={styles.button}>{isRegistering ? 'Sign Up' : 'Login'}</button>
          
          <p style={styles.toggleText} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : 'New to Glovia? Create Account'}
          </p>
        </form>
      </div>
    );
  }

  // ... Chat UI remains below (same as previous pink version)
  return (
    <div style={styles.container}>
      <header style={styles.header}><h1 style={styles.headerTitle}>Glovia 💕</h1></header>
      <div style={{flex: 1, padding: '20px', textAlign: 'center'}}>
        <p>Logged in as: <strong>{username}</strong></p>
        {/* Chat window and input go here as before */}
      </div>
    </div>
  );
}

export default App;
