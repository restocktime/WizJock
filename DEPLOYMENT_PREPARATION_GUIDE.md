# Deployment Preparation Guide

This guide covers all steps needed to prepare the WizJock application for production deployment.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Database Migration](#database-migration)
3. [Email Service Configuration](#email-service-configuration)
4. [Domain Authentication (SPF, DKIM, DMARC)](#domain-authentication)
5. [Google Analytics 4 Configuration](#google-analytics-4-configuration)
6. [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## 1. Environment Variables

### Backend Environment Variables

Create a `.env` file in `packages/backend/` with the following production values:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
# Replace with your production PostgreSQL connection string
DATABASE_URL=postgresql://username:password@host:port/database_name

# Redis (for caching and rate limiting)
# Replace with your production Redis connection string
REDIS_URL=redis://host:port

# JWT Authentication
# CRITICAL: Generate a strong random secret (minimum 32 characters)
# Use: openssl rand -base64 32
JWT_SECRET=<GENERATE_STRONG_SECRET_HERE>
JWT_EXPIRES_IN=24h

# CORS Configuration
# Add your production domain(s), comma-separated
CORS_ORIGIN=https://wizjock.com,https://www.wizjock.com

# Email Service (Resend)
# Get API key from https://resend.com/api-keys
RESEND_API_KEY=re_<YOUR_PRODUCTION_API_KEY>
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com

# Optional: Logging
LOG_LEVEL=info
```

#### How to Generate JWT Secret

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Frontend Environment Variables

Create a `.env.production` file in `packages/client-portal/` with:

```bash
# Google Analytics 4
# Get your measurement ID from https://analytics.google.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# API URL (if different from default)
# VITE_API_URL=https://api.wizjock.com
```

### Environment Variable Security

**CRITICAL SECURITY NOTES:**

1. **Never commit `.env` files to version control**
2. **Use different secrets for production vs development**
3. **Store production secrets in your hosting platform's secret manager:**
   - Vercel: Environment Variables in Project Settings
   - AWS: AWS Secrets Manager or Parameter Store
   - Heroku: Config Vars
   - Railway: Variables tab
   - Render: Environment Variables

4. **Rotate secrets regularly** (every 90 days recommended)

---

## 2. Database Migration

### Prerequisites

- Production PostgreSQL database provisioned
- Database credentials available
- Network access to production database (may require VPN or IP whitelisting)

### Migration Steps

#### Option A: Run Migrations from Local Machine

1. **Set production DATABASE_URL temporarily:**

```bash
cd packages/backend
export DATABASE_URL="postgresql://username:password@production-host:5432/database_name"
```

2. **Run migrations:**

```bash
npm run migrate
```

3. **Verify migrations:**

```bash
# Connect to production database
psql $DATABASE_URL

# Check migrations table
SELECT * FROM migrations ORDER BY executed_at;

# Verify tables exist
\dt

# Expected tables:
# - migrations
# - users
# - sports
# - picks
# - reports
# - applications (from migration 003)

# Exit psql
\q
```

#### Option B: Run Migrations on Production Server

1. **SSH into production server**

2. **Navigate to backend directory:**

```bash
cd /path/to/app/packages/backend
```

3. **Ensure DATABASE_URL is set in environment**

4. **Run migrations:**

```bash
npm run migrate
```

#### Migration Files to Execute

The following migrations will be executed in order:

1. `001_create_tables.sql` - Creates core tables (users, sports, picks, reports)
2. `002_change_units_to_decimal.sql` - Changes units column to DECIMAL type
3. `003_create_applications_table.sql` - Creates applications table for lead capture

### Rollback Plan

If migrations fail:

1. **Check error logs** to identify the issue
2. **Restore database from backup** (ensure you have a backup before migrating!)
3. **Fix the migration file** if there's a SQL error
4. **Re-run migrations**

### Post-Migration Verification

```sql
-- Verify applications table structure
\d applications

-- Expected columns:
-- id, full_name, email, phone, betting_experience, 
-- sms_consent, status, notes, created_at, updated_at

-- Verify indexes
\di

-- Expected indexes on applications:
-- idx_applications_email
-- idx_applications_status
-- idx_applications_created_at
```

---

## 3. Email Service Configuration

### Resend Setup

1. **Create Resend Account:**
   - Go to https://resend.com
   - Sign up for an account
   - Verify your email

2. **Add and Verify Domain:**
   - Navigate to "Domains" in Resend dashboard
   - Click "Add Domain"
   - Enter `wizjock.com`
   - Follow verification instructions (add DNS records)

3. **Generate API Key:**
   - Navigate to "API Keys" in Resend dashboard
   - Click "Create API Key"
   - Name it "Production - WizJock"
   - Select "Full Access" or "Sending Access"
   - Copy the API key (starts with `re_`)
   - **IMPORTANT:** Save this key securely - it won't be shown again

4. **Configure Environment Variable:**
   ```bash
   RESEND_API_KEY=re_<your_api_key_here>
   ```

5. **Set Sender Email:**
   ```bash
   FROM_EMAIL=hello@wizjock.com
   ADMIN_EMAIL=team@wizjock.com
   ```

### Email Testing

Before going live, test email delivery:

```bash
# From packages/backend directory
npm run test:email
```

Or manually test by submitting the application form in staging environment.

### Email Deliverability Best Practices

1. **Use a professional sender name:** "WizJock Team" or "WizJock"
2. **Keep subject lines clear and concise**
3. **Include unsubscribe link** (for marketing emails)
4. **Monitor bounce rates** in Resend dashboard
5. **Warm up your domain** (start with low volume, gradually increase)

---

## 4. Domain Authentication (SPF, DKIM, DMARC)

Domain authentication ensures your emails are trusted and not marked as spam.

### DNS Records to Add

Log into your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap) and add the following records:

#### SPF Record

**Purpose:** Specifies which mail servers can send email on behalf of your domain

**Record Type:** TXT  
**Name:** `@` or `wizjock.com`  
**Value:** 
```
v=spf1 include:_spf.resend.com ~all
```

**TTL:** 3600 (1 hour)

#### DKIM Records

**Purpose:** Adds a digital signature to verify email authenticity

Resend will provide you with specific DKIM records when you add your domain. They typically look like:

**Record Type:** TXT  
**Name:** `resend._domainkey.wizjock.com`  
**Value:** (Provided by Resend - long string starting with `v=DKIM1`)  
**TTL:** 3600

#### DMARC Record

**Purpose:** Tells receiving servers what to do with emails that fail SPF/DKIM checks

**Record Type:** TXT  
**Name:** `_dmarc.wizjock.com`  
**Value:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
```

**Explanation:**
- `p=quarantine` - Quarantine suspicious emails (use `p=reject` after testing)
- `rua=mailto:dmarc@wizjock.com` - Send aggregate reports here
- `ruf=mailto:dmarc@wizjock.com` - Send forensic reports here
- `fo=1` - Generate reports for any failure
- `adkim=s` - Strict DKIM alignment
- `aspf=s` - Strict SPF alignment
- `pct=100` - Apply policy to 100% of emails

**TTL:** 3600

### Verification Steps

1. **Wait for DNS propagation** (can take up to 48 hours, usually much faster)

2. **Check DNS records:**
   ```bash
   # Check SPF
   dig TXT wizjock.com
   
   # Check DKIM
   dig TXT resend._domainkey.wizjock.com
   
   # Check DMARC
   dig TXT _dmarc.wizjock.com
   ```

3. **Verify in Resend Dashboard:**
   - Go to "Domains" in Resend
   - Your domain should show "Verified" status
   - All DNS records should have green checkmarks

4. **Test Email Authentication:**
   - Send a test email
   - Check email headers in Gmail (Show Original)
   - Look for:
     - `SPF: PASS`
     - `DKIM: PASS`
     - `DMARC: PASS`

### Troubleshooting

**SPF not passing:**
- Ensure you included `include:_spf.resend.com`
- Check for conflicting SPF records (only one SPF record allowed)
- Verify DNS propagation

**DKIM not passing:**
- Ensure DKIM record matches exactly what Resend provided
- Check for extra spaces or line breaks in the value
- Verify DNS propagation

**DMARC not passing:**
- Ensure SPF and DKIM are passing first
- Check DMARC record syntax
- Start with `p=none` for testing, then move to `p=quarantine`, then `p=reject`

---

## 5. Google Analytics 4 Configuration

### Create GA4 Property

1. **Go to Google Analytics:**
   - Visit https://analytics.google.com
   - Sign in with your Google account

2. **Create Property:**
   - Click "Admin" (gear icon)
   - Click "Create Property"
   - Property name: "WizJock"
   - Time zone: Select your timezone
   - Currency: USD
   - Click "Next"

3. **Business Information:**
   - Industry: "Sports & Recreation" or "Online Communities"
   - Business size: Select appropriate size
   - Click "Create"

4. **Accept Terms of Service**

5. **Set up Data Stream:**
   - Select "Web"
   - Website URL: `https://wizjock.com`
   - Stream name: "WizJock Website"
   - Click "Create stream"

6. **Get Measurement ID:**
   - Copy the Measurement ID (format: `G-XXXXXXXXXX`)
   - This is what you'll use in your environment variable

### Configure GA4 Settings

#### Enhanced Measurement

Enable these automatic events:
- ✅ Page views
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search
- ✅ Form interactions
- ✅ File downloads

#### Data Retention

- Go to Admin > Data Settings > Data Retention
- Set to **14 months** (maximum for free tier)

#### IP Anonymization

- Already enabled by default in GA4
- No additional configuration needed

#### Cross-Domain Tracking

If you have multiple domains (e.g., blog.wizjock.com):
- Go to Admin > Data Streams > [Your Stream] > Configure tag settings
- Click "Configure your domains"
- Add all domains

### Custom Events Setup

The application already tracks these custom events:
- `cta_click` - When CTA buttons are clicked
- `form_start` - When application form is started
- `form_submit` - When application form is submitted
- `form_error` - When form submission fails
- `whatsapp_click` - When WhatsApp link is clicked

These will automatically appear in GA4 after deployment.

### Create Custom Reports

1. **Conversion Funnel:**
   - Go to Explore > Funnel Exploration
   - Steps:
     1. page_view (Landing Page)
     2. form_start
     3. form_submit
   - This shows your conversion rate

2. **CTA Performance:**
   - Go to Explore > Free Form
   - Add dimension: Event name
   - Filter: Event name = cta_click
   - Add secondary dimension: Custom parameter (location)
   - This shows which CTAs are most effective

### Privacy Compliance

#### Cookie Consent

If targeting EU/UK users, implement cookie consent:

```typescript
// Already implemented in packages/client-portal/src/components/CookieConsent.tsx
// Ensure it's enabled in production
```

#### Data Deletion Requests

Set up a process to handle data deletion requests:
1. User emails privacy@wizjock.com
2. Verify user identity
3. Delete from GA4: Admin > Data Settings > Data Deletion Requests
4. Delete from database: `DELETE FROM applications WHERE email = 'user@example.com'`

### Verification

1. **Test in Real-Time:**
   - Go to Reports > Realtime
   - Visit your production site
   - You should see your visit appear within seconds

2. **Check Events:**
   - Go to Reports > Realtime > Event count by Event name
   - Trigger events (click CTAs, submit form)
   - Verify events appear

3. **Debug with GA Debugger:**
   - Install "Google Analytics Debugger" Chrome extension
   - Enable it
   - Open browser console
   - Visit your site and trigger events
   - Check console for GA debug messages

---

## 6. Pre-Deployment Checklist

### Security Checklist

- [ ] All environment variables set in production environment
- [ ] JWT_SECRET is strong and unique (minimum 32 characters)
- [ ] Database credentials are secure and not committed to git
- [ ] CORS_ORIGIN is set to production domain only
- [ ] HTTPS is enforced (no HTTP traffic allowed)
- [ ] Rate limiting is enabled on API endpoints
- [ ] Input validation is working on all forms
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] XSS prevention verified (input sanitization)

### Database Checklist

- [ ] Production database is provisioned
- [ ] Database backup is configured (automated daily backups)
- [ ] Database migrations have been run successfully
- [ ] All tables exist and have correct schema
- [ ] Indexes are created for performance
- [ ] Database connection pooling is configured
- [ ] Database credentials are stored securely

### Email Checklist

- [ ] Resend account created and verified
- [ ] Domain added and verified in Resend
- [ ] API key generated and stored securely
- [ ] SPF record added to DNS
- [ ] DKIM records added to DNS
- [ ] DMARC record added to DNS
- [ ] DNS records verified (all passing)
- [ ] Test email sent and received successfully
- [ ] Email templates reviewed for branding and accuracy
- [ ] Admin notification email tested

### Analytics Checklist

- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] VITE_GA_MEASUREMENT_ID set in production environment
- [ ] Enhanced measurement enabled
- [ ] Data retention set to 14 months
- [ ] Real-time reporting tested
- [ ] Custom events verified
- [ ] Cookie consent banner implemented (if required)

### Frontend Checklist

- [ ] All CTAs link to /apply (not #coming-soon)
- [ ] All legal pages exist and return 200 (not 404)
- [ ] Footer is visible on all pages with legal links
- [ ] Performance disclaimers visible on all performance claims
- [ ] Mobile responsiveness tested (320px to 2560px)
- [ ] Accessibility tested (WCAG 2.2 AA compliance)
- [ ] Images optimized and loading correctly
- [ ] Lighthouse score > 80 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Browser testing complete (Chrome, Safari, Firefox, Edge)

### Backend Checklist

- [ ] API endpoints tested and working
- [ ] POST /api/applications accepts valid submissions
- [ ] Validation errors return proper error messages
- [ ] Rate limiting working (5 requests per hour per IP)
- [ ] Email confirmation sent on successful submission
- [ ] Admin notification sent on successful submission
- [ ] Error logging configured
- [ ] Health check endpoint working
- [ ] CORS configured correctly

### Testing Checklist

- [ ] Unit tests passing (npm test)
- [ ] Integration tests passing
- [ ] Accessibility tests passing (zero critical violations)
- [ ] End-to-end user flow tested:
  - Landing page loads
  - Click CTA button
  - Fill out application form
  - Submit form
  - See success message
  - Receive confirmation email
  - Admin receives notification email
- [ ] Error scenarios tested:
  - Invalid email format
  - Missing required fields
  - Duplicate email submission
  - Network error handling
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Screen reader testing (NVDA or VoiceOver)
- [ ] Keyboard-only navigation tested

### Monitoring Checklist

- [ ] Error logging configured (e.g., Sentry, LogRocket)
- [ ] Application monitoring set up (e.g., New Relic, Datadog)
- [ ] Uptime monitoring configured (e.g., UptimeRobot, Pingdom)
- [ ] Email delivery monitoring enabled
- [ ] Database performance monitoring enabled
- [ ] Alerts configured for:
  - Application errors (> 5% error rate)
  - Email delivery failures
  - Database connection issues
  - High response times (> 3 seconds)
  - Zero application submissions (potential bug)

### Documentation Checklist

- [ ] README updated with production setup instructions
- [ ] API documentation up to date
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Incident response plan created
- [ ] Contact information for on-call support

---

## Quick Reference Commands

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Run Database Migrations
```bash
cd packages/backend
npm run migrate
```

### Test Email Service
```bash
cd packages/backend
npm run test:email
```

### Check DNS Records
```bash
dig TXT wizjock.com                          # SPF
dig TXT resend._domainkey.wizjock.com        # DKIM
dig TXT _dmarc.wizjock.com                   # DMARC
```

### Build for Production
```bash
# Backend
cd packages/backend
npm run build

# Frontend
cd packages/client-portal
npm run build
```

### Run Production Build Locally (Testing)
```bash
# Backend
cd packages/backend
NODE_ENV=production npm start

# Frontend (preview)
cd packages/client-portal
npm run preview
```

---

## Support and Troubleshooting

### Common Issues

**Issue: Database connection fails**
- Check DATABASE_URL is correct
- Verify network access (firewall, security groups)
- Check database is running
- Verify credentials

**Issue: Emails not sending**
- Check RESEND_API_KEY is correct
- Verify domain is verified in Resend
- Check DNS records (SPF, DKIM, DMARC)
- Check email service logs

**Issue: GA4 not tracking**
- Verify VITE_GA_MEASUREMENT_ID is set
- Check browser console for errors
- Verify GA4 script is loaded (view page source)
- Check ad blockers are disabled for testing

**Issue: CORS errors**
- Verify CORS_ORIGIN includes production domain
- Check protocol (https:// vs http://)
- Verify no trailing slashes in CORS_ORIGIN

### Getting Help

- **Email Service:** support@resend.com
- **Google Analytics:** https://support.google.com/analytics
- **Database Issues:** Check your hosting provider's documentation
- **Application Issues:** Check application logs and error monitoring

---

## Next Steps

After completing this preparation:

1. ✅ Review this entire document
2. ✅ Complete all checklist items
3. ✅ Proceed to Task 17: Deploy to production
4. ✅ After deployment, proceed to Task 18: Post-deployment verification

**Remember:** Always test in a staging environment before deploying to production!
