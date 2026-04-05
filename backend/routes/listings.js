const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// GET /api/listings  — search & filter
router.get('/', async (req, res) => {
  const { category, skill, location, q, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  let where = ["l.status='active'"], params = [];

  if (category)  { params.push(category);  where.push(`l.category=$${params.length}`); }
  if (location)  { params.push(`%${location}%`); where.push(`l.location ILIKE $${params.length}`); }
  if (q)         { params.push(`%${q}%`); where.push(`(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`); }
  if (skill)     { params.push(`{${skill}}`); where.push(`l.skills_offered && $${params.length}::text[]`); }

  const cond = where.join(' AND ');
  params.push(limit, offset);

  try {
    const { rows } = await pool.query(
      `SELECT l.*, u.name as owner_name, u.avatar_url as owner_avatar, u.trust_score
       FROM listings l JOIN users u ON l.user_id=u.id
       WHERE ${cond} ORDER BY l.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const total = await pool.query(`SELECT COUNT(*) FROM listings l WHERE ${cond}`, params.slice(0,-2));
    res.json({ listings: rows, total: parseInt(total.rows[0].count), page: +page });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE listings SET views=views+1 WHERE id=$1', [req.params.id]);
    const { rows } = await pool.query(
      `SELECT l.*, u.name as owner_name, u.avatar_url as owner_avatar,
              u.trust_score, u.college, u.bio as owner_bio
       FROM listings l JOIN users u ON l.user_id=u.id WHERE l.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Listing not found' });
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/listings
router.post('/', auth, async (req, res) => {
  const { title, description, category, skills_offered, skills_wanted, media_url, location } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO listings(user_id,title,description,category,skills_offered,skills_wanted,media_url,location)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, title, description, category, skills_offered, skills_wanted, media_url || null, location]
    );
    res.status(201).json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/listings/:id
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, skills_offered, skills_wanted, media_url, location, status } = req.body;
  try {
    const check = await pool.query('SELECT user_id FROM listings WHERE id=$1', [req.params.id]);
    if (!check.rows.length || check.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });
    const { rows } = await pool.query(
      `UPDATE listings SET title=$1,description=$2,category=$3,skills_offered=$4,
       skills_wanted=$5,media_url=$6,location=$7,status=$8 WHERE id=$9 RETURNING *`,
      [title, description, category, skills_offered, skills_wanted, media_url || null, location, status, req.params.id]
    );
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/listings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM listings WHERE id=$1', [req.params.id]);
    if (!check.rows.length || check.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });
    await pool.query('DELETE FROM listings WHERE id=$1', [req.params.id]);
    res.json({ message: 'Listing deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
