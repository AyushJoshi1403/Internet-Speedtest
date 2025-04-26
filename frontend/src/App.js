import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const startSpeedTest = () => {
    setIsTesting(true);
    socket.emit('startSpeedTest');
  };

  useEffect(() => {
    socket.on('speedUpdate', ({ download, upload }) => {
      setDownloadSpeed(download);
      setUploadSpeed(upload);
      setIsTesting(false);
    });

    return () => {
      socket.off('speedUpdate');
    };
  }, []);

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Real-Time Internet Speed Test</h1>
      <button
        onClick={startSpeedTest}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={isTesting}
      >
        {isTesting ? 'Testing...' : 'Start Speed Test'}
      </button>
      {downloadSpeed !== null && uploadSpeed !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#4CAF50' }}>Results:</h2>
          <p style={{ fontSize: '18px', color: '#333' }}>Download Speed: {downloadSpeed} Mbps</p>
          <p style={{ fontSize: '18px', color: '#333' }}>Upload Speed: {uploadSpeed} Mbps</p>
        </div>
      )}
    </div>
  );
}

export default App;