import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "https://glovia-backend-i15x.onrender.com";

const styles = {
  container: {
    backgroundColor: '#FFF5F7', // Very soft pink background
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    padding: '20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #FEE2E9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    color: '#D63384', // Glovia Pink
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
    fontFamily: '"Dancing Script", cursive, serif', // Script font for Glovia logo look
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  msgRow: (isMe) => ({
    display: 'flex',
    flexDirection: isMe ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: '8px',
  }),
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: '#FFD1DC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
  },
  bubble: (isMe) => ({
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '20px',
    borderBottomLeftRadius: isMe ? '20px' : '4px',
    borderBottomRightRadius: isMe ? '4px' : '20px',
    backgroundColor: isMe ? '#FF85A1' : '#fff', // Pink for Me, White for Others
    color: isMe ? '#fff' : '#555',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    fontSize: '14px',
    lineHeight: '1.4',
  }),
  inputContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderTop: '1px solid #FEE2E9',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1px solid #FEE2E9',
    backgroundColor: '#F8F9FA',
    outline: 'none',
    fontSize: '14px',
  },
  sendBtn: {
    backgroundColor: '#FF85A1',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit('join', { room: 'default' });
    newSocket.on("message", (msg) => setChat(prev => [...prev, msg]));
    return () => newSocket.close();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("send_msg", { content: message, room: "default", sender: "User" });
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header matching Screen 2 */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Glovia 💕</h1>
      </header>

      {/* Chat messages Area */}
      <div style={styles.chatArea}>
        {chat.map((msg, idx) => {
          // Add these two lines to extract the text correctly
          const isMe = typeof msg === 'object' ? msg.sender === "User" : false;
          const content = typeof msg === 'object' ? msg.content : msg;

          return (
            <div key={idx} style={styles.msgRow(isMe)}>
              <div style={styles.avatar}>{isMe ? 'U' : 'G'}</div>
              <div style={styles.bubble(isMe)}>{content}</div>
            </div>
          );
        })}
      </div>
      {/* Input bar matching Screen 2 */}
      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type something cute..."
        />
        <button type="submit" style={styles.sendBtn}>
          <span style={{ transform: 'rotate(-45deg)', fontSize: '18px' }}>➤</span>
        </button>
      </form>
    </div>
  );
}

export default App;
