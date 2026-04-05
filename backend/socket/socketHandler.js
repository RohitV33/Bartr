const pool = require('../config/db');

const onlineUsers = new Map();

function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log(`🔌 User ${socket.userId} connected`);

    // join chat room
    socket.on('room:join', (roomId) => {
      socket.join(roomId);
    });

    // send message
    socket.on('message:send', async ({ roomId, content }) => {
      try {
        const { rows } = await pool.query(
          `INSERT INTO messages(room_id,sender_id,content) VALUES($1,$2,$3)
           RETURNING id,room_id,sender_id,content,created_at`,
          [roomId, socket.userId, content]
        );
        const msg = rows[0];
        // get sender info
        const user = await pool.query('SELECT name,avatar_url FROM users WHERE id=$1', [socket.userId]);
        const full = { ...msg, sender_name: user.rows[0].name, sender_avatar: user.rows[0].avatar_url };
        io.to(roomId).emit('message:new', full);
      } catch(e) { socket.emit('error', { message: 'Failed to send message' }); }
    });

    // typing indicator
    socket.on('typing:start', ({ roomId }) => socket.to(roomId).emit('typing:start', { userId: socket.userId }));
    socket.on('typing:stop',  ({ roomId }) => socket.to(roomId).emit('typing:stop',  { userId: socket.userId }));

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
}

module.exports = { initSocket };
