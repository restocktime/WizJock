# 🚂 Railway Deployment Quickstart

I have configured your codebase to be **Railway-ready**. Since I cannot access your Railway account directly, you just need to connect it.

## 1. Click to Deploy

If you have a Railway account, create a new project:

1.  Go to [Railway Dashboard](https://railway.app/dashboard).
2.  Click **"New Project"**.
3.  Select **"Deploy from GitHub repo"**.
4.  Select **`restocktime/WizJock`**.
5.  **Important:** It will automatically detect the `railway.json` file I just created and know exactly how to build your backend.

## 2. Add Database (Required)

Your backend needs a database to start.

1.  In your Railway project view, right-click (or click "New") and select **Database** → **PostgreSQL**.
2.  Also add **Redis**.

## 3. Connect Variables

Railway makes this easy.

1.  Click on your **WizJock** service (the repo you deployed).
2.  Go to **Variables**.
3.  Add these:
    *   `DATABASE_URL`: `${{PostgreSQL.DATABASE_URL}}` (Railway auto-completes this!)
    *   `REDIS_URL`: `${{Redis.REDIS_URL}}` (Railway auto-completes this!)
    *   `JWT_SECRET`: (Type any random secret string)
    *   `CORS_ORIGIN`: `https://admin.wizjock.com,https://wizjock.com`
    *   `NODE_ENV`: `production`

## 4. Get Your Backend URL

1.  Go to **Settings** tab in your service.
2.  Under **Networking**, click **"Generate Domain"**.
3.  Copy this URL (e.g., `wizjock-production.up.railway.app`).

## 5. Final Step: Connect Admin Dashboard

1.  Go back to **Vercel**.
2.  Update `VITE_API_URL` to the Railway URL you just copied.
3.  Redeploy Vercel.

## 6. Initialize Database

Once deployed, go to the Railway project, click on your service, go to **Settings** → **Deploy** → **Deploy Command** (or just use the CLI locally) to run seeds.

Or easier: Connect to the database using a tool (TablePlus) using the credentials from Railway and run the SQL manually, or run:

```bash
# Run locally to seed remote DB
DATABASE_URL="<copy-from-railway>" npm run migrate --prefix packages/backend
DATABASE_URL="<copy-from-railway>" npm run seed --prefix packages/backend
```
