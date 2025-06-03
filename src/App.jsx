import React, { useState, useEffect } from 'react';
import socket from './socket';
import './App.css'
function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleJoin = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        message,
        sender: username,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('send_message', msgData);
      setChat((prev) => [...prev, { ...msgData, self: true }]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, { ...data, self: false }]);
    });
    return () => socket.off('receive_message');
  }, []);

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">Enter Your Name</h2>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Your name"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Welcome, {username}</h2>

        <div className="h-80 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 ${msg.self ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-bold">
                  {msg.sender.charAt(0).toUpperCase()}
                </div>
                <div className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${
                  msg.self ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  <div className="font-semibold mb-1">{msg.self ? 'You' : msg.sender}</div>
                  <div>{msg.message}</div>
                  <div className="text-xs text-right opacity-70 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
