# Prims Trade

A full-stack trade signals platform: create, share, and get community-approved trade setups. Includes discussion forum, image uploads for charts, and admin approval workflow.

**Stack:** Backend (Node.js + TypeScript microservices: API Gateway, Auth, User, Trade Signal) + Frontend (Next.js 14 + Tailwind CSS)

## Architecture

![Prims Trade Architecture](architecture.png)

---

## Features

| Area | Description |
|------|-------------|
| **Auth** | Register, login, JWT access + refresh tokens, session handling |
| **Trade signals** | Create signals (asset, entry/SL/TP, rationale, chart image). Public approved list. Admin approve/reject. |
| **Discussions** | Forum-style posts with comments. Create, edit, delete. |
| **Profile** | Update name. Email is read-only. |
| **Image upload** | Chart images via Cloudinary (backend upload). |
| **Admin** | Approve/reject pending signals. Manage users. |

---

## Project structure

```
prims-trade/
├── backend/              # Node.js microservices
│   ├── package.json     # Workspaces: shared, api-gateway, auth, user, trade-signal
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── env-loader.js    # Loads .env before services start
│   ├── shared/          # Errors, logger, JWT, validators, middlewares
│   ├── api-gateway/     # Port 3000 – proxy, rate limit, Helmet, CORS, Swagger, upload
│   ├── auth-service/    # Port 3001 – register, login, refresh
│   ├── user-service/    # Port 3002 – GET/PATCH /users/me
│   └── trade-signal-service/  # Port 3003 – signals + discussions CRUD
│
└── frontend/            # Next.js 14 + Tailwind
    ├── package.json
    ├── app/             # Pages: home, login, register, dashboard, profile, trade-signals, discussions
    ├── components/
    ├── lib/             # API client, auth context, types
    └── public/          # Static assets (charts, etc.)
```

---

## Prerequisites

- **Node.js 18+**
- **MongoDB** (local or Docker)
- (Optional) **Redis** for caching
- (Optional) **Cloudinary** account for image uploads

---

## Quick start

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set JWT_SECRET (required), MONGODB_URI, CLOUDINARY_* (for image upload)
npm run build:shared
npm run dev
```

- **API Gateway:** http://localhost:3000  
- **Swagger:** http://localhost:3000/api-docs  
- **Health:** http://localhost:3000/health  

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000 (default)
npm run dev
```

- **App:** http://localhost:3001  

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret for signing tokens. Use a strong random string in production. |
| `MONGODB_URI` | Yes | MongoDB connection string. Default: `mongodb://localhost:27017/prims-trade` |
| `CLOUDINARY_CLOUD_NAME` | For upload | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For upload | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For upload | Cloudinary API secret |
| `JWT_ACCESS_EXPIRY` | No | `15m` default |
| `JWT_REFRESH_EXPIRY` | No | `7d` default |
| `CORS_ORIGIN` | Production | Frontend origin (e.g. `https://yourdomain.com`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g. `http://localhost:3000`) |

---

## Deployment checklist

Before deploying:

1. **JWT_SECRET** – Generate a strong secret:  
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. **MONGODB_URI** – Use MongoDB Atlas or managed MongoDB.
3. **NODE_ENV** – Set to `production`.
4. **CORS_ORIGIN** – Set to your frontend URL.
5. **CLOUDINARY** – Add credentials for image uploads.
6. **Frontend** – Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

### Docker

```bash
cd backend
# Create .env with JWT_SECRET, CLOUDINARY_*, etc.
docker-compose up -d
```

- Gateway: http://localhost:3000  
- Health: http://localhost:3000/health  

### Frontend (Vercel / Netlify)

1. Build: `npm run build`
2. Set `NEXT_PUBLIC_API_URL` in the hosting platform.
3. Deploy.

---

## API overview

All requests go through the **API Gateway** at `/api/v1`.

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` |
| **Users** | `GET /users/me`, `PATCH /users/me` (Bearer token) |
| **Trade signals** | `GET /trade-signals/public` (no auth), `GET/POST /trade-signals`, `GET/PATCH/DELETE /trade-signals/:id`, `PATCH /trade-signals/:id/status` (admin) |
| **Discussions** | `GET /discussions`, `GET /discussions/:id`, `POST /discussions`, `PATCH/DELETE /discussions/:id`, `POST /discussions/:id/comments`, `DELETE /discussions/:id/comments/:commentId` |
| **Upload** | `POST /upload/image` (Bearer token, multipart) |

---

## Evaluation notes

For reviewers:

- **Auth:** Register with any email. First user can register with `role: admin` for admin features.
- **Signals:** Create a signal → appears as pending → admin approves. Approved signals show on `/trade-signals`.
- **Discussions:** Public to read. Login required to create posts and comments.
- **Image upload:** Requires Cloudinary config. Without it, uploads return a clear error.
- **Token refresh:** Access tokens expire in 15m. Refresh is automatic; if refresh fails, user is logged out.

---

## Root scripts

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install backend + frontend |
| `npm run dev:backend` | Run all backend services |
| `npm run dev:frontend` | Run Next.js dev server |
| `npm run build:backend` | Build all backend workspaces |
| `npm run build:frontend` | Build frontend for production |

---

## Docs

- **[backend/README.md](backend/README.md)** – Full API, Docker, scripts
- **[frontend/README.md](frontend/README.md)** – Frontend features and setup
