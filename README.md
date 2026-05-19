# TaskFlow — Task Management App

A full-stack task management application built with **React (Vite)**, **Node.js/Express**, **MongoDB Atlas**, and **Firebase Google Authentication**.

---

## Features

- 🔐 Google Sign-In via Firebase Authentication
- ✅ Create, view, and update tasks
- 📋 Three task statuses: **Planned → In Progress → Complete**
- 👤 User-scoped tasks (users only see their own tasks)
- 🔔 Toast notifications for all actions
- 📱 Fully responsive design

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── firebase.js     # Firebase Admin SDK init
│   │   ├── middleware/
│   │   │   └── auth.js         # Token verification middleware
│   │   ├── models/
│   │   │   └── Task.js         # Mongoose Task model
│   │   ├── routes/
│   │   │   ├── auth.js         # POST /auth/google
│   │   │   └── tasks.js        # GET, POST, PATCH /tasks
│   │   └── server.js           # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.js        # Axios instance w/ interceptors
    │   ├── components/         # ProtectedRoute, TaskCard, TaskForm, Loader
    │   ├── context/            # AuthContext (Firebase state)
    │   ├── firebase/           # Firebase client config
    │   ├── pages/              # Login, Dashboard
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css           # Global styles
    ├── .env.example
    ├── index.html
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- npm v9+
- A [Firebase project](https://console.firebase.google.com/) with **Google Auth enabled**
- A [MongoDB Atlas](https://cloud.mongodb.com/) cluster

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

| Variable | Where to find it |
|---|---|
| `PORT` | Default `5000` |
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `FIREBASE_PRIVATE_KEY` | Same JSON file as above (include full key with `\n`) |
| `CLIENT_URL` | Your frontend URL, e.g., `http://localhost:5173` |

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` with your Firebase client SDK config:

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → Your Apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same |
| `VITE_FIREBASE_PROJECT_ID` | Same |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `VITE_FIREBASE_APP_ID` | Same |
| `VITE_API_URL` | Backend URL, e.g., `http://localhost:5000` |

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## REST API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check |
| `POST` | `/auth/google` | Bearer token | Verify Firebase token |
| `GET` | `/tasks` | Bearer token | Get all tasks for the user |
| `POST` | `/tasks` | Bearer token | Create a new task |
| `PATCH` | `/tasks/:id` | Bearer token | Update task status |

### Request / Response Examples

**POST /tasks**
```json
{ "title": "Fix login bug", "description": "Users can't log in on mobile" }
```

Response `201`:
```json
{ "_id": "...", "title": "Fix login bug", "status": "Planned", "userId": "...", "createdAt": "..." }
```

**PATCH /tasks/:id**
```json
{ "status": "In Progress" }
```

---

## Deployment

### Backend — Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`

### Frontend — Vercel / Netlify

1. Push code to GitHub
2. Import the `frontend/` directory on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Add all `VITE_*` environment variables in the dashboard
4. Build command: `npm run build` | Output directory: `dist`

> **Important**: After deploying the backend, update `VITE_API_URL` to your production backend URL, and update `CLIENT_URL` in the backend `.env` to your production frontend URL.

---

## Assumptions

- Each Firebase user is uniquely identified by their `uid` (stable even if email changes)
- The Firebase ID token is refreshed automatically by the Firebase SDK; the Axios interceptor handles 401s by redirecting to login
- Status flow is one-directional: `Planned → In Progress → Complete`
- All users must be authenticated; there is no guest mode

---

## Limitations

- No task deletion — tasks are permanent once created (by design, to keep scope minimal)
- No pagination — all tasks are fetched at once (suitable for personal use)
- Firebase ID tokens expire after 1 hour; long sessions redirect to login on next action
- No offline support
- Google Sign-In only — no email/password auth

---

## AI Usage Summary

This project was scaffolded and implemented with the assistance of **Antigravity (Google DeepMind)**, an AI coding assistant.

**What AI generated:**
- Full project structure and folder layout
- All backend files: Express server, Mongoose model, auth middleware, routes, Firebase Admin config
- All frontend files: React components, context, routing, Axios configuration, and CSS styling
- This README

**What was human-validated:**
- Architecture decisions (Firebase Admin SDK for token verification)
- Environment variable structure and security practices
- API design and ownership enforcement

**Modifications expected from user:**
- Filling in `.env` files with real Firebase and MongoDB credentials
- Enabling Google Auth in the Firebase console
- Whitelisting the app domain in Firebase Auth settings
