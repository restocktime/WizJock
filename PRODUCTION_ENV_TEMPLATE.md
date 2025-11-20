# Production Environment Variables Template

This document provides templates for all environment variables needed in production.

## Backend Environment Variables

Create this file as `packages/backend/.env` in production:

```bash
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# DATABASE CONFIGURATION
# ============================================
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database
# 
# Examples:
# - Heroku: postgres://user:pass@host.compute.amazonaws.com:5432/dbname
# - Railway: postgresql://postgres:pass@containers-us-west-1.railway.app:5432/railway
# - Render: postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname
# - AWS RDS: postgresql://admin:pass@mydb.xxxxx.us-east-1.rds.amazonaws.com:5432/sportsbook
# - Supabase: postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres
#
DATABASE_URL=postgresql://username:password@host:port/database_name

# ============================================
# REDIS CONFIGURATION
# ============================================
# Redis connection string for caching and rate limiting
# Format: redis://host:port or redis://username:password@host:port
#
# Examples:
# - Railway: redis://default:pass@containers-us-west-1.railway.app:6379
# - Render: redis://red-xxxxx:6379
# - Upstash: redis://default:pass@us1-xxxxx.upstash.io:6379
# - AWS ElastiCache: redis://master.xxxxx.cache.amazonaws.com:6379
#
REDIS_URL=redis://host:port

# ============================================
# JWT AUTHENTICATION
# ============================================
# CRITICAL: Generate a strong random secret
# Use: openssl rand -base64 32
# NEVER use the same secret as development
# Rotate every 90 days
#
JWT_SECRET=REPLACE_WITH_STRONG_SECRET_MINIMUM_32_CHARS
JWT_EXPIRES_IN=24h

# ============================================
# CORS CONFIGURATION
# ============================================
# Comma-separated list of allowed origins
# Include both www and non-www versions if applicable
# NO trailing slashes
#
CORS_ORIGIN=https://wizjock.com,https://www.wizjock.com

# ============================================
# EMAIL SERVICE (RESEND)
# ============================================
# Get API key from: https://resend.com/api-keys
# Format: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#
RESEND_API_KEY=re_YOUR_PRODUCTION_API_KEY_HERE

# Email address to send FROM
# Must be verified in Resend dashboard
# Format: name@yourdomain.com
#
FROM_EMAIL=hello@wizjock.com

# Email address to receive admin notifications
# Can be same as FROM_EMAIL or different
#
ADMIN_EMAIL=team@wizjock.com

# ============================================
# LOGGING (OPTIONAL)
# ============================================
# Log level: error, warn, info, debug
# Use 'info' for production, 'debug' for troubleshooting
#
LOG_LEVEL=info

# ============================================
# RATE LIMITING (OPTIONAL)
# ============================================
# Override default rate limits if needed
# Default: 5 applications per hour per IP
#
# RATE_LIMIT_WINDOW_MS=3600000
# RATE_LIMIT_MAX_REQUESTS=5

# ============================================
# SECURITY (OPTIONAL)
# ============================================
# Force HTTPS redirect (usually handled by reverse proxy)
# FORCE_HTTPS=true

# Helmet security headers (enabled by default)
# HELMET_ENABLED=true
```

## Frontend Environment Variables

Create this file as `packages/client-portal/.env.production`:

```bash
# ============================================
# GOOGLE ANALYTICS 4
# ============================================
# Get your measurement ID from: https://analytics.google.com
# Format: G-XXXXXXXXXX
# 
# Steps to get Measurement ID:
# 1. Go to https://analytics.google.com
# 2. Admin > Data Streams > Your Stream
# 3. Copy the Measurement ID
#
# Leave empty to disable analytics
#
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================
# API CONFIGURATION (OPTIONAL)
# ============================================
# Only needed if API is on different domain
# Default: Same origin as frontend
#
# Examples:
# VITE_API_URL=https://api.wizjock.com
# VITE_API_URL=https://wizjock-api.herokuapp.com
#
# VITE_API_URL=https://api.wizjock.com
```

---

## Platform-Specific Instructions

### Vercel

Set environment variables in Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - **Key:** Variable name (e.g., `DATABASE_URL`)
   - **Value:** Variable value
   - **Environment:** Select "Production"
4. Click "Save"

**Note:** Vercel automatically sets `NODE_ENV=production`

### Heroku

Set environment variables using Heroku CLI:

```bash
# Backend variables
heroku config:set DATABASE_URL="postgresql://..." --app your-backend-app
heroku config:set REDIS_URL="redis://..." --app your-backend-app
heroku config:set JWT_SECRET="your-secret" --app your-backend-app
heroku config:set CORS_ORIGIN="https://wizjock.com" --app your-backend-app
heroku config:set RESEND_API_KEY="re_xxx" --app your-backend-app
heroku config:set FROM_EMAIL="hello@wizjock.com" --app your-backend-app
heroku config:set ADMIN_EMAIL="team@wizjock.com" --app your-backend-app

# Frontend variables
heroku config:set VITE_GA_MEASUREMENT_ID="G-XXX" --app your-frontend-app
```

Or use Heroku Dashboard:
1. Go to your app
2. Settings > Config Vars
3. Click "Reveal Config Vars"
4. Add each variable

### Railway

Set environment variables in Railway Dashboard:

1. Select your project
2. Click on your service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add each variable
6. Click "Deploy" to apply changes

**Note:** Railway provides `DATABASE_URL` and `REDIS_URL` automatically if you provision those services

### Render

Set environment variables in Render Dashboard:

1. Go to your web service
2. Navigate to "Environment" tab
3. Click "Add Environment Variable"
4. Add each variable:
   - **Key:** Variable name
   - **Value:** Variable value
5. Click "Save Changes"

**Note:** Render provides `DATABASE_URL` automatically if you provision a PostgreSQL database

### AWS (Elastic Beanstalk)

Set environment variables using AWS CLI:

```bash
aws elasticbeanstalk update-environment \
  --environment-name your-env-name \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=DATABASE_URL,Value=postgresql://... \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=your-secret \
    # ... add all other variables
```

Or use AWS Console:
1. Elastic Beanstalk > Environments > Your Environment
2. Configuration > Software > Edit
3. Add environment properties
4. Apply changes

### Docker / Docker Compose

Create a `.env` file in your project root:

```bash
# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
CORS_ORIGIN=https://wizjock.com
RESEND_API_KEY=re_xxx
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com

# Frontend
VITE_GA_MEASUREMENT_ID=G-XXX
```

Reference in `docker-compose.yml`:

```yaml
services:
  backend:
    env_file:
      - .env
    environment:
      - NODE_ENV=production
  
  frontend:
    env_file:
      - .env
```

---

## Security Best Practices

### 1. Secret Management

**DO:**
- ✅ Use your platform's secret manager (AWS Secrets Manager, Vercel Environment Variables, etc.)
- ✅ Generate strong, random secrets (minimum 32 characters)
- ✅ Use different secrets for each environment (dev, staging, prod)
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Limit access to production secrets (only authorized personnel)

**DON'T:**
- ❌ Commit `.env` files to version control
- ❌ Share secrets via email or Slack
- ❌ Use the same secrets across environments
- ❌ Use weak or predictable secrets
- ❌ Log secrets in application logs

### 2. Database Security

**DO:**
- ✅ Use SSL/TLS for database connections
- ✅ Restrict database access by IP (whitelist only your servers)
- ✅ Use strong database passwords (minimum 20 characters)
- ✅ Enable automated backups
- ✅ Use read replicas for scaling (if needed)

**DON'T:**
- ❌ Expose database to public internet
- ❌ Use default database passwords
- ❌ Grant unnecessary privileges to database users

### 3. API Key Security

**DO:**
- ✅ Store API keys in environment variables
- ✅ Use API key rotation features when available
- ✅ Monitor API key usage for anomalies
- ✅ Revoke compromised keys immediately

**DON'T:**
- ❌ Hardcode API keys in source code
- ❌ Expose API keys in client-side code
- ❌ Share API keys between services unnecessarily

---

## Verification Commands

After setting environment variables, verify they're loaded correctly:

### Backend Verification

```bash
# SSH into your production server or use your platform's console

# Check if variables are set (don't print sensitive values)
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Not set')"
node -e "console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set')"
node -e "console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Set' : '✗ Not set')"
node -e "console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN)"
node -e "console.log('NODE_ENV:', process.env.NODE_ENV)"
```

### Frontend Verification

```bash
# Check build output for environment variables
npm run build

# Verify GA4 is included in build
grep -r "VITE_GA_MEASUREMENT_ID" dist/
```

**IMPORTANT:** Never print actual secret values in logs or console!

---

## Troubleshooting

### Issue: Environment variables not loading

**Possible causes:**
1. Variables not set in platform
2. Typo in variable name
3. Application not restarted after setting variables
4. Wrong environment selected (dev vs prod)

**Solution:**
1. Verify variables are set in your platform's dashboard
2. Check for typos (case-sensitive!)
3. Restart/redeploy your application
4. Check you're looking at the correct environment

### Issue: Database connection fails

**Possible causes:**
1. Incorrect DATABASE_URL format
2. Database not accessible from server
3. Firewall blocking connection
4. Database credentials incorrect

**Solution:**
1. Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`
2. Check database is running
3. Whitelist your server's IP in database firewall
4. Verify credentials are correct

### Issue: CORS errors in production

**Possible causes:**
1. CORS_ORIGIN doesn't match frontend domain
2. Protocol mismatch (http vs https)
3. Trailing slash in CORS_ORIGIN
4. Missing www or non-www variant

**Solution:**
1. Set CORS_ORIGIN to exact frontend URL
2. Use https:// in production
3. Remove trailing slashes
4. Include both www and non-www: `https://wizjock.com,https://www.wizjock.com`

---

## Checklist

Before proceeding to deployment:

- [ ] All backend environment variables set
- [ ] All frontend environment variables set
- [ ] JWT_SECRET is strong and unique (32+ characters)
- [ ] DATABASE_URL points to production database
- [ ] REDIS_URL points to production Redis
- [ ] CORS_ORIGIN matches production domain(s)
- [ ] RESEND_API_KEY is production key (not test key)
- [ ] FROM_EMAIL and ADMIN_EMAIL are correct
- [ ] VITE_GA_MEASUREMENT_ID is production measurement ID
- [ ] No secrets committed to version control
- [ ] Environment variables verified with test commands
- [ ] Application restarted/redeployed after setting variables

---

## Next Steps

1. ✅ Set all environment variables in your hosting platform
2. ✅ Verify variables are loaded correctly
3. ✅ Proceed with database migration (see DEPLOYMENT_PREPARATION_GUIDE.md)
4. ✅ Continue with email service configuration
5. ✅ Complete remaining deployment preparation steps
