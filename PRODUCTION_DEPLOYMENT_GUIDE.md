# Production Deployment Guide

This guide walks you through deploying the WizJock landing page to production.

## Overview

The WizJock application consists of two main components:
1. **Frontend (client-portal)** - React landing page → Deploy to Vercel
2. **Backend (API)** - Node.js/Express API → Deploy to Railway/Render/Heroku

## Prerequisites

Before deploying, ensure you have completed:

- [x] All tasks 1-16 in the implementation plan
- [x] Environment variables prepared (see PRODUCTION_ENV_TEMPLATE.md)
- [x] Database migration ready (see DATABASE_MIGRATION_CHECKLIST.md)
- [x] Email service configured (see EMAIL_SERVICE_CONFIGURATION.md)
- [x] DNS authentication set up (see DNS_AUTHENTICATION_GUIDE.md)
- [x] Google Analytics configured (see GA4_CONFIGURATION_GUIDE.md)

---

## Part 1: Deploy Backend API

### Option A: Deploy to Railway (Recommended)

Railway provides automatic PostgreSQL and Redis provisioning with zero configuration.

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Verify your email

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository

#### Step 3: Configure Backend Service
1. Railway will detect your monorepo
2. Click "Add Service" → "GitHub Repo"
3. Configure the service:
   - **Name**: `wizjock-backend`
   - **Root Directory**: `packages/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Step 4: Add PostgreSQL Database
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway automatically creates `DATABASE_URL` environment variable
3. Note: This is automatically linked to your backend service

#### Step 5: Add Redis
1. Click "New" → "Database" → "Add Redis"
2. Railway automatically creates `REDIS_URL` environment variable
3. Note: This is automatically linked to your backend service

#### Step 6: Set Environment Variables
1. Click on your backend service
2. Go to "Variables" tab
3. Add the following variables:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-with-openssl-rand-base64-32>
CORS_ORIGIN=https://wizjock.com,https://www.wizjock.com
RESEND_API_KEY=re_your_production_api_key
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com
LOG_LEVEL=info
```

**Note:** `DATABASE_URL` and `REDIS_URL` are automatically set by Railway

#### Step 7: Generate Domain
1. Go to "Settings" tab
2. Click "Generate Domain"
3. Copy the domain (e.g., `wizjock-backend.up.railway.app`)
4. Save this for frontend configuration

#### Step 8: Run Database Migration
1. Click on your backend service
2. Go to "Deployments" tab
3. Click on the latest deployment
4. Click "View Logs"
5. Once deployed, run migration:

**Option 1: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run npm run migrate --service wizjock-backend
```

**Option 2: Using Database Connection**
```bash
# Get DATABASE_URL from Railway dashboard
# Run migration locally against production database
cd packages/backend
DATABASE_URL="postgresql://..." npm run migrate
```

#### Step 9: Verify Backend Deployment
```bash
# Test health endpoint
curl https://your-backend-domain.up.railway.app/health

# Should return: {"status":"ok"}
```

---

### Option B: Deploy to Render

#### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Verify your email

#### Step 2: Create PostgreSQL Database
1. Click "New" → "PostgreSQL"
2. Configure:
   - **Name**: `wizjock-db`
   - **Database**: `wizjock`
   - **User**: `wizjock`
   - **Region**: Choose closest to your users
   - **Plan**: Free or Starter
3. Click "Create Database"
4. Copy the "Internal Database URL" (starts with `postgresql://`)

#### Step 3: Create Redis Instance
1. Click "New" → "Redis"
2. Configure:
   - **Name**: `wizjock-redis`
   - **Region**: Same as database
   - **Plan**: Free
3. Click "Create Redis"
4. Copy the "Internal Redis URL"

#### Step 4: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `wizjock-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `packages/backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

#### Step 5: Set Environment Variables
In the "Environment" tab, add:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=<paste-internal-database-url>
REDIS_URL=<paste-internal-redis-url>
JWT_SECRET=<generate-with-openssl-rand-base64-32>
CORS_ORIGIN=https://wizjock.com,https://www.wizjock.com
RESEND_API_KEY=re_your_production_api_key
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com
LOG_LEVEL=info
```

#### Step 6: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy
3. Wait for deployment to complete
4. Copy the service URL (e.g., `https://wizjock-backend.onrender.com`)

#### Step 7: Run Database Migration
```bash
# Get DATABASE_URL from Render dashboard
# Run migration locally against production database
cd packages/backend
DATABASE_URL="postgresql://..." npm run migrate
```

#### Step 8: Verify Backend Deployment
```bash
curl https://wizjock-backend.onrender.com/health
```

---

### Option C: Deploy to Heroku

#### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
cd packages/backend
heroku create wizjock-backend
```

#### Step 4: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 5: Add Redis
```bash
heroku addons:create heroku-redis:mini
```

#### Step 6: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="<generate-with-openssl-rand-base64-32>"
heroku config:set CORS_ORIGIN="https://wizjock.com,https://www.wizjock.com"
heroku config:set RESEND_API_KEY="re_your_production_api_key"
heroku config:set FROM_EMAIL="hello@wizjock.com"
heroku config:set ADMIN_EMAIL="team@wizjock.com"
heroku config:set LOG_LEVEL="info"
```

**Note:** `DATABASE_URL` and `REDIS_URL` are automatically set by Heroku addons

#### Step 7: Deploy
```bash
# From project root
git subtree push --prefix packages/backend heroku main

# Or if you have the backend in a separate repo
git push heroku main
```

#### Step 8: Run Database Migration
```bash
heroku run npm run migrate
```

#### Step 9: Verify Backend Deployment
```bash
curl https://wizjock-backend.herokuapp.com/health
```

---

## Part 2: Deploy Frontend (Client Portal)

### Deploy to Vercel (Recommended)

Vercel is optimized for React/Vite applications and provides excellent performance.

#### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Verify your email

#### Step 2: Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Vercel will detect the monorepo

#### Step 3: Configure Project
1. **Framework Preset**: Vite
2. **Root Directory**: `packages/client-portal` ⚠️ IMPORTANT
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

#### Step 4: Set Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add the following for **Production** environment:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=https://your-backend-domain.up.railway.app
```

**Note:** Replace `your-backend-domain.up.railway.app` with your actual backend URL from Part 1

#### Step 5: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Wait for deployment to complete (usually 1-2 minutes)
4. Copy the deployment URL (e.g., `https://wizjock.vercel.app`)

#### Step 6: Add Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain: `wizjock.com`
3. Add www variant: `www.wizjock.com`
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

#### Step 7: Update Backend CORS
After deploying frontend, update backend CORS_ORIGIN:

**Railway:**
1. Go to backend service → Variables
2. Update `CORS_ORIGIN` to include Vercel domain:
```bash
CORS_ORIGIN=https://wizjock.vercel.app,https://wizjock.com,https://www.wizjock.com
```

**Render/Heroku:**
```bash
# Render: Update in dashboard
# Heroku: Update via CLI
heroku config:set CORS_ORIGIN="https://wizjock.vercel.app,https://wizjock.com,https://www.wizjock.com"
```

---

## Part 3: Verify Deployment

### Backend Verification

#### 1. Health Check
```bash
curl https://your-backend-url/health

# Expected: {"status":"ok"}
```

#### 2. Database Connection
```bash
curl https://your-backend-url/api/health/db

# Expected: {"status":"ok","database":"connected"}
```

#### 3. Test Application Endpoint
```bash
curl -X POST https://your-backend-url/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "bettingExperience": "intermediate",
    "smsConsent": true
  }'

# Expected: {"success":true,"message":"Application received successfully","applicationId":"..."}
```

#### 4. Check Logs
**Railway:**
- Go to service → Deployments → View Logs

**Render:**
- Go to service → Logs tab

**Heroku:**
```bash
heroku logs --tail
```

### Frontend Verification

#### 1. Load Landing Page
```bash
# Open in browser
open https://your-frontend-url

# Or test with curl
curl -I https://your-frontend-url

# Expected: HTTP/2 200
```

#### 2. Check All Routes
Test each route returns 200:
- `/` - Landing page
- `/apply` - Application form
- `/privacy` - Privacy policy
- `/terms` - Terms of use
- `/responsible-gambling` - Responsible gambling
- `/about` - About page
- `/contact` - Contact page

#### 3. Test Application Form
1. Go to `/apply`
2. Fill out the form
3. Submit
4. Verify:
   - Success message appears
   - Confirmation email received
   - Admin notification email received
   - Application stored in database

#### 4. Check Analytics
1. Go to Google Analytics Real-Time report
2. Visit your site
3. Verify events are being tracked:
   - `page_view`
   - `cta_click`
   - `form_start`
   - `form_submit`

#### 5. Test Mobile Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

#### 6. Run Lighthouse Audit
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile" and "Performance, Accessibility, Best Practices, SEO"
4. Click "Analyze page load"
5. Verify scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

---

## Part 4: Post-Deployment Configuration

### 1. Update DNS for Custom Domain

If using a custom domain (wizjock.com):

#### Vercel DNS Configuration
1. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Add the following DNS records:

**For root domain (wizjock.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

3. Wait for DNS propagation (up to 48 hours)
4. Verify in Vercel dashboard that domain is active

### 2. Configure SSL/TLS

**Vercel:**
- SSL is automatic and free (Let's Encrypt)
- No configuration needed

**Railway:**
- SSL is automatic for generated domains
- For custom domains, follow Railway's custom domain guide

**Render:**
- SSL is automatic and free
- No configuration needed

### 3. Set Up Monitoring

#### Backend Monitoring

**Railway:**
1. Go to service → Metrics
2. Monitor CPU, Memory, Network usage
3. Set up alerts (if available in your plan)

**Render:**
1. Go to service → Metrics tab
2. Monitor response times, error rates
3. Set up alerts in Settings

**Heroku:**
```bash
# View metrics
heroku logs --tail

# Set up log drains (optional)
heroku drains:add https://your-logging-service.com
```

#### Frontend Monitoring

**Vercel:**
1. Go to project → Analytics
2. Monitor:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers
3. Set up Web Vitals monitoring

**Google Analytics:**
1. Go to https://analytics.google.com
2. Select your property
3. Monitor:
   - Real-time users
   - Conversion funnel
   - CTA click rates
   - Form submission rates

### 4. Set Up Error Tracking (Optional but Recommended)

Consider integrating error tracking:

**Sentry (Recommended):**
1. Create account at https://sentry.io
2. Create new project
3. Install Sentry SDK:

```bash
# Backend
cd packages/backend
npm install @sentry/node

# Frontend
cd packages/client-portal
npm install @sentry/react
```

4. Configure Sentry (see Sentry docs)
5. Redeploy

---

## Troubleshooting

### Issue: Backend deployment fails

**Possible causes:**
- Build command incorrect
- Missing dependencies
- Environment variables not set
- Database connection fails

**Solutions:**
1. Check build logs for specific error
2. Verify `package.json` scripts are correct
3. Ensure all environment variables are set
4. Test database connection string

### Issue: Frontend shows blank page

**Possible causes:**
- Build failed
- JavaScript errors
- API URL incorrect
- CORS errors

**Solutions:**
1. Check browser console for errors
2. Verify build completed successfully
3. Check `VITE_API_URL` is correct
4. Verify backend CORS_ORIGIN includes frontend URL

### Issue: Application form submission fails

**Possible causes:**
- Backend not accessible
- CORS misconfigured
- Database connection issue
- Validation errors

**Solutions:**
1. Test backend endpoint directly with curl
2. Check browser console for CORS errors
3. Verify backend logs for errors
4. Test with valid data

### Issue: Emails not sending

**Possible causes:**
- Resend API key incorrect
- Domain not verified
- DNS records not configured
- Rate limit exceeded

**Solutions:**
1. Verify Resend API key is correct
2. Check domain verification status in Resend dashboard
3. Verify SPF, DKIM, DMARC records
4. Check Resend dashboard for delivery status

### Issue: Analytics not tracking

**Possible causes:**
- Measurement ID incorrect
- Ad blocker enabled
- Script not loaded
- Events not firing

**Solutions:**
1. Verify `VITE_GA_MEASUREMENT_ID` is correct
2. Test in incognito mode (disables ad blockers)
3. Check browser console for GA script errors
4. Verify events in GA4 DebugView

---

## Rollback Procedures

### Backend Rollback

**Railway:**
1. Go to service → Deployments
2. Find previous working deployment
3. Click "..." → "Redeploy"

**Render:**
1. Go to service → Deployments
2. Find previous working deployment
3. Click "Redeploy"

**Heroku:**
```bash
# List releases
heroku releases

# Rollback to previous release
heroku rollback v123
```

### Frontend Rollback

**Vercel:**
1. Go to project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Database Rollback

If you need to rollback a database migration:

```bash
# Connect to production database
psql $DATABASE_URL

# Run rollback SQL
-- See DATABASE_MIGRATION_CHECKLIST.md for rollback procedures
```

**⚠️ WARNING:** Always backup database before rollback!

---

## Security Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] JWT_SECRET is strong and unique (32+ characters)
- [ ] Database is not publicly accessible
- [ ] CORS is configured correctly (only allow your domains)
- [ ] HTTPS is enforced (no HTTP traffic)
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] No secrets in version control
- [ ] No secrets in logs
- [ ] Email domain is verified and authenticated
- [ ] DNS records are correct (SPF, DKIM, DMARC)
- [ ] Error messages don't expose sensitive information
- [ ] Admin endpoints are protected (if any)

---

## Performance Checklist

Before going live, verify:

- [ ] Lighthouse Performance score > 80
- [ ] Lighthouse Accessibility score > 90
- [ ] Images are optimized (WebP format)
- [ ] Lazy loading is enabled
- [ ] Code splitting is implemented
- [ ] Bundle size is optimized
- [ ] CDN is configured (Vercel does this automatically)
- [ ] Caching headers are set
- [ ] Database queries are optimized
- [ ] Redis caching is working
- [ ] API response times < 500ms

---

## Monitoring Checklist

After deployment, monitor:

- [ ] Error rates (should be < 1%)
- [ ] Response times (should be < 500ms)
- [ ] Application submission rate
- [ ] Email delivery rate
- [ ] Page load times
- [ ] Core Web Vitals (LCP, INP, CLS)
- [ ] Conversion funnel (landing → form → submit)
- [ ] Server resource usage (CPU, memory, disk)
- [ ] Database connection pool
- [ ] Redis cache hit rate

---

## Next Steps

After successful deployment:

1. ✅ **Complete Task 18: Post-deployment verification**
   - Test all features end-to-end
   - Monitor logs for 24 hours
   - Verify analytics tracking

2. ✅ **Complete Task 19: Set up monitoring and alerts**
   - Configure error alerts
   - Set up uptime monitoring
   - Create admin dashboard

3. ✅ **Announce launch**
   - Update social media
   - Notify existing community
   - Start marketing campaigns

4. ✅ **Monitor and iterate**
   - Review analytics daily
   - Respond to user feedback
   - Fix bugs promptly
   - Optimize based on data

---

## Support Resources

### Platform Documentation
- **Railway:** https://docs.railway.app
- **Render:** https://render.com/docs
- **Heroku:** https://devcenter.heroku.com
- **Vercel:** https://vercel.com/docs

### Service Documentation
- **Resend:** https://resend.com/docs
- **Google Analytics:** https://support.google.com/analytics
- **PostgreSQL:** https://www.postgresql.org/docs

### Community Support
- **Railway Discord:** https://discord.gg/railway
- **Render Community:** https://community.render.com
- **Vercel Discord:** https://vercel.com/discord

---

## Congratulations! 🎉

Your WizJock landing page is now live in production!

Remember to:
- Monitor logs and metrics regularly
- Respond to user feedback
- Keep dependencies updated
- Backup database regularly
- Review security regularly

Good luck with your launch! 🚀
