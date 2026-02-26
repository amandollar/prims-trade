# Deploy Backend as Individual Services on Render

## Prerequisites

1. **MongoDB Atlas** – Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas). Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/prims-trade`
2. **GitHub** – Push your code to a GitHub repo
3. **Render account** – [render.com](https://render.com)
4. **JWT_SECRET** – Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Order of deployment

Deploy **Auth**, **User**, and **Trade Signal** first. Deploy **API Gateway** last (it needs their URLs).

---

## Step 1: Auth Service

1. Render Dashboard → **New** → **Web Service**
2. Connect GitHub repo, select your repo
3. Configure:
   - **Name:** `prims-trade-auth`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build -w shared && npm run build -w auth-service`
   - **Start Command:** `node auth-service/dist/server.js`
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = your generated secret
   - `JWT_ACCESS_EXPIRY` = `15m`
   - `JWT_REFRESH_EXPIRY` = `7d`
5. Create Web Service. Deploy.
6. Copy the URL (e.g. `https://prims-trade-auth.onrender.com`)

---

## Step 2: User Service

1. **New** → **Web Service** → same repo
2. Configure:
   - **Name:** `prims-trade-user`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build -w shared && npm run build -w user-service`
   - **Start Command:** `node user-service/dist/server.js`
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = same MongoDB Atlas URI
4. Create Web Service. Deploy.
5. Copy the URL (e.g. `https://prims-trade-user.onrender.com`)

---

## Step 3: Trade Signal Service

1. **New** → **Web Service** → same repo
2. Configure:
   - **Name:** `prims-trade-trade-signal`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build -w shared && npm run build -w trade-signal-service`
   - **Start Command:** `node trade-signal-service/dist/server.js`
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = same MongoDB Atlas URI
   - `REDIS_ENABLED` = `false`
4. Create Web Service. Deploy.
5. Copy the URL (e.g. `https://prims-trade-trade-signal.onrender.com`)

---

## Step 4: API Gateway (last)

1. **New** → **Web Service** → same repo
2. Configure:
   - **Name:** `prims-trade-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build -w shared && npm run build -w api-gateway`
   - **Start Command:** `node api-gateway/dist/server.js`
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = same value as Auth service
   - `AUTH_SERVICE_URL` = `https://prims-trade-auth.onrender.com` (your Auth URL)
   - `USER_SERVICE_URL` = `https://prims-trade-user.onrender.com` (your User URL)
   - `TRADE_SIGNAL_SERVICE_URL` = `https://prims-trade-trade-signal.onrender.com` (your Trade Signal URL)
   - `CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` = your Cloudinary API key
   - `CLOUDINARY_API_SECRET` = your Cloudinary API secret
   - `CORS_ORIGIN` = your frontend URL (e.g. `https://your-app.vercel.app`) – add after deploying frontend
4. Create Web Service. Deploy.
5. Copy the URL (e.g. `https://prims-trade-api.onrender.com`) – **this is your main API URL**

---

## Frontend (Vercel)

1. Set `NEXT_PUBLIC_API_URL` = `https://prims-trade-api.onrender.com` (your Gateway URL)
2. Deploy frontend to Vercel
3. In Render, edit API Gateway env: add `CORS_ORIGIN` = your Vercel URL (e.g. `https://prims-trade.vercel.app`)

---

## Verify

- **Health:** `https://prims-trade-api.onrender.com/health`
- **Swagger:** `https://prims-trade-api.onrender.com/api-docs`
