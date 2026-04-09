# 🚀 Bartr --- Skill Exchange Platform

## 🧱 System Architecture

Frontend (React) ↓ Backend API (Express) ↓ Database (PostgreSQL)

-   Socket.IO for real-time chat

------------------------------------------------------------------------

## 📁 Project Structure

bartr/ │ ├── client/ \# Frontend (React + Vite) │ ├── src/ │ │ ├── api/\
│ │ ├── components/\
│ │ ├── pages/\
│ │ ├── hooks/\
│ │ ├── context/\
│ │ ├── store/\
│ │ ├── utils/\
│ │ ├── App.jsx │ │ └── main.jsx │ │ │ └── index.html │ ├── server/\
│ ├── src/ │ │ ├── routes/\
│ │ ├── controllers/\
│ │ ├── middleware/\
│ │ ├── db/\
│ │ ├── sockets/\
│ │ ├── utils/\
│ │ ├── app.js │ │ └── server.js │ │ │ └── .env │ ├── .gitignore ├──
package.json └── README.md

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### Clone Repository

git clone https://github.com/your-username/bartr.git\
cd bartr

### Backend Setup

cd server\
npm install

.env: PORT=5000\
DATABASE_URL=postgresql://username:password@localhost:5432/bartr\
JWT_SECRET=your_secret_key

Run: npm run dev

### Frontend Setup

cd client\
npm install\
npm run dev

------------------------------------------------------------------------

## 🔌 API Overview

POST /api/auth/register\
POST /api/auth/login\
GET /api/users/profile\
POST /api/exchanges\
GET /api/exchanges

------------------------------------------------------------------------

## ⭐ Support

Star the repo 🚀
