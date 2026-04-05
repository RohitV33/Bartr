const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// GET /api/chat/rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT cr.*, 
              u1.name as user1_name, u1.avatar_url as user1_avatar,
              u2.name as user2_name, u2.avatar_url as user2_avatar,
              (SELECT content FROM messages WHERE room_id=cr.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages WHERE room_id=cr.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
              (SELECT COUNT(*) FROM messages WHERE room_id=cr.id AND sender_id!=$1 AND read=false) as unread
       FROM chat_rooms cr
       JOIN users u1 ON cr.user1_id=u1.id
       JOIN users u2 ON cr.user2_id=u2.id
       WHERE cr.user1_id=$1 OR cr.user2_id=$1
       ORDER BY last_message_at DESC NULLS LAST`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/chat/rooms/:roomId/messages
router.get('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM messages m JOIN users u ON m.sender_id=u.id
       WHERE m.room_id=$1 ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
      [req.params.roomId, limit, offset]
    );
    // mark as read
    await pool.query(
      'UPDATE messages SET read=true WHERE room_id=$1 AND sender_id!=$2',
      [req.params.roomId, req.user.id]
    );
    res.json(rows.reverse());
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
