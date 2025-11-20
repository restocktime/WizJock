# Email Service Configuration Guide

Complete guide for configuring Resend email service for production.

## Table of Contents

1. [Resend Account Setup](#resend-account-setup)
2. [Domain Verification](#domain-verification)
3. [DNS Configuration](#dns-configuration)
4. [API Key Generation](#api-key-generation)
5. [Email Testing](#email-testing)
6. [Troubleshooting](#troubleshooting)

---

## 1. Resend Account Setup

### Step 1: Create Resend Account

1. **Go to Resend website:**
   - Visit https://resend.com
   - Click "Sign Up" or "Get Started"

2. **Sign up with email or GitHub:**
   - Enter your email address
   - Or click "Continue with GitHub"
   - Verify your email address

3. **Complete profile:**
   - Company name: WizJock
   - Use case: Transactional emails
   - Expected volume: < 10,000 emails/month (adjust as needed)

### Step 2: Verify Your Email

1. Check your inbox for verification email
2. Click verification link
3. Log in to Resend dashboard

### Pricing Information

**Free Tier:**
- 100 emails per day
- 3,000 emails per month
- All features included
- No credit card required

**Paid Plans:**
- Start at $20/month for 50,000 emails
- Upgrade when you exceed free tier limits

---

## 2. Domain Verification

### Step 1: Add Domain to Resend

1. **Navigate to Domains:**
   - Log in to Resend dashboard
   - Click "Domains" in left sidebar
   - Click "Add Domain" button

2. **Enter your domain:**
   - Domain: `wizjock.com`
   - Region: Select closest to your users (e.g., US East)
   - Click "Add"

### Step 2: Get DNS Records

After adding domain, Resend will provide DNS records to add:

1. **SPF Record** - Authorizes Resend to send on your behalf
2. **DKIM Records** - Adds digital signature to emails
3. **DMARC Record** - Tells receivers what to do with failed emails

**Example records provided by Resend:**

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@wizjock.com
```

**Important:** Copy these exact values - they're unique to your domain!

---

## 3. DNS Configuration

### Where to Add DNS Records

Log into your DNS provider:
- **Cloudflare:** DNS > Records
- **GoDaddy:** DNS Management
- **Namecheap:** Advanced DNS
- **Google Domains:** DNS
- **AWS Route 53:** Hosted Zones

### Add SPF Record

**Purpose:** Authorizes Resend to send emails from your domain

**Record Details:**
- **Type:** TXT
- **Name:** `@` (or leave blank, or `wizjock.com` depending on provider)
- **Value:** `v=spf1 include:_spf.resend.com ~all`
- **TTL:** 3600 (1 hour) or Auto

**Important Notes:**
- Only ONE SPF record allowed per domain
- If you already have an SPF record, add `include:_spf.resend.com` to it
- Example existing SPF: `v=spf1 include:_spf.google.com include:_spf.resend.com ~all`

**Common Mistakes:**
- ❌ Multiple SPF records (only last one is used)
- ❌ Missing `v=spf1` prefix
- ❌ Typo in `include:_spf.resend.com`
- ❌ Using `+all` instead of `~all` (too permissive)

### Add DKIM Records

**Purpose:** Adds cryptographic signature to verify email authenticity

Resend typically provides 2-3 DKIM records:

**Record 1:**
- **Type:** TXT
- **Name:** `resend._domainkey` (or `resend._domainkey.wizjock.com`)
- **Value:** `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...` (long string)
- **TTL:** 3600

**Record 2 (if provided):**
- **Type:** TXT
- **Name:** `resend2._domainkey`
- **Value:** (provided by Resend)
- **TTL:** 3600

**Important Notes:**
- Copy the EXACT value from Resend (very long string)
- Don't add spaces or line breaks
- Some DNS providers may require you to remove quotes

**Common Mistakes:**
- ❌ Truncated value (must be complete)
- ❌ Added spaces or line breaks
- ❌ Wrong subdomain name
- ❌ Missing `v=DKIM1;` prefix

### Add DMARC Record

**Purpose:** Tells email receivers what to do with emails that fail SPF/DKIM

**Record Details:**
- **Type:** TXT
- **Name:** `_dmarc` (or `_dmarc.wizjock.com`)
- **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`
- **TTL:** 3600

**DMARC Policy Levels:**

1. **p=none** (Monitoring only)
   - Use this initially to monitor without affecting delivery
   - Receive reports but don't block emails
   - Good for testing

2. **p=quarantine** (Recommended for production)
   - Failed emails go to spam folder
   - Legitimate emails still delivered
   - Balanced security

3. **p=reject** (Strictest)
   - Failed emails are rejected completely
   - Use only after testing with p=quarantine
   - Maximum security

**Recommended DMARC Record:**

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
```

**Explanation:**
- `v=DMARC1` - DMARC version
- `p=quarantine` - Quarantine suspicious emails
- `rua=mailto:dmarc@wizjock.com` - Send aggregate reports here
- `ruf=mailto:dmarc@wizjock.com` - Send forensic reports here
- `fo=1` - Generate report on any failure
- `adkim=s` - Strict DKIM alignment
- `aspf=s` - Strict SPF alignment
- `pct=100` - Apply policy to 100% of emails

**Common Mistakes:**
- ❌ Missing `v=DMARC1;` prefix
- ❌ Invalid email address for reports
- ❌ Typos in policy values
- ❌ Missing semicolons between parameters

### DNS Propagation

After adding records:

1. **Wait for propagation** (usually 5-60 minutes, can take up to 48 hours)

2. **Check DNS propagation:**
   ```bash
   # Check SPF
   dig TXT wizjock.com
   
   # Check DKIM
   dig TXT resend._domainkey.wizjock.com
   
   # Check DMARC
   dig TXT _dmarc.wizjock.com
   ```

3. **Use online tools:**
   - https://mxtoolbox.com/SuperTool.aspx
   - https://dnschecker.org/
   - Enter your domain and check TXT records

### Verify in Resend Dashboard

1. **Go to Resend dashboard > Domains**
2. **Click on your domain (wizjock.com)**
3. **Check verification status:**
   - ✅ SPF: Verified
   - ✅ DKIM: Verified
   - ✅ DMARC: Verified

4. **If not verified:**
   - Click "Verify" button
   - Wait a few minutes and try again
   - Check DNS records are correct

---

## 4. API Key Generation

### Step 1: Create API Key

1. **Navigate to API Keys:**
   - Log in to Resend dashboard
   - Click "API Keys" in left sidebar
   - Click "Create API Key" button

2. **Configure API Key:**
   - **Name:** Production - WizJock
   - **Permission:** Full Access (or Sending Access)
   - **Domain:** wizjock.com (optional, for additional security)
   - Click "Create"

3. **Copy API Key:**
   - API key will be displayed ONCE
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **IMPORTANT:** Copy it now - you won't see it again!
   - Store securely (password manager, secret manager)

### Step 2: Store API Key Securely

**DO:**
- ✅ Store in environment variables
- ✅ Use your platform's secret manager
- ✅ Keep in password manager (1Password, LastPass, etc.)
- ✅ Limit access to authorized personnel only

**DON'T:**
- ❌ Commit to version control
- ❌ Share via email or Slack
- ❌ Hardcode in application code
- ❌ Store in plain text files

### Step 3: Add to Environment Variables

**Backend .env file:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com
```

**Platform-specific:**

**Vercel:**
```bash
# In Vercel dashboard: Settings > Environment Variables
RESEND_API_KEY=re_xxx...
```

**Heroku:**
```bash
heroku config:set RESEND_API_KEY=re_xxx... --app your-app
```

**Railway:**
```bash
# In Railway dashboard: Variables tab
RESEND_API_KEY=re_xxx...
```

### API Key Best Practices

1. **Use separate keys for each environment:**
   - Development: `re_dev_xxx...`
   - Staging: `re_staging_xxx...`
   - Production: `re_prod_xxx...`

2. **Rotate keys regularly:**
   - Every 90 days recommended
   - After team member leaves
   - If key is compromised

3. **Monitor key usage:**
   - Check Resend dashboard for unusual activity
   - Set up alerts for high volume
   - Review logs regularly

4. **Revoke compromised keys immediately:**
   - Go to API Keys in Resend dashboard
   - Click "Revoke" on compromised key
   - Generate new key
   - Update environment variables

---

## 5. Email Testing

### Test 1: Verify Environment Variables

```bash
cd packages/backend

# Check if variables are set (don't print actual values)
node -e "console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Set' : '✗ Not set')"
node -e "console.log('FROM_EMAIL:', process.env.FROM_EMAIL)"
node -e "console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL)"
```

### Test 2: Send Test Email via API

```bash
# Test Resend API directly
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key_here' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "hello@wizjock.com",
    "to": "your-email@example.com",
    "subject": "Test Email from WizJock",
    "html": "<p>This is a test email to verify Resend configuration.</p>"
  }'
```

**Expected response:**
```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

**If error:**
```json
{
  "statusCode": 401,
  "message": "Invalid API key"
}
```

### Test 3: Send Test Email via Application

```bash
cd packages/backend

# Start application
npm start

# In another terminal, submit test application
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "your-email@example.com",
    "phone": "+1234567890",
    "bettingExperience": "intermediate",
    "smsConsent": true
  }'
```

**Expected:**
1. API returns success response
2. You receive confirmation email at your-email@example.com
3. Admin receives notification at ADMIN_EMAIL

### Test 4: Verify Email Delivery

**Check your inbox:**
1. **Confirmation email should arrive within 60 seconds**
2. **Subject:** "WizJock Application Received - Next Steps"
3. **From:** hello@wizjock.com (or "WizJock Team <hello@wizjock.com>")
4. **Content:** Personalized with applicant name

**Check admin inbox:**
1. **Admin notification should arrive within 60 seconds**
2. **Subject:** "New WizJock Application: Test User"
3. **From:** hello@wizjock.com
4. **Content:** All application details

**Check spam folder if not in inbox!**

### Test 5: Verify Email Authentication

**In Gmail:**
1. Open the test email
2. Click three dots (⋮) > "Show original"
3. Check authentication results:
   ```
   SPF: PASS
   DKIM: PASS
   DMARC: PASS
   ```

**If any fail:**
- SPF FAIL: Check SPF DNS record
- DKIM FAIL: Check DKIM DNS records
- DMARC FAIL: Check DMARC DNS record and ensure SPF/DKIM pass

### Test 6: Check Resend Dashboard

1. **Go to Resend dashboard > Emails**
2. **Verify test emails appear in list**
3. **Check status:**
   - ✅ Delivered
   - ⚠️ Bounced (check email address)
   - ⚠️ Complained (marked as spam)

4. **Click on email to see details:**
   - Delivery status
   - Open rate (if tracking enabled)
   - Click rate (if tracking enabled)
   - Full email content

### Test 7: Test Error Handling

**Test invalid email:**
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "invalid-email",
    "phone": "+1234567890",
    "bettingExperience": "intermediate",
    "smsConsent": true
  }'
```

**Expected:** Validation error, no email sent

**Test email service failure:**
```bash
# Temporarily set invalid API key
export RESEND_API_KEY=re_invalid_key

# Submit application
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "bettingExperience": "intermediate",
    "smsConsent": true
  }'

# Expected: Application still succeeds, but email fails
# Check logs for email error
```

---

## 6. Troubleshooting

### Issue: Domain not verifying

**Symptoms:**
- DNS records added but domain shows "Not Verified" in Resend

**Solutions:**

1. **Wait for DNS propagation:**
   - Can take up to 48 hours (usually much faster)
   - Check propagation: https://dnschecker.org/

2. **Verify DNS records are correct:**
   ```bash
   dig TXT wizjock.com
   dig TXT resend._domainkey.wizjock.com
   dig TXT _dmarc.wizjock.com
   ```

3. **Check for typos:**
   - Record name must be exact
   - Record value must be complete (no truncation)
   - No extra spaces or line breaks

4. **Check DNS provider quirks:**
   - Some providers require `@` for root domain
   - Some require full domain name (wizjock.com)
   - Some automatically add domain to subdomain records

5. **Click "Verify" in Resend dashboard:**
   - Sometimes manual verification trigger is needed

### Issue: Emails going to spam

**Symptoms:**
- Emails delivered but in spam folder

**Solutions:**

1. **Check email authentication:**
   - Verify SPF, DKIM, DMARC all pass
   - Use "Show original" in Gmail to check

2. **Improve email content:**
   - Avoid spam trigger words (FREE, URGENT, ACT NOW)
   - Include plain text version
   - Add unsubscribe link
   - Use professional formatting

3. **Warm up your domain:**
   - Start with low volume (10-20 emails/day)
   - Gradually increase over 2-4 weeks
   - Maintain consistent sending pattern

4. **Check sender reputation:**
   - Use https://www.senderscore.org/
   - Check if domain is blacklisted: https://mxtoolbox.com/blacklists.aspx

5. **Ask recipients to whitelist:**
   - Add hello@wizjock.com to contacts
   - Mark as "Not Spam"

### Issue: Emails not sending

**Symptoms:**
- API returns success but no email received

**Solutions:**

1. **Check API key is valid:**
   ```bash
   curl -X GET 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_your_api_key_here'
   ```

2. **Check FROM_EMAIL is verified:**
   - Must be from verified domain (wizjock.com)
   - Can't use gmail.com, yahoo.com, etc.

3. **Check recipient email is valid:**
   - No typos
   - Domain exists
   - Mailbox not full

4. **Check Resend dashboard:**
   - Go to Emails tab
   - Look for bounces or errors
   - Check error message

5. **Check application logs:**
   ```bash
   # Look for email service errors
   grep -i "email" logs/error.log
   ```

6. **Test with different recipient:**
   - Try different email provider
   - Gmail, Outlook, Yahoo, etc.

### Issue: High bounce rate

**Symptoms:**
- Many emails bouncing (not delivered)

**Solutions:**

1. **Validate email addresses:**
   - Use email validation library
   - Check for typos
   - Verify domain exists

2. **Remove invalid addresses:**
   - Hard bounces: Remove immediately
   - Soft bounces: Retry, then remove

3. **Check for spam traps:**
   - Don't buy email lists
   - Use double opt-in
   - Remove inactive addresses

4. **Monitor bounce rate:**
   - Should be < 5%
   - High bounce rate hurts sender reputation

### Issue: API key not working

**Symptoms:**
- 401 Unauthorized error

**Solutions:**

1. **Verify API key is correct:**
   - Check for typos
   - Ensure no extra spaces
   - Verify it starts with `re_`

2. **Check API key permissions:**
   - Must have "Sending Access" or "Full Access"
   - Check in Resend dashboard > API Keys

3. **Verify API key not revoked:**
   - Check status in Resend dashboard
   - Generate new key if revoked

4. **Check environment variable is loaded:**
   ```bash
   node -e "console.log(process.env.RESEND_API_KEY)"
   ```

5. **Restart application after setting variable:**
   - Environment variables loaded at startup
   - Must restart to pick up changes

### Issue: DMARC reports showing failures

**Symptoms:**
- Receiving DMARC reports with failed authentications

**Solutions:**

1. **Check SPF alignment:**
   - FROM domain must match SPF domain
   - Use same domain for both

2. **Check DKIM alignment:**
   - DKIM signature domain must match FROM domain
   - Verify DKIM records are correct

3. **Review DMARC policy:**
   - Start with `p=none` to monitor
   - Move to `p=quarantine` after testing
   - Only use `p=reject` when confident

4. **Analyze DMARC reports:**
   - Use DMARC analyzer tool
   - Identify sources of failures
   - Fix issues before tightening policy

---

## Checklist

Before proceeding to next deployment step:

- [ ] Resend account created and verified
- [ ] Domain added to Resend (wizjock.com)
- [ ] SPF record added to DNS
- [ ] DKIM records added to DNS
- [ ] DMARC record added to DNS
- [ ] DNS records verified (all passing)
- [ ] Domain verified in Resend dashboard
- [ ] API key generated and stored securely
- [ ] RESEND_API_KEY set in environment variables
- [ ] FROM_EMAIL set to hello@wizjock.com
- [ ] ADMIN_EMAIL set to team@wizjock.com
- [ ] Test email sent successfully via API
- [ ] Test email sent successfully via application
- [ ] Confirmation email received
- [ ] Admin notification received
- [ ] Email authentication verified (SPF, DKIM, DMARC pass)
- [ ] Emails not going to spam
- [ ] Error handling tested
- [ ] Resend dashboard shows successful deliveries

---

## Next Steps

After completing email configuration:

1. ✅ Mark email configuration as complete
2. ✅ Proceed with Google Analytics 4 configuration
3. ✅ Continue with remaining deployment preparation steps

---

## Support Resources

- **Resend Documentation:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **SPF/DKIM/DMARC Guide:** https://resend.com/docs/dashboard/domains/authentication
- **Email Best Practices:** https://resend.com/docs/knowledge-base/email-best-practices

---

**Remember:** Test thoroughly in staging before using in production!
