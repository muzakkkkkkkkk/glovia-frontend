import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: { backgroundColor: '#FFF5F7', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' },
  header: { padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #FEE2E9', textAlign: 'center' },
  headerTitle: { color: '#D63384', fontSize: '24px', fontWeight: 'bold', margin: 0 },
  chatArea: { flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' },
  msgRow: (isMe) => ({ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }),
  avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#FFD1DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff' },
  bubble: (isMe) => ({
    maxWidth: '70%', padding: '12px 16px', borderRadius: '20px', borderBottomLeftRadius: isMe ? '20px' : '4px',
    borderBottomRightRadius: isMe ? '4px' : '20px', backgroundColor: isMe ? '#FF85A1' : '#fff', color: isMe ? '#fff' : '#555',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '14px'
  }),
  senderName: { fontSize: '10px', color: '#999', marginBottom: '2px', display: 'block' },
  inputContainer: { padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #FEE2E9', display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #FEE2E9', outline: 'none' },
  loginOverlay: { position: 'fixed', inset: 0, backgroundColor: '#FFF5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  loginBox: { backgroundColor: '#fff', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '300px', textAlign: 'center' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password === "glovia123") { // Temporary hardcoded password
      setIsLoggedIn(true);
    } else {
      alert("Invalid password! (Try: glovia123)");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("send_msg", { content: message, room: "default", sender: username });
      setMessage("");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginOverlay}>
        <form style={styles.loginBox} onSubmit={handleLogin}>
          <h1 style={styles.headerTitle}>Welcome to Glovia</h1>
          <p style={{ color: '#999', fontSize: '12px' }}>Login to start chatting</p>
          <input style={{...styles.input, width: '80%', marginBottom: '10px'}} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input style={{...styles.input, width: '80%', marginBottom: '20px'}} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" style={{ backgroundColor: '#FF85A1', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold', width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}><h1 style={styles.headerTitle}>Glovia 💕</h1></header>
      <div style={styles.chatArea}>
        {chat.map((msg, idx) => {
          const isMe = typeof msg === 'object' ? msg.sender === username : false;
          const content = typeof msg === 'object' ? msg.content : msg;
          const sender = typeof msg === 'object' ? msg.sender : "Unknown";
          return (
            <div key={idx} style={styles.msgRow(isMe)}>
              <div style={styles.avatar}>{sender.charAt(0).toUpperCase()}</div>
              <div>
                {!isMe && <span style={styles.senderName}>{sender}</span>}
                <div style={styles.bubble(isMe)}>{content}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input style={styles.input} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type something cute..." />
        <button type="submit" style={{ backgroundColor: '#FF85A1', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%' }}>➤</button>
      </form>
    </div>
  );
}

export default App;
