import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'design' }, update: {}, create: { name: 'Design', slug: 'design', icon: '🎨', description: 'UI/UX, graphic design, illustration, brand design' } }),
    prisma.category.upsert({ where: { slug: 'coding' }, update: {}, create: { name: 'Coding', slug: 'coding', icon: '💻', description: 'Web dev, mobile apps, data science, DevOps' } }),
    prisma.category.upsert({ where: { slug: 'writing' }, update: {}, create: { name: 'Writing', slug: 'writing', icon: '✍️', description: 'Content writing, copywriting, academic writing, editing' } }),
    prisma.category.upsert({ where: { slug: 'music' }, update: {}, create: { name: 'Music', slug: 'music', icon: '🎵', description: 'Instrument lessons, music production, vocal coaching' } }),
    prisma.category.upsert({ where: { slug: 'languages' }, update: {}, create: { name: 'Languages', slug: 'languages', icon: '🌍', description: 'Language tutoring, translation, conversation practice' } }),
    prisma.category.upsert({ where: { slug: 'math' }, update: {}, create: { name: 'Math & Science', slug: 'math', icon: '📐', description: 'Calculus, statistics, physics, chemistry tutoring' } }),
    prisma.category.upsert({ where: { slug: 'photography' }, update: {}, create: { name: 'Photography', slug: 'photography', icon: '📷', description: 'Portrait, landscape, editing, videography' } }),
    prisma.category.upsert({ where: { slug: 'editing' }, update: {}, create: { name: 'Video Editing', slug: 'editing', icon: '🎬', description: 'Video editing, motion graphics, color grading' } }),
  ])

  const [design, coding, writing, music, languages, math, photography, editing] = categories
  console.log(`✅ Created ${categories.length} categories`)

  // ── Users ────────────────────────────────────────────────────────────────
  const password = await bcrypt.hash('Password123!', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alex@mit.edu' }, update: {},
      create: {
        email: 'alex@mit.edu', password_hash: password,
        full_name: 'Alex Chen', username: 'alexchen',
        university: 'MIT', department: 'Computer Science',
        year_of_study: 3, bio: 'CS junior building cool things. Love React + ML. Looking to improve my design skills!',
        reputation_score: 4.8, is_verified: true, onboarding_done: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya@stanford.edu' }, update: {},
      create: {
        email: 'priya@stanford.edu', password_hash: password,
        full_name: 'Priya Sharma', username: 'priyasharma',
        university: 'Stanford', department: 'Design',
        year_of_study: 2, bio: 'Design student passionate about product design and UX research. Can help with Figma, branding, and illustration.',
        reputation_score: 4.9, is_verified: true, onboarding_done: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'marcus@columbia.edu' }, update: {},
      create: {
        email: 'marcus@columbia.edu', password_hash: password,
        full_name: 'Marcus Johnson', username: 'marcusjohnson',
        university: 'Columbia', department: 'Music',
        year_of_study: 4, bio: 'Music theory + piano teacher. Also learning to code. Would love web dev lessons in exchange for music lessons!',
        reputation_score: 4.7, is_verified: true, onboarding_done: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sofia@nyu.edu' }, update: {},
      create: {
        email: 'sofia@nyu.edu', password_hash: password,
        full_name: 'Sofia Alvarez', username: 'sofiaalvarez',
        university: 'NYU', department: 'Journalism',
        year_of_study: 3, bio: 'Writer and editor. Fluent in Spanish. Interested in learning photography for multimedia journalism.',
        reputation_score: 4.6, is_verified: true, onboarding_done: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'james@harvard.edu' }, update: {},
      create: {
        email: 'james@harvard.edu', password_hash: password,
        full_name: 'James Park', username: 'jamespark',
        university: 'Harvard', department: 'Economics',
        year_of_study: 2, bio: 'Stats nerd. Can tutor econometrics and data analysis. Learning Spanish for my semester abroad.',
        reputation_score: 4.5, is_verified: true, onboarding_done: true,
      },
    }),
  ])
  console.log(`✅ Created ${users.length} users`)

  const [alex, priya, marcus, sofia, james] = users

  // ── Skills ───────────────────────────────────────────────────────────────
  const skills = await Promise.all([
    // Alex offers coding, wants design
    prisma.skill.create({ data: { user_id: alex.id, title: 'React & TypeScript Development', description: 'Full-stack web apps with React 18, TypeScript, Tailwind CSS, and Node.js backends. 3 years experience.', category_id: coding.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: alex.id, title: 'Machine Learning Basics', description: 'Python, scikit-learn, pandas, intro to neural networks. Can help with ML projects and coursework.', category_id: coding.id, proficiency_level: 'INTERMEDIATE', is_offering: true } }),
    prisma.skill.create({ data: { user_id: alex.id, title: 'UI/UX Design', description: 'I need help with Figma, design systems, and how to make my apps look polished.', category_id: design.id, proficiency_level: 'BEGINNER', is_offering: false } }),

    // Priya offers design, wants coding
    prisma.skill.create({ data: { user_id: priya.id, title: 'Figma & UI Design', description: 'Product design, wireframing, prototyping, design systems, and user research. Work with top tech companies.', category_id: design.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: priya.id, title: 'Brand Identity Design', description: 'Logo design, brand guidelines, visual identity for startups and student projects.', category_id: design.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: priya.id, title: 'React Development', description: 'Want to learn React to build my portfolio site and prototype interactions.', category_id: coding.id, proficiency_level: 'BEGINNER', is_offering: false } }),

    // Marcus offers music, wants coding
    prisma.skill.create({ data: { user_id: marcus.id, title: 'Piano & Music Theory', description: 'Classical + jazz piano. Music theory from beginner to advanced. 10+ years playing, 4 years teaching.', category_id: music.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: marcus.id, title: 'Music Production (Ableton)', description: 'Beat making, mixing, mastering, sound design in Ableton Live.', category_id: music.id, proficiency_level: 'INTERMEDIATE', is_offering: true } }),
    prisma.skill.create({ data: { user_id: marcus.id, title: 'Web Development Basics', description: 'Looking to learn HTML, CSS, and JavaScript to build my own music portfolio site.', category_id: coding.id, proficiency_level: 'BEGINNER', is_offering: false } }),

    // Sofia offers writing, wants photography
    prisma.skill.create({ data: { user_id: sofia.id, title: 'Content Writing & Editing', description: 'Blog posts, articles, essays, social media copy. Strong AP style. Former campus newspaper editor.', category_id: writing.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: sofia.id, title: 'Spanish Tutoring', description: 'Native speaker. Conversational practice, grammar, writing. All levels welcome.', category_id: languages.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: sofia.id, title: 'Photography & Lightroom', description: 'Need to learn portrait and event photography for multimedia journalism work.', category_id: photography.id, proficiency_level: 'BEGINNER', is_offering: false } }),

    // James offers math, wants languages
    prisma.skill.create({ data: { user_id: james.id, title: 'Statistics & Econometrics', description: 'R, Python (pandas/numpy), regression, causal inference, A/B testing. TA for Econ 101.', category_id: math.id, proficiency_level: 'EXPERT', is_offering: true } }),
    prisma.skill.create({ data: { user_id: james.id, title: 'Data Analysis & Excel', description: 'Advanced Excel, pivot tables, financial modelling, data visualization with Tableau.', category_id: coding.id, proficiency_level: 'INTERMEDIATE', is_offering: true } }),
    prisma.skill.create({ data: { user_id: james.id, title: 'Spanish Conversation', description: 'Going to Spain next semester. Need conversational Spanish practice, not just grammar.', category_id: languages.id, proficiency_level: 'BEGINNER', is_offering: false } }),
  ])
  console.log(`✅ Created ${skills.length} skills`)

  // ── Exchanges ────────────────────────────────────────────────────────────
  const exchange1 = await prisma.exchange.create({
    data: {
      offerer_id: alex.id,
      requester_id: priya.id,
      offered_skill_id: skills[0].id,  // Alex's React
      requested_skill_id: skills[3].id, // Priya's Figma
      status: 'ACCEPTED',
      offerer_confirmed: false,
      requester_confirmed: false,
      agreed_at: new Date(),
    },
  })

  const exchange2 = await prisma.exchange.create({
    data: {
      offerer_id: sofia.id,
      requester_id: james.id,
      offered_skill_id: skills[10].id,  // Sofia's Spanish
      requested_skill_id: skills[12].id, // James's stats
      status: 'COMPLETED',
      offerer_confirmed: true,
      requester_confirmed: true,
      agreed_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  })

  const exchange3 = await prisma.exchange.create({
    data: {
      offerer_id: marcus.id,
      requester_id: alex.id,
      offered_skill_id: skills[6].id,  // Marcus's piano
      requested_skill_id: skills[1].id, // Alex's ML
      status: 'PENDING',
    },
  })
  console.log('✅ Created 3 exchanges')

  // ── Messages ─────────────────────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      { exchange_id: exchange1.id, sender_id: alex.id, content: 'Hey Priya! Really excited to exchange skills. I can help you with React fundamentals first — when are you free?', message_type: 'TEXT', read_at: new Date() },
      { exchange_id: exchange1.id, sender_id: priya.id, content: "Alex! This is perfect timing. I'm free Tuesday and Thursday evenings. Should we start with a 1hr session each week?", message_type: 'TEXT', read_at: new Date() },
      { exchange_id: exchange1.id, sender_id: alex.id, content: "Sounds great! I'll set up a shared Notion for notes. For our first session I'll cover components, props, and hooks.", message_type: 'TEXT' },
      { exchange_id: exchange2.id, sender_id: sofia.id, content: 'James, I really enjoyed our sessions! Your stats explanations were so clear.', message_type: 'TEXT', read_at: new Date() },
      { exchange_id: exchange2.id, sender_id: james.id, content: 'Same! Mi español ha mejorado mucho. 😂 Ready to leave a review?', message_type: 'TEXT', read_at: new Date() },
    ],
  })
  console.log('✅ Created messages')

  // ── Reviews ──────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      { exchange_id: exchange2.id, reviewer_id: sofia.id, reviewee_id: james.id, rating: 5, comment: 'James is an incredible tutor — patient, clear, and makes stats actually fun. Highly recommend!' },
      { exchange_id: exchange2.id, reviewer_id: james.id, reviewee_id: sofia.id, rating: 5, comment: 'Sofia is a native speaker and an amazing teacher. My conversational Spanish improved dramatically in 4 sessions.' },
    ],
  })
  console.log('✅ Created reviews')

  // ── Portfolio Items ───────────────────────────────────────────────────────
  await prisma.portfolio.createMany({
    data: [
      { user_id: priya.id, title: 'Fintech App Redesign', description: 'Complete UX overhaul for a campus finance app. Improved task completion rate by 40%.', file_url: 'https://placehold.co/800x600/f5c842/0f0f0f?text=Fintech+Redesign', file_type: 'image/png', tags: ['ux', 'fintech', 'figma'] },
      { user_id: priya.id, title: 'Student Housing Brand', description: 'Brand identity for a student housing startup — logo, color system, typography.', file_url: 'https://placehold.co/800x600/0f0f0f/f5c842?text=Brand+Identity', file_type: 'image/png', tags: ['branding', 'logo', 'identity'] },
      { user_id: alex.id, title: 'Campus Events Platform', description: 'Full-stack React app for discovering campus events. 500+ active users.', file_url: 'https://placehold.co/800x600/e0ddd5/1a1a1a?text=Events+App', file_type: 'image/png', tags: ['react', 'nodejs', 'postgres'] },
    ],
  })
  console.log('✅ Created portfolio items')

  // ── Notifications ─────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { user_id: alex.id, type: 'MATCH', title: 'New skill match!', body: 'Priya Sharma wants to exchange React lessons for Figma design skills.', link: `/skills/${skills[3].id}`, is_read: false },
      { user_id: priya.id, type: 'EXCHANGE', title: 'Exchange accepted!', body: 'Alex Chen accepted your skill exchange proposal.', link: `/exchanges/${exchange1.id}`, is_read: true },
      { user_id: james.id, type: 'REVIEW', title: 'New review received!', body: 'Sofia Alvarez left you a 5-star review.', link: `/profile/jamespark`, is_read: false },
    ],
  })
  console.log('✅ Created notifications')

  console.log('\n🎉 Seed complete!')
  console.log('📧 Test accounts (password: Password123!):')
  users.forEach(u => console.log(`   ${u.email} → @${u.username}`))
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
