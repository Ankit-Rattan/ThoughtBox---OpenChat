// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const handleChatMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleChatHistory = (history) => {
      setMessages(history);
    };

    socket.on('chat message', handleChatMessage);
    socket.on('chat history', handleChatHistory);

    return () => {
      socket.off('chat message', handleChatMessage);
      socket.off('chat history', handleChatHistory);
    };
  }, [messages]);

  const sendMessage = () => {
    socket.emit('chat message', { user, message: messageInput });

    setMessages((prevMessages) => [...prevMessages, { user, message: messageInput }]);
    setMessageInput('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.message}
          </div>
        ))}
      </div>

      {user ? (
        <div>
          <p>Welcome, {user}!</p>
          <button onClick={() => setUser('')}>Logout</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={sendMessage}>Login</button>
        </div>
      )}

      <input
        type="text"
        placeholder="Type your message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
