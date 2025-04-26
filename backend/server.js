const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const FastSpeedtest = require('fast-speedtest-api');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const speedtest = new FastSpeedtest({
  token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // Replace with your actual token from fast.com
  verbose: false,
  timeout: 10000,
  https: true,
});

// Emit speed data periodically
setInterval(() => {
  speedtest.getSpeed().then(speed => {
    io.emit('speedUpdate', speed);
  }).catch(err => {
    console.error('Speed test error:', err);
    if (err.code === 'ETIMEDOUT') {
      console.error('Connection timed out. Please check your network.');
    } else if (err.code === 'ECONNRESET') {
      console.error('Connection was reset. Retrying...');
    } else {
      console.error('Unexpected error:', err);
    }
  });
}, 10000);

// API Routes
app.get('/', (req, res) => {
  res.send('Internet Speedtest API');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));