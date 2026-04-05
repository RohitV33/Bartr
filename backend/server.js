require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initSocket } = require('./socket/socketHandler');

const authRoutes      = require('./routes/auth');
const userRoutes      = require('./routes/users');
const listingRoutes   = require('./routes/listings');
const barterRoutes    = require('./routes/barter');
const chatRoutes      = require('./routes/chat');
const reviewRoutes    = require('./routes/reviews');
const notifRoutes     = require('./routes/notifications');
const uploadRoutes    = require('./routes/upload');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }
});

// ── Middleware ──────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/listings',      listingRoutes);
app.use('/api/barter',        barterRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/upload',        uploadRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'Bartr API' }));

// ── Socket.io ───────────────────────────────────────────────
initSocket(io);
app.set('io', io);

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Bartr API running on port ${PORT}`));

