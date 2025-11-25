# 🚀 Backend Deployment Guide

You need to deploy the backend to get a URL for `VITE_API_URL`.

## Step 1: Create Database & Redis (Required)

Since Vercel doesn't host databases, you need:

1.  **PostgreSQL Database** (e.g., [Neon](https://neon.tech) or [Supabase](https://supabase.com))
    *   Create a project.
    *   Get the **Connection String** (looks like `postgres://user:pass@host/db`).
2.  **Redis** (e.g., [Upstash](https://upstash.com))
    *   Create a Redis database.
    *   Get the **Redis URL** (looks like `redis://default:pass@host:port`).

## Step 2: Deploy Backend to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  **Add New Project** → Select `restocktime/WizJock`.
3.  Configure:
    *   **Project Name:** `wizjock-backend`
    *   **Root Directory:** `packages/backend`
    *   **Framework Preset:** Other
    *   **Build Command:** `npm install && npm run build` (or leave default if it detects correctly)
    *   **Output Directory:** `dist` (or default)
4.  **Environment Variables** (Add these!):
    *   `DATABASE_URL`: (Your Postgres URL from Step 1)
    *   `REDIS_URL`: (Your Redis URL from Step 1)
    *   `JWT_SECRET`: (Generate a random string, e.g., `my-super-secret-key-123`)
    *   `CORS_ORIGIN`: `https://admin.wizjock.com,https://wizjock.com`
    *   `NODE_ENV`: `production`

5.  **Deploy**.

## Step 3: Get Your Backend URL

Once deployed, Vercel will give you a URL (e.g., `https://wizjock-backend.vercel.app`).

## Step 4: Update Admin Dashboard

1.  Go to your **Admin Dashboard Project** in Vercel (`wizjock-admin`).
2.  Settings → Environment Variables.
3.  Set `VITE_API_URL` to your **Backend URL** (e.g., `https://wizjock-backend.vercel.app`).
4.  **Redeploy** the Admin Dashboard.

## Step 5: Initialize Database

After deployment, you need to set up the database tables and admin user.

1.  Get your **Database Connection String**.
2.  Run this command locally on your machine:
    ```bash
    DATABASE_URL="your-postgres-url" npm run migrate --prefix packages/backend
    DATABASE_URL="your-postgres-url" npm run seed --prefix packages/backend
    ```
    (Replace `your-postgres-url` with the actual URL).

Now you can log in with `admin@wizjock.com` / `IBY94$`.
