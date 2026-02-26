# Prims Trade – Backend

Node.js + TypeScript microservices: **API Gateway**, **Auth**, **User**, **Trade Signal**. MongoDB (Mongoose), JWT (access + refresh), Zod, Helmet, rate limiting, Swagger, Cloudinary upload.

---

## Project structure

```
backend/
  shared/               → ApiError, response helpers, logger, JWT, validators, middlewares
  api-gateway/          → Port 3000 – proxy, rate limit, Helmet, CORS, /health, /api-docs, /upload
  auth-service/         → Port 3001 – register, login, refresh
  user-service/         → Port 3002 – GET/PATCH /users/me
  trade-signal-service/ → Port 3003 – trade signals + discussions CRUD
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Docker)
- (Optional) Redis for caching
- (Optional) Cloudinary for image uploads

---

## Setup

### 1. Install

```bash
cd backend && npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env`: set `JWT_SECRET`, `MONGODB_URI`. Add `CLOUDINARY_*` for image uploads.

### 3. Build shared package

```bash
npm run build:shared
```

### 4. Run all services

```bash
npm run dev
```

Or from repo root: `npm run dev:backend`.

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:3000 |
| Auth | http://localhost:3001 |
| User | http://localhost:3002 |
| Trade Signal | http://localhost:3003 |

**All client requests go to the gateway:** http://localhost:3000

---

## API reference (base: `/api/v1`)

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Body: `email`, `password`, optional `name`, `role` |
| POST | /auth/login | Body: `email`, `password` → `accessToken`, `refreshToken`, `user` |
| POST | /auth/refresh | Body: `refreshToken` → new tokens |

### Users (Bearer token required)

| Method | Path | Description |
|--------|------|-------------|
| GET | /users/me | Current user profile |
| PATCH | /users/me | Update `name` only (email is read-only) |

### Trade signals

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /trade-signals/public | No | List approved signals |
| GET | /trade-signals | Yes | List my signals |
| GET | /trade-signals/admin | Admin | List all signals |
| POST | /trade-signals | Yes | Create signal |
| GET | /trade-signals/:id | Yes | Get one |
| PATCH | /trade-signals/:id | Yes | Update (owner) |
| PATCH | /trade-signals/:id/status | Admin | Approve/reject |
| DELETE | /trade-signals/:id | Yes | Delete (owner or admin) |

Create body: `asset`, `entryPrice`, `stopLoss`, `takeProfit`, `timeframe`, `rationale`, optional `imageUrl`.

### Discussions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /discussions | No | List all |
| GET | /discussions/:id | No | Get one with comments |
| POST | /discussions | Yes | Create |
| PATCH | /discussions/:id | Yes | Update (owner or admin) |
| DELETE | /discussions/:id | Yes | Delete (owner or admin) |
| POST | /discussions/:id/comments | Yes | Add comment |
| DELETE | /discussions/:id/comments/:commentId | Yes | Delete comment (owner or admin) |

### Upload

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /upload/image | Yes | Multipart `image` file → Cloudinary URL |

---

## Quick test (curl)

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","name":"Admin","role":"admin"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Use returned accessToken
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/v1/users/me
curl http://localhost:3000/api/v1/trade-signals/public
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/v1/trade-signals
curl http://localhost:3000/api/v1/discussions
```

---

## Docker

```bash
cd backend
# Ensure .env has JWT_SECRET, CLOUDINARY_* (optional)
docker-compose up -d
```

- Gateway: http://localhost:3000  
- Health: http://localhost:3000/health  
- Swagger: http://localhost:3000/api-docs  

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run all 4 services |
| `npm run build` | Build all workspaces |
| `npm run build:shared` | Build shared only |
| `npm run docker:up` | `docker-compose up -d` |
| `npm run docker:down` | `docker-compose down` |
