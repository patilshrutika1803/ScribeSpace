# ScribeSpace 🧠✨

A mental wellness & journaling platform designed for daily reflection, mood tracking, and focus management—built to feel calm, private, and rewarding.

<p align="center">
  <img src="https://img.shields.io/badge/Build-React%20%2B%20Node%20%2B%20MongoDB-6E56CF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-badge?style=for-the-badge" />
  <img src="https://img.shields.io/badge/UI-Dark%20Theme-brightgreen?style=for-the-badge" />
</p>

---

## 🧭 Project Overview!!

**ScribeSpace** helps you turn your thoughts into steady progress.

- **Mental wellness & journaling**: create entries, tag them with a mood, and revisit patterns.
- **Mood tracking**: log how you feel and review trends over time.
- **Focus management**: run guided focus sessions with ambient modes to support productivity.

The application is built for **personal reflection**—keeping your experience organized, searchable, and easy to act on.

---

## ✅ Features Implemented

### Authentication & Access Control
- **User Authentication** (Register/Login)
- **JWT Authentication**
- **Protected Routes** (role-based: user/admin)

### Journaling
- **Journal Creation** ✍️
- **Journal Viewing**
- **Journal Search** 🔎
- **Journal Mood Filtering** 😌
- **Journal Editing** ✏️ *(currently under testing)*

### Wellness & Tracking
- **Mood Tracking** 😭🙂
- Mood history with dashboard-ready stats

### Focus Sessions
- **Focus Sessions** ⏳
- Session timer + ambient modes

### UI & UX
- **Responsive UI** 📱
- **Dark Theme Interface** 🌙

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **Vite**
- **React Router**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB Atlas**
- **Mongoose**

### Authentication & Security
- **JWT**
- **bcrypt**

### Email
- **Resend** (verification system exists but is currently disabled until custom domain configuration)

---

## 📁 Project Structure

```text
ScribeSpace/
├─ frontend/
│  ├─ src/
│  │  ├─ pages/                 # Route pages (Dashboard, Journal, Mood, Focus)
│  │  ├─ components/           # Reusable UI components
│  │  ├─ context/              # Auth + Theme context
│  │  ├─ routes/               # App routing
│  │  └─ utils/                # API + storage helpers
│  ├─ public/
│  └─ package.json
│
└─ backend/
   ├─ controllers/             # Auth, Journal, Mood, Focus logic
   ├─ routes/                  # Express route definitions
   ├─ models/                  # Mongoose schemas (User, Journal, Mood, FocusSession)
   ├─ middleware/              # Auth middleware (JWT)
   ├─ utils/                   # Email utilities (Resend)
   ├─ config/                  # Database configuration
   ├─ server.js                # Server entry point
   └─ package.json
```

---

## 🚀 Installation Guide

### 1) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Environment variable(s):**
- `VITE_API_URL` — Base URL of the backend API (defaults to `http://localhost:5000/api`).

Example:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 2) Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Environment variable(s):**
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret used to sign JWT tokens
- `RESEND_API_KEY` — Resend API key (email verification; currently disabled)
- `EMAIL_FROM` — Sender email for verification system
- `CLIENT_URL` — Frontend origin for verification links / CORS

Example:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
EMAIL_FROM=your_email@domain.com
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Overview (High Level)

> All endpoints require **JWT** for authenticated user access unless stated otherwise.

### Auth APIs
- `POST /auth/register` — Register a new account
- `POST /auth/login` — Login and receive JWT

### Journal APIs
- `POST /journal` — Create journal entry
- `GET /journal` — List your entries (supports `search` + `mood` query params)
- `PUT /journal/:id` — Update an entry *(under testing)*
- `DELETE /journal/:id` — Delete an entry

### Mood APIs
- `GET /mood` — Retrieve mood history
- `POST /mood` — Add a mood log

### Focus APIs
- `POST /focus` — Create a focus session completion
- `GET /focus/total` — Retrieve aggregated focus stats

---

## 📌 Current Development Status

- **Email verification exists but is temporarily disabled** until **custom domain configuration** is completed.
- **Journal search and mood filtering are completed** ✅
- **Journal editing is implemented but currently under testing** (UI + API flow validated; final QA ongoing).

---

## 🔮 Future Improvements

- **Activate email verification** once domain configuration is complete
- **Analytics dashboard** for deeper insights
- **Journal insights** (trend analysis by mood keywords)
- **AI-powered reflection prompts** to guide journaling
- **Better mobile responsiveness** (refine layouts for smaller screens)

---

## 🧾 Notes for Recruiters

ScribeSpace demonstrates:
- Full-stack development (React + Express)
- Secure authentication with JWT
- Data modeling with MongoDB/Mongoose
- User-focused UX with responsive dark UI
- Search/filter/edit patterns implemented in a real journaling workflow

---

If you’d like, I can also add a **Screenshots/GIF** section and a **Live Demo** badge once you share deployment details.

