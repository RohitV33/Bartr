// routes/reviews.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { barter_id, reviewee_id, rating, comment } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews(barter_id,reviewer_id,reviewee_id,rating,comment)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [barter_id, req.user.id, reviewee_id, rating, comment]
    );
    // recalculate trust score
    const avg = await pool.query(
      'SELECT AVG(rating)::numeric(3,1) as score FROM reviews WHERE reviewee_id=$1', [reviewee_id]
    );
    await pool.query('UPDATE users SET trust_score=$1 WHERE id=$2', [avg.rows[0].score, reviewee_id]);
    res.status(201).json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
