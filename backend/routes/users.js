// routes/users.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// GET /api/users/:id  public profile
router.get('/:id', async (req, res) => {
  try {
    const [user, skills, portfolio, reviews] = await Promise.all([
      pool.query('SELECT id,name,bio,college,location,avatar_url,trust_score,created_at FROM users WHERE id=$1', [req.params.id]),
      pool.query('SELECT * FROM user_skills WHERE user_id=$1', [req.params.id]),
      pool.query('SELECT * FROM portfolio_items WHERE user_id=$1 ORDER BY created_at DESC', [req.params.id]),
      pool.query(`SELECT r.*,u.name as reviewer_name,u.avatar_url as reviewer_avatar
                  FROM reviews r JOIN users u ON r.reviewer_id=u.id
                  WHERE r.reviewee_id=$1 ORDER BY r.created_at DESC LIMIT 10`, [req.params.id])
    ]);
    if (!user.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ ...user.rows[0], skills: skills.rows, portfolio: portfolio.rows, reviews: reviews.rows });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/users/me  update profile
router.put('/me', auth, async (req, res) => {
  const { name, bio, college, location, avatar_url } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET name=$1,bio=$2,college=$3,location=$4,avatar_url=$5 WHERE id=$6
       RETURNING id,name,bio,college,location,avatar_url,trust_score`,
      [name, bio, college, location, avatar_url, req.user.id]
    );
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/users/me/skills
router.post('/me/skills', auth, async (req, res) => {
  const { skills } = req.body; // [{skill_name, type, level}]
  try {
    await pool.query('DELETE FROM user_skills WHERE user_id=$1', [req.user.id]);
    for (const s of skills) {
      await pool.query('INSERT INTO user_skills(user_id,skill_name,type,level) VALUES($1,$2,$3,$4)',
        [req.user.id, s.skill_name, s.type, s.level]);
    }
    const { rows } = await pool.query('SELECT * FROM user_skills WHERE user_id=$1', [req.user.id]);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/users/report
router.post('/report', auth, async (req, res) => {
  const { reported_id, reason } = req.body;
  try {
    await pool.query('INSERT INTO reports(reporter_id,reported_id,reason) VALUES($1,$2,$3)',
      [req.user.id, reported_id, reason]);
    res.json({ message: 'Report submitted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
