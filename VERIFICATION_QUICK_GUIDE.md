# Post-Deployment Verification - Quick Guide

This is a condensed guide for quick verification. For comprehensive verification, see `POST_DEPLOYMENT_VERIFICATION.md`.

## Prerequisites

- Production site is deployed and accessible
- You have access to:
  - Google Analytics 4 dashboard
  - Admin email inbox
  - Production database (for verification)
  - Hosting platform logs

## Quick Verification (15 minutes)

### 1. Run Automated Scripts (5 min)

```bash
# Basic endpoint check
./scripts/post-deployment-verification.sh

# Test application flow
./scripts/test-application-flow.sh

# Verify GA4 setup
node scripts/verify-ga4-events.js
```

### 2. Manual CTA Test (3 min)

Visit https://wizjock.com and click each CTA:
- [ ] Header "GET STARTED" → goes to /apply
- [ ] Hero "Request Access" → goes to /apply
- [ ] Pricing "Get Started" (all 3) → goes to /apply
- [ ] Final "Request Access Now" → goes to /apply

### 3. Test Application Form (5 min)

1. Go to https://wizjock.com/apply
2. Fill out form with test data
3. Submit and verify:
   - [ ] Success message appears
   - [ ] Confirmation email received (check inbox)
   - [ ] Admin notification received (check admin inbox)

### 4. Check Legal Pages (2 min)

Verify all pages load (no 404):
- [ ] https://wizjock.com/privacy
- [ ] https://wizjock.com/terms
- [ ] https://wizjock.com/responsible-gambling
- [ ] https://wizjock.com/about
- [ ] https://wizjock.com/contact

## Quick GA4 Check (5 minutes)

1. Open GA4 → Reports → Realtime
2. Visit the site and verify events appear:
   - [ ] page_view
   - [ ] cta_click (click a CTA)
   - [ ] form_start (click form field)
   - [ ] form_submit (submit form)

## Quick Lighthouse Check (5 minutes)

```bash
# If lighthouse CLI is installed
./scripts/lighthouse-audit.sh

# Or manually in Chrome DevTools:
# 1. Open DevTools → Lighthouse
# 2. Run audit
# 3. Verify: Performance ≥ 80, Accessibility ≥ 90
```

## Critical Checks Checklist

Must all pass:

- [ ] All CTAs work and link to /apply
- [ ] Application form submits successfully
- [ ] Confirmation email received
- [ ] Admin notification received
- [ ] All legal pages return 200 (not 404)
- [ ] GA4 events are tracking
- [ ] No critical errors in browser console
- [ ] No critical errors in server logs
- [ ] HTTPS is enforced
- [ ] Site loads on mobile

## If Any Check Fails

1. **Document the failure** - Screenshot and note details
2. **Check severity**:
   - P0 (Critical): Site broken, no applications possible → Fix immediately
   - P1 (High): Major feature broken → Fix within 24 hours
   - P2 (Medium): Minor issue → Fix within week
3. **Review logs** for error details
4. **Consider rollback** if P0 issue
5. **Fix and re-verify**

## Common Issues & Quick Fixes

### CTAs don't link to /apply
- Check: React Router is configured
- Check: Build includes latest code
- Fix: Redeploy with correct code

### Application form doesn't submit
- Check: API endpoint is accessible
- Check: CORS is configured correctly
- Check: Database connection is working
- Fix: Review API logs, check environment variables

### Emails not received
- Check: Resend API key is set
- Check: Email addresses are correct
- Check: Emails in spam folder
- Check: Resend dashboard for delivery status
- Fix: Verify environment variables, check DNS records

### GA4 events not tracking
- Check: Measurement ID is correct
- Check: gtag script is loaded (view page source)
- Check: No ad blockers interfering
- Check: Browser console for errors
- Fix: Verify VITE_GA_MEASUREMENT_ID, rebuild

### Legal pages return 404
- Check: Routes are configured in React Router
- Check: Build includes all pages
- Fix: Verify routes in App.tsx, redeploy

## Monitoring Commands

```bash
# Check if site is up
curl -I https://wizjock.com

# Test API endpoint
curl -X POST https://wizjock.com/api/applications \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","phone":"+1234567890","bettingExperience":"beginner","smsConsent":false}'

# Check response time
curl -w "@-" -o /dev/null -s https://wizjock.com <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

## 24-Hour Monitoring

After initial verification, monitor for 24 hours:

```bash
# Start automated monitoring (runs every 5 minutes)
./scripts/setup-monitoring.sh
```

Or manually check at these intervals:
- **Hour 1**: Verify no immediate issues
- **Hour 4**: Check application submissions and emails
- **Hour 8**: Review GA4 events and metrics
- **Hour 12**: Check Core Web Vitals
- **Hour 24**: Full review and sign-off

## Key Metrics to Track

| Metric | Target | Where to Check |
|--------|--------|----------------|
| Application submissions | > 0 | Database or admin dashboard |
| Email delivery rate | 100% | Resend dashboard |
| API error rate | < 1% | Server logs |
| Page load time (LCP) | < 2.5s | GA4 or Lighthouse |
| Uptime | 100% | Hosting platform |

## Emergency Contacts

**If critical issue found:**
1. Check error logs first
2. Attempt quick fix if possible (< 15 min)
3. Consider rollback if fix not immediate
4. Contact technical lead: [Add contact info]
5. Document issue for post-mortem

## Rollback Command

```bash
# If using Vercel
vercel rollback [deployment-url]

# If using other platform
# Follow platform-specific rollback procedure
```

## Success Criteria

✅ **Ready for production** if:
- All automated scripts pass
- All CTAs work
- Application form works
- Emails are delivered
- Legal pages load
- GA4 tracks events
- No critical errors
- Performance ≥ 80
- Accessibility ≥ 90

❌ **Requires fixes** if:
- Any critical check fails
- Error rate > 5%
- Performance < 70
- Accessibility < 80
- Emails not delivered

## Next Steps After Verification

1. ✅ Complete verification checklist
2. 📝 Fill out VERIFICATION_SUMMARY.md
3. 👀 Monitor for 24 hours
4. 📊 Review metrics daily for first week
5. 🎉 Celebrate successful launch!

---

**Quick Links:**
- Full Verification Guide: `POST_DEPLOYMENT_VERIFICATION.md`
- Verification Summary Template: `VERIFICATION_SUMMARY.md`
- Deployment Guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Scripts: `scripts/` directory
