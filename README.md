<div align="center">

# 🔄 Bartr

### *Trade Skills. Not Money.*

**A student-focused skill exchange platform where knowledge is the currency.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)](https://github.com)

</div>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Overview](#-api-overview)
- [Future Enhancements](#-future-enhancements)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Support](#-support)

---

## 🚨 Problem Statement

Students possess a wide range of skills — from coding and design to music, writing, and language — but rarely have the financial means to pay for tutoring, freelancers, or professional services.

At the same time, platforms like Fiverr or Upwork are **money-driven**, making them inaccessible to students who want to learn or get help without spending cash.

> **The gap:** Students have skills others need, but no efficient, trust-based system to exchange them.

---

## 💡 Solution

**Bartr** is a barter-based skill exchange platform built for students. Instead of money, users trade what they know.

- A developer teaches Python → gets design lessons in return.
- A musician offers guitar classes → learns web development.
- A writer proofreads essays → receives math tutoring.

Bartr facilitates these exchanges through a structured request system, real-time chat, and user profiles — all within a clean, intuitive interface.

---

## ✨ Features

### 🔐 Authentication
- Secure **JWT-based** login and registration
- Passwords hashed with **bcrypt**
- Protected routes on both frontend and backend

### 👤 User Profiles
- List **skills you can offer**
- List **skills you want to learn**
- Public profiles viewable by other users

### 🤝 Skill Exchange System
- **Send** exchange requests to other users
- **Accept or Reject** incoming requests
- Track the status of all your exchanges from a central dashboard

### 💬 Real-Time Chat
- Powered by **Socket.IO**
- Chat opens automatically once an exchange is accepted
- Instant message delivery between matched users

### 📊 Dashboard
- Overview of all active, pending, and completed exchanges
- Quick access to conversations and user profiles

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **PostgreSQL** | Relational database |
| **pg** | PostgreSQL client for Node.js |
| **JWT** | Stateless authentication |
| **bcrypt** | Password hashing |
| **Socket.IO** | Real-time bidirectional communication |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| **React.js (Vite)** | UI library with fast dev tooling |
| **Tailwind CSS** | Utility-first styling |
| **TanStack Query** | Server-state management & caching |
| **React Router** | Client-side routing |
| **Framer Motion** | Animations and transitions |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│   ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│   │  Pages & │  │  TanStack    │  │   Socket.IO Client  │  │
│   │Components│  │    Query     │  │  (Real-time Chat)   │  │
│   └────┬─────┘  └──────┬───────┘  └──────────┬──────────┘  │
└────────┼───────────────┼─────────────────────┼─────────────┘
         │ HTTP/REST     │ HTTP/REST            │ WebSocket
         ▼               ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Express.js)                      │
│   ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│   │  Routes  │  │  Middleware  │  │   Socket.IO Server  │  │
│   │& Controllers  │ JWT Auth  │  │   (Chat Handler)    │  │
│   └────┬─────┘  └──────────────┘  └─────────────────────┘  │
└────────┼────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  PostgreSQL Database │
│  ┌───────────────┐  │
│  │     Users     │  │
│  │   Exchanges   │  │
│  │   Messages    │  │
│  │     Skills    │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 📁 Project Structure

```
bartr/
│
├── client/                         # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Images, icons, static files
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── ExchangeCard.jsx
│   │   │   └── ChatWindow.jsx
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Chat.jsx
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── api/                    # Axios API call functions
│   │   ├── context/                # Auth context / global state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                         # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                   # PostgreSQL connection (pg pool)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── exchangeController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── exchangeRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/
│   │   └── socketHandler.js        # Socket.IO event handlers
│   ├── .env
│   └── index.js                    # Entry point
│
├── .gitignore
├── README.md
└── package.json                    # Root-level scripts (optional monorepo)
```

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/rohitv33/bartr.git
cd bartr
```

---

### 2. Setup the Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/bartr_db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Initialize the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U your_user

# Create the database
CREATE DATABASE bartr_db;
\q
```

Run the SQL schema (if a schema file is provided):

```bash
psql -U your_user -d bartr_db -f schema.sql
```

Start the backend server:

```bash
npm run dev
```

> Server will run at `http://localhost:5000`

---

### 3. Setup the Frontend (Client)

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

> Client will run at `http://localhost:5173`

---

### 4. You're All Set! 🎉

Open your browser and navigate to `http://localhost:5173` to start using Bartr locally.

---

## 📡 API Overview

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/users` | Get all users (browse) | ✅ |
| `GET` | `/api/users/:id` | Get a user's public profile | ✅ |
| `PUT` | `/api/users/:id` | Update own profile & skills | ✅ |

### Exchanges

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/exchanges` | Send an exchange request | ✅ |
| `GET` | `/api/exchanges` | Get all exchanges for current user | ✅ |
| `PUT` | `/api/exchanges/:id` | Accept or reject a request | ✅ |
| `DELETE` | `/api/exchanges/:id` | Cancel/delete an exchange | ✅ |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/messages/:exchangeId` | Get message history | ✅ |
| `POST` | `/api/messages` | Send a message (REST fallback) | ✅ |

> 💡 Real-time messaging is handled via **Socket.IO events**, not REST. REST endpoints serve as history loaders.

---

## 🔮 Future Enhancements

- [ ] 🌟 **Reputation & Rating System** — Rate users after a completed exchange
- [ ] 🔔 **Push Notifications** — In-app and email alerts for exchange activity
- [ ] 🔍 **Advanced Search & Filters** — Search by skill, availability, or rating
- [ ] 📅 **Session Scheduling** — Book time slots for skill sessions
- [ ] 🎥 **Video Call Integration** — Built-in video sessions (WebRTC)
- [ ] 🧠 **AI Skill Matching** — Smart suggestions based on your profile
- [ ] 📱 **Mobile App** — React Native version for iOS and Android
- [ ] 🏫 **College Verification** — Verify student status via email domain

---

## 🌐 Deployment

### Backend (Render / Railway)

1. Push your `server/` code to GitHub
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables matching your `.env` file
4. Set the start command to:
   ```bash
   node index.js
   ```

### Frontend (Vercel / Netlify)

1. Push your `client/` code to GitHub
2. Connect the repo to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Set the environment variables (`VITE_API_BASE_URL`, `VITE_SOCKET_URL`)
4. Set the build command and output directory:
   ```bash
   # Build Command
   npm run build

   # Output Directory
   dist
   ```

### Database (Supabase / Neon / Railway PostgreSQL)

- Use [Supabase](https://supabase.com), [Neon](https://neon.tech), or Railway's PostgreSQL addon
- Replace `DATABASE_URL` in your server environment variables with the hosted connection string

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/bartr.git
   ```
3. **Create** a new feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make** your changes and commit them
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open** a Pull Request against the `main` branch

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Bartr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See the [LICENSE](./LICENSE) file for full details.

---

## 👨‍💻 Author

<div align="center">

**ROHIT VERMA**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rohitV33)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rawhit01)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://rawhit.vercel.app)

*Built with curiosity, caffeine, and the belief that knowledge should be shared freely.*

</div>

---

## ⭐ Support

If you found **Bartr** useful or interesting, please consider:

- ⭐ **Starring** this repository — it helps more people discover the project!
- 🍴 **Forking** it to build your own version
- 🐛 **Opening an issue** if you find a bug or have a suggestion
- 📢 **Sharing** it with fellow students and developers

```
Every star motivates one more feature. 🚀
```

---

<div align="center">

Made with ❤️ by [Rohit Verma](https://github.com/rohitv33) &nbsp;|&nbsp; MIT License &nbsp;|&nbsp; Bartr © 2025

</div>
