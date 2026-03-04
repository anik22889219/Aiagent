const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// config
const { MONGO_URI, PORT } = process.env;

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://localhost:3006"],
    methods: ['GET', 'POST'],
  },
});

// middleware
app.use(express.json({ limit: '10mb' })); // Increased for training documents
app.use(cors());
// passport for OAuth
const passport = require('passport');
app.use(passport.initialize());
// require Google strategy (will register with passport)
require('./auth/google');

// ============================================
// 🧠 IRON-MAN ARCHITECTURE — Bootstrap
// ============================================

// 1. Tool Registry — Register all built-in tools
const { registerBuiltinTools } = require('./tools/builtins');
const toolRegistry = registerBuiltinTools();

// 2. Agent Brain — Connect tool registry
const { getAgentBrain } = require('./agent/agentBrain');
const agentBrain = getAgentBrain();
agentBrain.setToolRegistry(toolRegistry);

// 3. A2A Protocol — Agent Card + JSON-RPC server
const { setupAgentCardEndpoint } = require('./a2a/agentCard');
const { setupA2AServer } = require('./a2a/a2aServer');
setupAgentCardEndpoint(app);
setupA2AServer(app);

console.log('🧠 Iron-Man Architecture initialized');

// ============================================

// database connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.error('Initial MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// routes — existing
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/memory', require('./routes/memory'));
app.use('/api/system', require('./routes/system'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/integrations', require('./routes/integrations'));

// routes — new (Iron-Man Architecture)
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/a2a', require('./routes/a2a'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    architecture: 'Iron-Man',
    gemini: agentBrain.gemini.available ? 'connected' : 'fallback',
    tools: toolRegistry.listTools().length,
  });
});

// socket namespaces
const agentNamespace = io.of('/api/agent');
const logNamespace = io.of('/api/logs');
const aiSocket = require('./sockets/aiSocket');

app.set('agentNamespace', agentNamespace);
app.set('logNamespace', logNamespace);

// Initialize AI Socket (now powered by Agent Brain)
aiSocket(io);

agentNamespace.on('connection', (socket) => {
  console.log('Client connected to agent namespace');
});

logNamespace.on('connection', (socket) => {
  console.log('Client connected to logs namespace');
});

const port = PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 JARVIS Server running on port ${port}`);
  console.log(`📡 Agent Card: http://localhost:${port}/.well-known/agent.json`);
  console.log(`🤝 A2A Endpoint: http://localhost:${port}/a2a`);
});

module.exports = { app, server };
