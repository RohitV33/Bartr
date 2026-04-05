# Bartr — Student Skill Exchange Platform

A platform where students can exchange skills instead of money.

The idea is simple — if you know something, you can trade it with someone who knows something else.

---

## 💡 Why I built this

Most students don’t have money to pay for courses or services, but they do have skills.

So I built Bartr to solve that — a place where:

* a designer can trade with a developer
* a video editor can trade with a writer
* and so on

---

## ⚙️ Tech Stack

* Frontend: React + Tailwind
* Backend: Node.js + Express
* Database: PostgreSQL
* Real-time: Socket.io

---

## 📂 Project Structure

```id="v9d92k"
frontend/ → UI (React app)
backend/  → API + database + sockets
```

---

## 🚀 How to run locally

### 1. Install dependencies

```bash id="h1m8px"
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Setup database

Create a PostgreSQL database:

```bash id="tq7u3p"
CREATE DATABASE bartr;
```

Then run schema file:

```bash id="h6q9tw"
psql -U postgres -d bartr -f backend/config/schema.sql
```

---

### 3. Setup environment variables

Create `.env` in backend:

```env id="h5nsj2"
PORT=5000
DB_NAME=bartr
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
```

Frontend `.env`:

```env id="7shg2x"
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 4. Run the project

```bash id="2yk7dj"
# backend
cd backend && npm run dev

# frontend
cd frontend && npm start
```

---

## 🔥 Features

* User authentication (signup/login)
* Create and browse skill listings
* Send barter requests
* Accept / reject trades
* Real-time chat between users
* Profile system
* Reviews & ratings
* Notifications

---

## 🧠 How it works (simple)

1. User creates a listing (what they offer & need)
2. Another user sends a barter request
3. Both users can chat
4. Once agreed → trade happens
5. Users leave reviews

---

## ⚠️ Note

This is a student project and still under development.
Some features might not be fully optimized yet.

---

## 📌 Future plans

* Better matching system
* Mobile version
* UI improvements
* Performance optimization

---

## ⭐ Support

If you like the idea, feel free to star the repo or suggest improvements.
