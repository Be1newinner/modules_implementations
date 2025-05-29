"use client";
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Define your backend URL. Make sure it matches where your Express.js server is running.
const BACKEND_URL = 'http://localhost:8000'; // Your Express.js backend URL

// Global socket instance (to prevent multiple connections on re-renders)
let socket;

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(""); // Store user ID after login/register

  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only connect if the user is logged in
    if (isLoggedIn && !socket) {
      // Connect to the backend Socket.IO server
      socket = io(BACKEND_URL);

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server!');
        setStatusMessage('Connected to chat!');
      });

      socket.on('recentMessages', (fetchedMessages) => {
        console.log('Received recent messages:', fetchedMessages);
        setMessages(fetchedMessages);
      });

      socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('error', (errorMessage) => {
        console.error('Socket error:', errorMessage);
        setStatusMessage(`Chat Error: ${errorMessage}`);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server.');
        setStatusMessage('Disconnected from chat.');
        socket = null;
      });
    }

    return () => {
      if (!isLoggedIn && socket) {
        console.log('Cleaning up socket connection...');
        socket.disconnect();
        socket = null;
      }
    };
  }, [isLoggedIn]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMessage('Registering...');
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage(data.message);
        setUserId(data.user.id);
        setIsLoggedIn(true);
      } else {
        setStatusMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setStatusMessage('Registration failed. Server might be down.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMessage('Logging in...');
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatusMessage(data.message);
        setUserId(data.user.id);
        setIsLoggedIn(true);
      } else {
        setStatusMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setStatusMessage('Login failed. Server might be down.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && newMessageContent.trim() && isLoggedIn && userId && username) {
      const messagePayload = {
        userId: userId,
        username: username,
        content: newMessageContent.trim(),
      };
      console.log('Sending message:', messagePayload);
      socket.emit('sendMessage', messagePayload);
      setNewMessageContent(''); // Clear input after sending
    } else if (!isLoggedIn) {
      setStatusMessage('Please login to send messages.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Simple Group Chat</h1>

      {!isLoggedIn ? (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '15px' }}>Register / Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', flex: 1 }}>Login</button>
              <button type="button" onClick={handleRegister} style={{ padding: '10px 15px', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: 'white', color: '#007bff', cursor: 'pointer', flex: 1 }}>Register</button>
            </div>
          </form>
          {statusMessage && <p style={{ marginTop: '10px', color: statusMessage.includes('Error') ? 'red' : 'green' }}>{statusMessage}</p>}
        </div>
      ) : (
        <div>
          <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '20px', color: '#555' }}>Logged in as: <strong>{username}</strong> (ID: {userId})</p>
          {statusMessage && <p style={{ textAlign: 'center', color: statusMessage.includes('Error') ? 'red' : 'green' }}>{statusMessage}</p>}

          <div style={{ border: '1px solid #ddd', height: '400px', overflowY: 'auto', padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
            {messages.map((msg, index) => (
              <div key={msg.id || index} style={{ marginBottom: '8px', padding: '5px', borderRadius: '4px', backgroundColor: msg.user.id === userId ? '#e0f7fa' : '#f0f0f0', marginLeft: msg.user.id === userId ? 'auto' : '0', marginRight: msg.user.id === userId ? '0' : 'auto', maxWidth: '70%', wordWrap: 'break-word' }}>
                <strong style={{ color: '#007bff' }}>{msg.user.username}:</strong> {msg.content}
                <div style={{ fontSize: '0.75em', color: '#888', textAlign: msg.user.id === userId ? 'right' : 'left' }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              disabled={!isLoggedIn}
              style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button
              type="submit"
              disabled={!isLoggedIn || !newMessageContent.trim()}
              style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}