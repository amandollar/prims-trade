# Prims Trade – Frontend

Next.js 14 (App Router) + Tailwind CSS. Connects to the backend API gateway at `http://localhost:3000` by default.

---

## Prerequisites

- Backend running (gateway + services)
- Node.js 18+

---

## Setup

### 1. Install

```bash
cd frontend && npm install
```

### 2. Environment

```bash
cp .env.local.example .env.local
```

Default: `NEXT_PUBLIC_API_URL=http://localhost:3000`. Change if your API runs elsewhere.

### 3. Run

```bash
npm run dev
```

Or from repo root: `npm run dev:frontend`.

Open **http://localhost:3001** (Next.js default port).

---

## Features

| Page | Description |
|------|-------------|
| **/** | Home – hero, feature cards |
| **/trade-signals** | Browse approved signals (public) |
| **/discussions** | Forum – list discussions, create, comment |
| **/login** | Log in |
| **/register** | Create account |
| **/dashboard** | My signals – create, edit, delete |
| **/dashboard/signals/new** | Create signal (with chart image upload) |
| **/dashboard/signals/[id]** | View signal |
| **/dashboard/signals/[id]/edit** | Edit signal |
| **/dashboard/admin** | Admin – approve/reject signals |
| **/profile** | Update name (email is read-only) |
| **/discussions/new** | Create discussion |
| **/discussions/[id]** | View discussion, add comments |

---

## Auth

- JWT access + refresh tokens in `localStorage`
- Automatic token refresh on 401
- Logout clears session

---

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
