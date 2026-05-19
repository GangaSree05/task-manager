# TaskFlow — Task Management App

## Features

- 🔐 Google Sign-In via Firebase Authentication
- ✅ Create, view, and update tasks
- 📋 Three task statuses: **Planned → In Progress → Complete**
- 👤 User-scoped tasks (users only see their own tasks)
- 🔔 Toast notifications for all actions
- 📱 Fully responsive design

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
