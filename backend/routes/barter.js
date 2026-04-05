const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// POST /api/barter  — send request
router.post('/', auth, async (req, res) => {
  const { listing_id, message, offered_skills } = req.body;
  try {
    const listing = await pool.query('SELECT * FROM listings WHERE id=$1', [listing_id]);
    if (!listing.rows.length) return res.status(404).json({ error: 'Listing not found' });
    const provider_id = listing.rows[0].user_id;
    if (provider_id === req.user.id) return res.status(400).json({ error: 'Cannot barter with yourself' });

    const { rows } = await pool.query(
      `INSERT INTO barter_requests(listing_id,requester_id,provider_id,message,offered_skills)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [listing_id, req.user.id, provider_id, message, offered_skills]
    );
    // create notification
    await pool.query(
      `INSERT INTO notifications(user_id,type,title,body,link) VALUES($1,'barter_request','New Barter Request',$2,$3)`,
      [provider_id, `Someone wants to barter for your listing!`, `/barter/${rows[0].id}`]
    );
    res.status(201).json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/barter  — all requests for current user
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT br.*, 
              l.title as listing_title, l.skills_offered as listing_skills,
              u1.name as requester_name, u1.avatar_url as requester_avatar,
              u2.name as provider_name, u2.avatar_url as provider_avatar
       FROM barter_requests br
       JOIN listings l ON br.listing_id=l.id
       JOIN users u1 ON br.requester_id=u1.id
       JOIN users u2 ON br.provider_id=u2.id
       WHERE br.requester_id=$1 OR br.provider_id=$1
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/barter/:id/status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM barter_requests WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const br = rows[0];
    if (br.provider_id !== req.user.id && br.requester_id !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    const updated = await pool.query(
      'UPDATE barter_requests SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );

    // if accepted, create chat room
    if (status === 'accepted') {
      await pool.query(
        'INSERT INTO chat_rooms(barter_id,user1_id,user2_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
        [req.params.id, br.requester_id, br.provider_id]
      );
    }
    res.json(updated.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/barter/:id/complete  — mark side done
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM barter_requests WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const br = rows[0];
    const field = br.requester_id === req.user.id ? 'requester_done' : 'provider_done';
    const updated = await pool.query(
      `UPDATE barter_requests SET ${field}=true WHERE id=$1 RETURNING *`, [req.params.id]
    );
    const b = updated.rows[0];
    if (b.requester_done && b.provider_done) {
      await pool.query("UPDATE barter_requests SET status='completed' WHERE id=$1", [req.params.id]);
    }
    res.json(updated.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
