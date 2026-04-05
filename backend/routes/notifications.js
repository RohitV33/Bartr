const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30', [req.user.id]
  );
  res.json(rows);
});

router.patch('/:id/read', auth, async (req, res) => {
  await pool.query('UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ ok: true });
});

router.patch('/read-all', auth, async (req, res) => {
  await pool.query('UPDATE notifications SET read=true WHERE user_id=$1', [req.user.id]);
  res.json({ ok: true });
});

module.exports = router;
