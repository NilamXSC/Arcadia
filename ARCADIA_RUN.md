# Arcadia – How to Run

Full-stack app: **Arcadia** (Smart Cities & Healthcare) with React frontend, Node/Express backend, MongoDB, and local AI.

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (e.g. `mongod` on default port 27017), or a remote URI

---

## 1. Backend (API + DB)

```bash
cd server
npm install
```

Create `server/.env` (optional; defaults work for local dev):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/arcadia
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
```

Seed the database (run once):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

- API: **http://localhost:5000**
- Health: **http://localhost:5000/api/health**
- Default seed user: **admin@arcadia.dev** / **admin123** (or register a new user)

---

## 2. Frontend (React + Vite)

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

- App: **http://localhost:5173**
- Vite proxies `/api` to `http://localhost:5000`, so the frontend talks to the backend automatically.

---

## 3. Quick test

1. Open **http://localhost:5173**
2. Click **Get Started** or **Register** and create an account (or use **admin@arcadia.dev** / **admin123**).
3. After login you’ll see **Dashboard**, **Patients**, **AI Assistant**, **Settings**.
4. **AI Assistant**: try e.g.  
   - “Tell me about patient Arjun”  
   - “What condition does Priya have?”  
   - “Summarize health trends from the dashboard”

---

## Summary of what’s included

| Layer        | Stack / Features |
|-------------|------------------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, React Router. Landing, Login, Register, Dashboard (bento grid, carousel), Patients list + detail (accordion, breadcrumbs), AI Assistant (chat), Settings. |
| **Backend**  | Node.js, Express, JWT auth, MVC-style (routes, controllers, models, middleware). Auth (register, login, me, refresh), Patients CRUD, Dashboard analytics, AI chat. |
| **Database** | MongoDB (Mongoose). Users, Patients (with vitals, reports, conditions). Seed script with 11 dummy patients. |
| **AI**       | Local only: loads patient + dashboard data, retrieval + context, answers questions about patients and dashboard; no paid APIs. |

---

## Scripts reference

| Where   | Command        | Purpose                |
|---------|----------------|------------------------|
| `server` | `npm run dev`  | Start API (with watch)  |
| `server` | `npm run seed` | Seed DB (patients + admin user) |
| `server` | `npm start`    | Start API (no watch)    |
| `client` | `npm run dev`  | Start Vite dev server   |
| `client` | `npm run build`| Production build        |

Ensure MongoDB is running before `npm run seed` or `npm run dev` in `server`.
