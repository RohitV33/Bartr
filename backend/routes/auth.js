const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');



const sign = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
router.post('/signup',
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password, college, location } = req.body;
    try {
      const exists = await pool.query('SELECT id FROM public.users WHERE email=$1', [email]);
      if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

      const hash  = await bcrypt.hash(password, 12);
      const token = uuidv4();
      const { rows } = await pool.query(
        `INSERT INTO public.users(name,email,password_hash,college,location,verify_token)
         VALUES($1,$2,$3,$4,$5,$6) RETURNING id,name,email,college,trust_score`,
        [name, email, hash, college || null, location || null, token]
      );
      const user = rows[0];
      res.status(201).json({ token: sign(user), user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Signup failed' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const { rows } = await pool.query(
        'SELECT * FROM public.users WHERE email=$1 AND is_blocked=false', [email]
      );
      if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
      const user = rows[0];
      const ok   = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      delete user.password_hash;
      res.json({ token: sign(user), user });
    } catch (e) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// GET /api/auth/me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id,name,email,college,location,bio,avatar_url,trust_score,is_verified,created_at
       FROM public.users WHERE id=$1`, [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
