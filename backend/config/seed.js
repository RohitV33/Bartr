require('dotenv').config();
const pool   = require('./db');
const bcrypt = require('bcryptjs');

const SKILLS_DATA = [
  { name: 'Alice Kumar',    email: 'alice@iitd.ac.in',   college: 'IIT Delhi',       location: 'Delhi',   bio: 'Full-stack dev & UI lover. 3 yrs React exp.',    offered: ['React','Node.js','TypeScript'], needed: ['Graphic Design','Video Editing'] },
  { name: 'Ben Sharma',     email: 'ben@nitk.edu.in',    college: 'NIT Karnataka',   location: 'Mangaluru', bio: 'Graphic designer, Figma wizard.',              offered: ['Figma','Illustrator','Branding'], needed: ['Python','Data Analysis'] },
  { name: 'Chloe Singh',    email: 'chloe@bits.ac.in',   college: 'BITS Pilani',     location: 'Pilani',  bio: 'Content writer & SEO enthusiast.',               offered: ['Blog Writing','SEO','Copywriting'], needed: ['Web Dev','Logo Design'] },
  { name: 'Dhruv Patel',    email: 'dhruv@iimb.ac.in',  college: 'IIM Bangalore',   location: 'Bangalore', bio: 'Business strategy & financial modelling.',     offered: ['Business Strategy','Excel','Finance'], needed: ['App Development','Marketing'] },
  { name: 'Eva Chen',       email: 'eva@iitm.ac.in',     college: 'IIT Madras',      location: 'Chennai', bio: 'ML researcher & Python dev.',                    offered: ['Python','Machine Learning','Data Science'], needed: ['UI Design','Video Editing'] },
  { name: 'Farhan Ali',     email: 'farhan@du.ac.in',    college: 'Delhi University',location: 'Delhi',   bio: 'Music producer & audio engineer.',               offered: ['Music Production','Audio Mixing','Ableton'], needed: ['Web Dev','Social Media'] },
];

const LISTING_DATA = [
  { title: 'Build your React app for a logo design', category: 'Coding',   offered: ['React','TypeScript','TailwindCSS'], wanted: ['Logo Design','Brand Identity'], desc: 'I am a 3rd year CS student with 2 years of React experience. I can build you a complete responsive web app. Looking for a professional logo and brand kit in return.', credits: 0 },
  { title: 'Professional logo design for coding help', category: 'Design', offered: ['Figma','Illustrator','Logo Design'], wanted: ['React','Python'], desc: 'Adobe Certified designer. I create clean, modern logos. Need help with frontend projects or Python scripts.', credits: 5 },
  { title: 'SEO blog content for web development',   category: 'Writing',  offered: ['Blog Writing','SEO','Content Strategy'], wanted: ['Web Development','HTML/CSS'], desc: 'I write SEO-optimised blog posts that rank. 50+ published articles. Need a landing page or portfolio site built.', credits: 0 },
  { title: 'Financial modelling for app development', category: 'Finance', offered: ['Excel','Financial Modelling','Pitch Decks'], wanted: ['Android Dev','iOS Dev'], desc: 'MBA student specialising in finance. Will build your investor pitch deck or financial model. Need a mobile app.', credits: 10 },
  { title: 'Python/ML tutoring for graphic design',  category: 'Coding',   offered: ['Python','Machine Learning','Pandas'], wanted: ['Graphic Design','Illustrations'], desc: 'IIT Madras ML student. I can tutor you on Python, data science, and ML. Looking for custom illustrations.', credits: 0 },
  { title: 'Music production for social media mgmt', category: 'Music',    offered: ['Music Production','Mixing','Beat Making'], wanted: ['Social Media Management','Instagram Growth'], desc: 'Produce professional quality tracks. 5 years exp. Need help growing my social media presence.', credits: 5 },
];

async function seed() {
  console.log('🌱 Seeding database…');
  const hash = await bcrypt.hash('password123', 10);

  for (const u of SKILLS_DATA) {
    const { rows } = await pool.query(
      `INSERT INTO users(name,email,password_hash,college,location,bio,is_verified,trust_score,credits)
       VALUES($1,$2,$3,$4,$5,$6,true,$7,$8) ON CONFLICT(email) DO NOTHING RETURNING id`,
      [u.name, u.email, hash, u.college, u.location, u.bio, (Math.random() * 2 + 3).toFixed(1), Math.floor(Math.random() * 20 + 5)]
    );
    if (!rows[0]) continue;
    const uid = rows[0].id;
    for (const s of u.offered) {
      await pool.query('INSERT INTO user_skills(user_id,skill_name,type,level) VALUES($1,$2,$3,$4)',
        [uid, s, 'offer', ['beginner','intermediate','expert'][Math.floor(Math.random()*3)]]);
    }
    for (const s of u.needed) {
      await pool.query('INSERT INTO user_skills(user_id,skill_name,type,level) VALUES($1,$2,$3,$4)',
        [uid, s, 'need', 'beginner']);
    }
  }

  const { rows: users } = await pool.query('SELECT id FROM users LIMIT 6');
  for (let i = 0; i < LISTING_DATA.length; i++) {
    const l = LISTING_DATA[i];
    const uid = users[i % users.length].id;
    await pool.query(
      `INSERT INTO listings(user_id,title,description,category,skills_offered,skills_wanted,credits_value,status,views)
       VALUES($1,$2,$3,$4,$5,$6,$7,'active',$8)`,
      [uid, l.title, l.desc, l.category, l.offered, l.wanted, l.credits, Math.floor(Math.random()*200)]
    );
  }

  console.log('✅ Seed complete! Users seeded with password: password123');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
