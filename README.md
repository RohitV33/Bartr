# ⚡ BARTR — Student Skill Exchange Platform

> Trade skills, not cash. The modern barter economy for college students.

![Bartr](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=60)

---

## 🗂 Project Structure

```
bartr/
├── frontend/                  # React.js application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── listings/
│   │   │       └── SkillCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   └── useReveal.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── ListingForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── About.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   ├── db.js
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── listings.js
│   │   ├── barter.js
│   │   ├── chat.js
│   │   ├── reviews.js
│   │   ├── notifications.js
│   │   └── upload.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Cloudinary account (free tier works)
- npm or yarn

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/bartr.git
cd bartr

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### 2. PostgreSQL Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE bartr;"

# Run the schema
psql -U postgres -d bartr -f backend/config/schema.sql
```

---

### 3. Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
CLIENT_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bartr
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key_make_it_long_and_random

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

### 4. Seed Sample Data

```bash
cd backend
npm run db:seed
```

This creates 6 sample users (password: `password123`) and 6 skill listings.

**Sample accounts:**
| Email | Password | College |
|---|---|---|
| alice@iitd.ac.in | password123 | IIT Delhi |
| ben@nitk.edu.in | password123 | NIT Karnataka |
| chloe@bits.ac.in | password123 | BITS Pilani |
| dhruv@iimb.ac.in | password123 | IIM Bangalore |
| eva@iitm.ac.in | password123 | IIT Madras |
| farhan@du.ac.in | password123 | Delhi University |

---

### 5. Run the App

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

- Frontend: http://localhost:3000
- API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Browse listings (search, filter, paginate) |
| GET | `/api/listings/:id` | Get single listing |
| POST | `/api/listings` | Create listing (auth) |
| PUT | `/api/listings/:id` | Edit listing (auth, owner) |
| DELETE | `/api/listings/:id` | Delete listing (auth, owner) |

### Barter
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/barter` | My barter requests |
| POST | `/api/barter` | Send barter request |
| PATCH | `/api/barter/:id/status` | Accept/Reject/Cancel |
| PATCH | `/api/barter/:id/complete` | Mark your side complete |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/rooms` | My chat rooms |
| GET | `/api/chat/rooms/:id/messages` | Messages in room |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Public profile |
| PUT | `/api/users/me` | Update my profile |
| POST | `/api/users/me/skills` | Update my skills |
| POST | `/api/users/report` | Report a user |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Leave a review |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | My notifications |
| PATCH | `/api/notifications/:id/read` | Mark read |
| PATCH | `/api/notifications/read-all` | Mark all read |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload to Cloudinary |

---

## 🔌 Socket.io Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `room:join` | `roomId` | Join a chat room |
| `message:send` | `{ roomId, content }` | Send message |
| `typing:start` | `{ roomId }` | Start typing indicator |
| `typing:stop` | `{ roomId }` | Stop typing indicator |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | Message object | New message received |
| `typing:start` | `{ userId }` | Someone is typing |
| `typing:stop` | `{ userId }` | Typing stopped |
| `users:online` | `string[]` | List of online user IDs |

---

## 🗃 Database Schema Overview

```
users              — profiles, trust scores, credits
user_skills        — offered/needed skills per user
portfolio_items    — portfolio media
listings           — skill exchange listings
barter_requests    — trade proposals with status
chat_rooms         — one per barter
messages           — real-time chat messages
reviews            — post-trade ratings
notifications      — in-app alerts
reports            — user reports
credit_transactions — credit economy ledger
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#0a0a0a` | Page background |
| `--smoke` | `#1a1a1a` | Card backgrounds |
| `--accent` | `#e8ff3b` | CTAs, highlights |
| `--warm` | `#ff6b35` | Accents, gradients |
| Font Display | Bebas Neue | Headlines |
| Font Body | DM Sans | All text |
| Font Mono | JetBrains Mono | Labels, tags, code |

---

## 🌟 Features Implemented

- ✅ JWT Auth (Signup / Login / Protected routes)
- ✅ User profiles with skills & portfolio
- ✅ Skill listings (create, edit, delete, paginate)
- ✅ Search & filter (category, skill, location, keyword)
- ✅ Barter request system (send, accept, reject, complete)
- ✅ Real-time chat with Socket.io
- ✅ Typing indicators
- ✅ Online presence detection
- ✅ Rating & review system with trust score recalculation
- ✅ In-app notifications
- ✅ Credit economy (earn on trade completion)
- ✅ Cloudinary image uploads
- ✅ Report / block users
- ✅ Scroll reveal animations (GSAP + IntersectionObserver)
- ✅ Responsive design (mobile-first)
- ✅ Rate limiting & security headers (Helmet)

---

## 🔮 Roadmap

- [ ] AI skill match suggestions (OpenAI embeddings)
- [ ] College email OTP verification
- [ ] Mobile app (React Native)
- [ ] Group barters (3+ users)
- [ ] Escrow-style trade confirmation
- [ ] Leaderboard & achievement badges
- [ ] Marketplace analytics dashboard

---

## 📄 License

MIT © 2025 Bartr Team
