# Admin Dashboard Login Fix

## Problem
The admin dashboard at admin.wizjock.com cannot connect to the backend API because the `VITE_API_URL` environment variable is not configured.

## Solution

### Option 1: Set Environment Variable on Vercel (Recommended)

1. Go to your Vercel dashboard
2. Select the **wizjock-admin** project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-api-url.com` (replace with your actual backend URL)
   - **Environment**: Production, Preview, Development (check all)
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **...** menu on the latest deployment
8. Click **Redeploy**

### Option 2: Update Code to Use Production URL

If you don't have access to environment variables, I can update the code to hardcode the production API URL.

## What Backend URL Should You Use?

Your backend API should be deployed somewhere. Common options:
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`
- Custom domain: `https://api.wizjock.com`

**Please provide your backend API URL so I can configure it properly.**

## Quick Test

To verify your backend is running, try visiting:
`https://your-backend-url.com/api/health` or `/api/status`

It should return a response indicating the server is running.
