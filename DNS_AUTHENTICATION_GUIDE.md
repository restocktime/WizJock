# DNS Authentication Guide (SPF, DKIM, DMARC)

Complete guide for setting up email authentication DNS records.

## Overview

Email authentication prevents your emails from being marked as spam and protects your domain from being used in phishing attacks.

**Three authentication methods:**
1. **SPF** (Sender Policy Framework) - Authorizes mail servers
2. **DKIM** (DomainKeys Identified Mail) - Adds digital signature
3. **DMARC** (Domain-based Message Authentication) - Defines policy

**All three are required for optimal email deliverability.**

---

## Quick Start

### 1. Get DNS Records from Resend

1. Log in to https://resend.com
2. Go to Domains > wizjock.com
3. Copy the DNS records provided

### 2. Add Records to Your DNS Provider

Log into your DNS provider and add the records below.

### 3. Wait for Verification

DNS propagation can take 5 minutes to 48 hours (usually < 1 hour).

---

## SPF (Sender Policy Framework)

### What is SPF?

SPF tells email receivers which mail servers are authorized to send email on behalf of your domain.

### Why is it important?

- Prevents spammers from spoofing your domain
- Improves email deliverability
- Required for DMARC to work

### SPF Record Details

**Record Type:** TXT  
**Name:** `@` (or blank, or `wizjock.com` - depends on DNS provider)  
**Value:** `v=spf1 include:_spf.resend.com ~all`  
**TTL:** 3600 (1 hour)

### SPF Record Explanation

```
v=spf1 include:_spf.resend.com ~all
│      │                       │
│      │                       └─ Soft fail for unauthorized servers
│      └─ Include Resend's mail servers
└─ SPF version 1
```

**Mechanisms:**
- `v=spf1` - SPF version (always required)
- `include:_spf.resend.com` - Authorize Resend's mail servers
- `~all` - Soft fail (mark as suspicious but don't reject)

**Alternative endings:**
- `~all` - Soft fail (recommended) - suspicious but deliver
- `-all` - Hard fail (strict) - reject unauthorized emails
- `?all` - Neutral - no policy
- `+all` - Pass all (NOT RECOMMENDED) - allows anyone to send

### Adding SPF Record

#### Cloudflare

1. Log in to Cloudflare
2. Select your domain (wizjock.com)
3. Go to DNS > Records
4. Click "Add record"
5. Fill in:
   - **Type:** TXT
   - **Name:** `@`
   - **Content:** `v=spf1 include:_spf.resend.com ~all`
   - **TTL:** Auto
6. Click "Save"

#### GoDaddy

1. Log in to GoDaddy
2. Go to My Products > DNS
3. Click "Add" under Records
4. Fill in:
   - **Type:** TXT
   - **Name:** `@`
   - **Value:** `v=spf1 include:_spf.resend.com ~all`
   - **TTL:** 1 Hour
5. Click "Save"

#### Namecheap

1. Log in to Namecheap
2. Go to Domain List > Manage
3. Advanced DNS tab
4. Click "Add New Record"
5. Fill in:
   - **Type:** TXT Record
   - **Host:** `@`
   - **Value:** `v=spf1 include:_spf.resend.com ~all`
   - **TTL:** Automatic
6. Click "Save"

#### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Go to DNS
4. Scroll to "Custom resource records"
5. Fill in:
   - **Name:** `@`
   - **Type:** TXT
   - **TTL:** 1H
   - **Data:** `v=spf1 include:_spf.resend.com ~all`
6. Click "Add"

#### AWS Route 53

1. Log in to AWS Console
2. Go to Route 53 > Hosted Zones
3. Select your domain
4. Click "Create record"
5. Fill in:
   - **Record name:** (leave blank)
   - **Record type:** TXT
   - **Value:** `"v=spf1 include:_spf.resend.com ~all"`
   - **TTL:** 3600
6. Click "Create records"

### Multiple Email Providers

If you use multiple email services (e.g., Resend + Google Workspace):

```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

**Important:** Only ONE SPF record per domain!

### Verify SPF Record

```bash
# Check SPF record
dig TXT wizjock.com

# Or use nslookup
nslookup -type=TXT wizjock.com

# Expected output:
# wizjock.com. 3600 IN TXT "v=spf1 include:_spf.resend.com ~all"
```

**Online tools:**
- https://mxtoolbox.com/spf.aspx
- https://www.kitterman.com/spf/validate.html

---

## DKIM (DomainKeys Identified Mail)

### What is DKIM?

DKIM adds a digital signature to your emails that proves they haven't been tampered with and came from your domain.

### Why is it important?

- Verifies email authenticity
- Prevents email tampering
- Improves deliverability
- Required for DMARC

### DKIM Record Details

**Resend provides unique DKIM records for your domain.**

**Record Type:** TXT  
**Name:** `resend._domainkey` (or `resend._domainkey.wizjock.com`)  
**Value:** `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...` (very long)  
**TTL:** 3600

**Important:** The value is UNIQUE to your domain. Copy it exactly from Resend dashboard!

### DKIM Record Explanation

```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
│        │      │
│        │      └─ Public key (very long base64 string)
│        └─ Key type (RSA)
└─ DKIM version 1
```

### Adding DKIM Record

#### Cloudflare

1. Log in to Cloudflare
2. Select your domain
3. Go to DNS > Records
4. Click "Add record"
5. Fill in:
   - **Type:** TXT
   - **Name:** `resend._domainkey`
   - **Content:** (paste EXACT value from Resend)
   - **TTL:** Auto
6. Click "Save"

**Note:** Cloudflare may show a warning about long TXT records. This is normal for DKIM.

#### GoDaddy

1. Log in to GoDaddy
2. Go to My Products > DNS
3. Click "Add" under Records
4. Fill in:
   - **Type:** TXT
   - **Name:** `resend._domainkey`
   - **Value:** (paste EXACT value from Resend)
   - **TTL:** 1 Hour
5. Click "Save"

#### Namecheap

1. Log in to Namecheap
2. Go to Domain List > Manage
3. Advanced DNS tab
4. Click "Add New Record"
5. Fill in:
   - **Type:** TXT Record
   - **Host:** `resend._domainkey`
   - **Value:** (paste EXACT value from Resend)
   - **TTL:** Automatic
6. Click "Save"

#### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Go to DNS
4. Scroll to "Custom resource records"
5. Fill in:
   - **Name:** `resend._domainkey`
   - **Type:** TXT
   - **TTL:** 1H
   - **Data:** (paste EXACT value from Resend)
6. Click "Add"

#### AWS Route 53

1. Log in to AWS Console
2. Go to Route 53 > Hosted Zones
3. Select your domain
4. Click "Create record"
5. Fill in:
   - **Record name:** `resend._domainkey`
   - **Record type:** TXT
   - **Value:** `"v=DKIM1; k=rsa; p=..."` (paste EXACT value from Resend)
   - **TTL:** 3600
6. Click "Create records"

### Common DKIM Issues

**Issue: Value too long**
- Some DNS providers have character limits
- Solution: Use CNAME record instead (if Resend provides one)
- Or split into multiple strings (check provider documentation)

**Issue: Extra quotes or spaces**
- Copy value exactly as provided
- Don't add extra quotes or line breaks
- Some providers add quotes automatically

**Issue: Wrong subdomain**
- Must be exactly `resend._domainkey`
- Not `_domainkey` or `resend.domainkey`

### Verify DKIM Record

```bash
# Check DKIM record
dig TXT resend._domainkey.wizjock.com

# Or use nslookup
nslookup -type=TXT resend._domainkey.wizjock.com

# Expected output:
# resend._domainkey.wizjock.com. 3600 IN TXT "v=DKIM1; k=rsa; p=MIGfMA..."
```

**Online tools:**
- https://mxtoolbox.com/dkim.aspx
- https://dkimvalidator.com/

---

## DMARC (Domain-based Message Authentication)

### What is DMARC?

DMARC tells email receivers what to do with emails that fail SPF or DKIM checks.

### Why is it important?

- Protects your domain from phishing
- Provides visibility into email authentication
- Improves deliverability
- Receives reports on email authentication

### DMARC Record Details

**Record Type:** TXT  
**Name:** `_dmarc` (or `_dmarc.wizjock.com`)  
**Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`  
**TTL:** 3600

### DMARC Record Explanation

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
│         │            │                              │                              │     │         │         │
│         │            │                              │                              │     │         │         └─ Apply to 100% of emails
│         │            │                              │                              │     │         └─ Strict SPF alignment
│         │            │                              │                              │     └─ Strict DKIM alignment
│         │            │                              │                              └─ Report on any failure
│         │            │                              └─ Forensic reports email
│         │            └─ Aggregate reports email
│         └─ Policy: quarantine failed emails
└─ DMARC version 1
```

### DMARC Policies

**p=none** (Monitoring)
- No action taken on failed emails
- Only receive reports
- Use this initially to monitor

**p=quarantine** (Recommended)
- Failed emails go to spam folder
- Legitimate emails still delivered
- Good balance of security and deliverability

**p=reject** (Strict)
- Failed emails are rejected completely
- Maximum security
- Use only after testing with p=quarantine

### DMARC Alignment

**adkim=s** (Strict DKIM alignment)
- DKIM signature domain must exactly match FROM domain
- More secure

**adkim=r** (Relaxed DKIM alignment)
- DKIM signature domain can be subdomain
- More flexible

**aspf=s** (Strict SPF alignment)
- SPF domain must exactly match FROM domain
- More secure

**aspf=r** (Relaxed SPF alignment)
- SPF domain can be subdomain
- More flexible

### Recommended DMARC Policies

**Phase 1: Monitoring (First 2 weeks)**
```
v=DMARC1; p=none; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=r; aspf=r; pct=100
```

**Phase 2: Quarantine (After monitoring)**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
```

**Phase 3: Reject (After successful quarantine)**
```
v=DMARC1; p=reject; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
```

### Adding DMARC Record

#### Cloudflare

1. Log in to Cloudflare
2. Select your domain
3. Go to DNS > Records
4. Click "Add record"
5. Fill in:
   - **Type:** TXT
   - **Name:** `_dmarc`
   - **Content:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`
   - **TTL:** Auto
6. Click "Save"

#### GoDaddy

1. Log in to GoDaddy
2. Go to My Products > DNS
3. Click "Add" under Records
4. Fill in:
   - **Type:** TXT
   - **Name:** `_dmarc`
   - **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`
   - **TTL:** 1 Hour
5. Click "Save"

#### Namecheap

1. Log in to Namecheap
2. Go to Domain List > Manage
3. Advanced DNS tab
4. Click "Add New Record"
5. Fill in:
   - **Type:** TXT Record
   - **Host:** `_dmarc`
   - **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`
   - **TTL:** Automatic
6. Click "Save"

#### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Go to DNS
4. Scroll to "Custom resource records"
5. Fill in:
   - **Name:** `_dmarc`
   - **Type:** TXT
   - **TTL:** 1H
   - **Data:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100`
6. Click "Add"

#### AWS Route 53

1. Log in to AWS Console
2. Go to Route 53 > Hosted Zones
3. Select your domain
4. Click "Create record"
5. Fill in:
   - **Record name:** `_dmarc`
   - **Record type:** TXT
   - **Value:** `"v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100"`
   - **TTL:** 3600
6. Click "Create records"

### DMARC Reports

**Aggregate Reports (rua):**
- Daily XML reports
- Summary of authentication results
- Sent to rua email address

**Forensic Reports (ruf):**
- Real-time failure reports
- Detailed information about failed emails
- Sent to ruf email address

**Setting up report mailbox:**

1. **Create email address:** dmarc@wizjock.com
2. **Set up email forwarding** to your main email
3. **Use DMARC analyzer tool** to parse reports:
   - https://dmarc.postmarkapp.com/
   - https://dmarcian.com/
   - https://mxtoolbox.com/dmarc.aspx

### Verify DMARC Record

```bash
# Check DMARC record
dig TXT _dmarc.wizjock.com

# Or use nslookup
nslookup -type=TXT _dmarc.wizjock.com

# Expected output:
# _dmarc.wizjock.com. 3600 IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com..."
```

**Online tools:**
- https://mxtoolbox.com/dmarc.aspx
- https://dmarcian.com/dmarc-inspector/

---

## Complete DNS Configuration Summary

### All Records to Add

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600

# DKIM Record
Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (from Resend)
TTL: 3600

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@wizjock.com; ruf=mailto:dmarc@wizjock.com; fo=1; adkim=s; aspf=s; pct=100
TTL: 3600
```

---

## Verification Checklist

### DNS Propagation Check

```bash
# Check all records
dig TXT wizjock.com                          # SPF
dig TXT resend._domainkey.wizjock.com        # DKIM
dig TXT _dmarc.wizjock.com                   # DMARC

# Or use online tool
# https://dnschecker.org/
```

### Resend Dashboard Check

1. Go to Resend dashboard > Domains
2. Click on wizjock.com
3. Verify all records show green checkmarks:
   - ✅ SPF: Verified
   - ✅ DKIM: Verified
   - ✅ DMARC: Verified

### Email Authentication Check

1. Send test email
2. Receive email in Gmail
3. Click ⋮ > Show original
4. Check authentication results:
   ```
   SPF: PASS with IP xxx.xxx.xxx.xxx
   DKIM: PASS with domain wizjock.com
   DMARC: PASS
   ```

---

## Troubleshooting

### SPF Issues

**Problem:** SPF not passing

**Solutions:**
1. Check SPF record exists: `dig TXT wizjock.com`
2. Verify value is correct: `v=spf1 include:_spf.resend.com ~all`
3. Check for multiple SPF records (only one allowed)
4. Wait for DNS propagation (up to 48 hours)
5. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)

### DKIM Issues

**Problem:** DKIM not passing

**Solutions:**
1. Check DKIM record exists: `dig TXT resend._domainkey.wizjock.com`
2. Verify value matches exactly what Resend provided
3. Check for extra spaces or line breaks
4. Verify subdomain is correct: `resend._domainkey`
5. Wait for DNS propagation

### DMARC Issues

**Problem:** DMARC not passing

**Solutions:**
1. Ensure SPF and DKIM pass first (DMARC requires both)
2. Check DMARC record exists: `dig TXT _dmarc.wizjock.com`
3. Verify policy is not too strict (start with p=none)
4. Check alignment settings (use relaxed initially)
5. Review DMARC reports for specific failures

---

## Checklist

- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC record added to DNS
- [ ] DNS propagation complete (verified with dig/nslookup)
- [ ] All records verified in Resend dashboard
- [ ] Test email sent
- [ ] Email authentication verified (SPF, DKIM, DMARC all pass)
- [ ] Emails not going to spam
- [ ] DMARC reports email set up (dmarc@wizjock.com)

---

## Next Steps

1. ✅ Complete DNS configuration
2. ✅ Verify all records
3. ✅ Test email delivery
4. ✅ Monitor DMARC reports
5. ✅ Gradually tighten DMARC policy (none → quarantine → reject)

---

## Support Resources

- **SPF Checker:** https://www.kitterman.com/spf/validate.html
- **DKIM Checker:** https://dkimvalidator.com/
- **DMARC Checker:** https://dmarcian.com/dmarc-inspector/
- **DNS Propagation:** https://dnschecker.org/
- **MX Toolbox:** https://mxtoolbox.com/
- **Resend Docs:** https://resend.com/docs/dashboard/domains/authentication
