# 🚀 Quick Fix: Deploy Admin Dashboard to Vercel

## The Problem
The admin dashboard has a dependency on `@sportsbook/shared-types` which is a local workspace package. Vercel needs special configuration to handle monorepo workspaces.

## Solution: Deploy from Vercel Dashboard

### Step 1: Create New Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your repository: **`restocktime/WizJock`**

### Step 2: Configure Build Settings

**IMPORTANT:** Use these exact settings:

- **Project Name:** `wizjock-admin` (or any name you prefer)
- **Framework Preset:** **Other**
- **Root Directory:** `.` (leave as root - don't change!)
- **Build Command:** 
  ```bash
  npm install && npm run build --workspace=packages/shared-types && npm run build --workspace=packages/admin-dashboard
  ```
- **Output Directory:** 
  ```
  packages/admin-dashboard/dist
  ```
- **Install Command:**
  ```bash
  npm install
  ```

### Step 3: Add Environment Variables (Optional)

If you have a backend API deployed, add:
```
VITE_API_URL=https://your-api-url.com
```

Otherwise, skip this for now.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (should take 2-3 minutes)
3. Once deployed, you'll get a URL like `wizjock-admin.vercel.app`

### Step 5: Add Custom Domain

1. In your Vercel project, go to **Settings** → **Domains**
2. Add domain: `admin.wizjock.com`
3. Vercel will show you DNS records to add
4. Go to your domain provider (Namecheap, GoDaddy, etc.)
5. Add this DNS record:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   TTL: Auto or 3600
   ```
6. Wait 5-10 minutes for DNS to propagate

### Step 6: Test

1. Visit `https://wizjock.com/admin-login`
2. Should redirect to `https://admin.wizjock.com`
3. Login with: `admin@example.com` / `admin123`

## Alternative: Use Vercel CLI (Advanced)

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd "/Users/iby/Desktop/IBY Picks"
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Set build command as shown above
# - Set output directory: packages/admin-dashboard/dist
```

## Troubleshooting

### Build fails with "shared-types not found"
- Make sure you're building from the **root directory** (`.`)
- Make sure the build command includes building shared-types first

### 404 errors after deployment
- Check that output directory is set to `packages/admin-dashboard/dist`
- Verify the `rewrites` in vercel.json are working

### Can't access admin.wizjock.com
- DNS can take up to 24 hours to propagate (usually 5-10 minutes)
- Verify CNAME record is correct in your domain provider
- Try accessing the vercel.app URL first to confirm deployment works

## Current Status

✅ Code pushed to GitHub
✅ Vercel configuration files created
⏳ Waiting for you to deploy via Vercel dashboard

Once deployed, the flow will be:
1. User visits `wizjock.com/admin-login`
2. Redirects to `admin.wizjock.com`
3. Shows admin login page
4. User logs in with credentials
