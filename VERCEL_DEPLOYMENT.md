# Vercel Deployment Instructions

## Setup in Vercel Dashboard

1. Go to your Vercel project settings
2. Click on **Settings** → **General**
3. Find **Root Directory** section
4. Set it to: `packages/client-portal`
5. Click **Save**

## Build Settings (should auto-detect)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## After Setting Root Directory
1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment
3. The build should succeed!

## What This Does
- Tells Vercel to treat `packages/client-portal` as the project root
- Avoids installing the monorepo dependencies
- Only builds the landing page

Your site will be live at your Vercel URL!
