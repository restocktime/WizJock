# Admin Dashboard Deployment Guide

## Overview
The admin dashboard needs to be deployed separately from the client portal to `admin.wizjock.com`.

## Deployment Steps

### 1. Create New Vercel Project for Admin Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `restocktime/WizJock`
4. Configure the project:
   - **Project Name:** `wizjock-admin`
   - **Framework Preset:** Other
   - **Root Directory:** Leave as `.` (root) - DO NOT change this!
   - The `vercel.json` in `packages/admin-dashboard/` will handle the build

### 2. Configure Environment Variables

In the Vercel project settings, add:

```
VITE_API_URL=https://api.wizjock.com
```

(Or your backend API URL)

### 3. Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add domain: `admin.wizjock.com`
3. Follow Vercel's instructions to add DNS records:
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com`

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Verify at `https://admin.wizjock.com`

## DNS Configuration

Add this record to your domain provider (e.g., Namecheap, GoDaddy, Cloudflare):

```
Type: CNAME
Host: admin
Value: cname.vercel-dns.com
TTL: Automatic or 3600
```

## Testing

After deployment:

1. Visit `https://wizjock.com/admin-login`
2. Should redirect to `https://admin.wizjock.com`
3. Login with: `admin@example.com` / `admin123`

## Current Setup

- **Client Portal:** `wizjock.com` (already deployed)
- **Admin Dashboard:** `admin.wizjock.com` (needs deployment)
- **Backend API:** Needs separate deployment (see backend deployment guide)

## Files Modified

1. `packages/admin-dashboard/vercel.json` - Created Vercel config
2. `packages/client-portal/src/pages/AdminLogin.tsx` - Updated redirect URL

## Next Steps

1. Deploy admin dashboard to Vercel
2. Configure `admin.wizjock.com` subdomain
3. Update backend CORS to allow `admin.wizjock.com`
4. Test the full flow
