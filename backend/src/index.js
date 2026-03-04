const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// config
const { MONGO_URI, PORT, SOCKET_IO_CORS_ORIGIN } = process.env;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: SOCKET_IO_CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// middleware
app.use(express.json());
app.use(cors());

// database connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/memory', require('./routes/memory'));
app.use('/api/system', require('./routes/system'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/integrations', require('./routes/integrations'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// socket namespaces
const agentNamespace = io.of('/api/agent');
const logNamespace = io.of('/api/logs');

app.set('agentNamespace', agentNamespace);
app.set('logNamespace', logNamespace);

agentNamespace.on('connection', (socket) => {
  console.log('Client connected to agent namespace');
});

logNamespace.on('connection', (socket) => {
  console.log('Client connected to logs namespace');
});

const port = PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, server };
