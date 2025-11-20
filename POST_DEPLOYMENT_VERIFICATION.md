# Post-Deployment Verification Checklist

This document provides a comprehensive checklist for verifying the WizJock landing page deployment.

## Automated Verification

Run the automated verification script:

```bash
# Set production URL (if different from default)
export PRODUCTION_URL=https://wizjock.com
export API_URL=https://wizjock.com/api

# Run verification script
./scripts/post-deployment-verification.sh
```

## Manual Verification Checklist

### 1. Test All CTAs Link to /apply

- [ ] **Header "GET STARTED" button**
  - Navigate to: https://wizjock.com
  - Click the "GET STARTED" button in the header
  - Verify it navigates to: https://wizjock.com/apply
  - Verify the application form loads correctly

- [ ] **Hero "Request Access" button**
  - Scroll to hero section on landing page
  - Click "Request Access" button
  - Verify it navigates to /apply

- [ ] **Pricing Card "Get Started" buttons (all 3 tiers)**
  - Scroll to pricing section
  - Click "Get Started" on Starter tier → verify navigates to /apply
  - Click "Get Started" on Pro tier → verify navigates to /apply
  - Click "Get Started" on Elite tier → verify navigates to /apply

- [ ] **Final CTA "Request Access Now" button**
  - Scroll to bottom of landing page
  - Click "Request Access Now" button
  - Verify it navigates to /apply

### 2. Submit Test Application and Verify Emails

#### Test Application Submission

- [ ] Navigate to https://wizjock.com/apply
- [ ] Fill out the form with test data:
  - Full Name: `Test User`
  - Email: `test+[timestamp]@yourdomain.com` (use unique email)
  - Phone: `+1234567890`
  - Betting Experience: Select any option
  - SMS Consent: Check the box
- [ ] Click "Submit Application"
- [ ] Verify success message appears: "Application received! We'll review your request and contact you within 24-48 hours."

#### Verify Confirmation Email

- [ ] Check the test email inbox within 2 minutes
- [ ] Verify confirmation email received
- [ ] Verify email subject: "WizJock Application Received - Next Steps"
- [ ] Verify email contains:
  - Applicant's name
  - Expected response time (24-48 hours)
  - WhatsApp link
  - Footer with Privacy Policy and Contact links
- [ ] Verify email is from: hello@wizjock.com or team@wizjock.com
- [ ] Verify email formatting looks professional

#### Verify Admin Notification Email

- [ ] Check admin email inbox (configured in ADMIN_EMAIL env var)
- [ ] Verify admin notification received
- [ ] Verify email subject: "New WizJock Application: Test User"
- [ ] Verify email contains:
  - Applicant name
  - Email address
  - Phone number
  - Betting experience
  - SMS consent status
  - Submission timestamp
  - Application ID

#### Test Error Handling

- [ ] Try submitting the same email again
- [ ] Verify error message: "An application with this email already exists"
- [ ] Try submitting with invalid email format
- [ ] Verify validation error appears
- [ ] Try submitting with missing required fields
- [ ] Verify validation errors appear

### 3. Check All Legal Pages Return 200

- [ ] **Privacy Policy**: https://wizjock.com/privacy
  - Verify page loads (no 404)
  - Verify content is complete and readable
  - Verify last updated date is present

- [ ] **Terms of Use**: https://wizjock.com/terms
  - Verify page loads (no 404)
  - Verify disclaimer: "Past performance does not guarantee future results"
  - Verify content is complete

- [ ] **Responsible Gambling**: https://wizjock.com/responsible-gambling
  - Verify page loads (no 404)
  - Verify 1-800-GAMBLER helpline is present
  - Verify NCPG links are present
  - Verify 21+ age policy is mentioned

- [ ] **About Us**: https://wizjock.com/about
  - Verify page loads (no 404)
  - Verify company mission is present
  - Verify content is complete

- [ ] **Contact**: https://wizjock.com/contact
  - Verify page loads (no 404)
  - Verify contact email is present
  - Verify content is complete

- [ ] **Footer Links**
  - Verify footer appears on landing page
  - Verify footer appears on all legal pages
  - Verify all footer links work correctly
  - Verify copyright notice is present
  - Verify "Gamble responsibly. 21+" message is present

### 4. Verify GA4 Events Are Being Tracked

#### Setup GA4 Real-Time View

- [ ] Log into Google Analytics 4
- [ ] Navigate to Reports → Realtime
- [ ] Keep this view open while testing

#### Test Page Views

- [ ] Visit https://wizjock.com
- [ ] Verify `page_view` event appears in GA4 Realtime
- [ ] Navigate to /apply
- [ ] Verify `page_view` event for /apply appears

#### Test CTA Click Events

- [ ] Click "GET STARTED" button in header
- [ ] Verify `cta_click` event appears with location parameter
- [ ] Go back to landing page
- [ ] Click "Request Access" button in hero
- [ ] Verify `cta_click` event appears
- [ ] Click a pricing card "Get Started" button
- [ ] Verify `cta_click` event appears

#### Test Form Events

- [ ] Navigate to /apply
- [ ] Click on the first form field (Full Name)
- [ ] Verify `form_start` event appears in GA4
- [ ] Fill out and submit the form
- [ ] Verify `form_submit` event appears with success=true

#### Test WhatsApp Click Events

- [ ] Click "Join WhatsApp" button on landing page
- [ ] Verify `whatsapp_click` event appears in GA4

#### Verify Event Parameters

- [ ] In GA4 Realtime, click on an event
- [ ] Verify event parameters are being captured:
  - `page_location`
  - `page_title`
  - Custom parameters (location, form_name, success, etc.)

### 5. Monitor Error Logs for First 24 Hours

#### Backend Error Logs

- [ ] Access backend server logs (via hosting platform dashboard or SSH)
- [ ] Monitor for errors in real-time:
  ```bash
  # If using PM2
  pm2 logs backend --lines 100
  
  # If using Docker
  docker logs -f backend-container
  
  # If using Vercel/Netlify
  # Check logs in dashboard
  ```

- [ ] Check for common errors:
  - Database connection errors
  - Email delivery failures
  - API validation errors
  - Rate limiting issues
  - CORS errors

#### Frontend Error Logs

- [ ] Open browser DevTools Console
- [ ] Navigate through the site
- [ ] Check for JavaScript errors
- [ ] Check for failed network requests
- [ ] Check for 404s on assets (images, fonts, etc.)

#### Set Up Error Monitoring (if not already done)

- [ ] Configure error tracking service (Sentry, LogRocket, etc.)
- [ ] Set up alerts for critical errors
- [ ] Set up alerts for high error rates (>5%)

#### Create Monitoring Dashboard

- [ ] Track key metrics:
  - Application submission rate
  - Email delivery success rate
  - API response times
  - Error rates by endpoint
  - Page load times

### 6. Run Lighthouse Audit on Production

#### Desktop Audit

- [ ] Open Chrome DevTools
- [ ] Navigate to Lighthouse tab
- [ ] Select "Desktop" device
- [ ] Select all categories (Performance, Accessibility, Best Practices, SEO)
- [ ] Click "Analyze page load"
- [ ] Verify scores:
  - **Performance: ≥ 80** ✓
  - **Accessibility: ≥ 90** ✓
  - **Best Practices: ≥ 80** ✓
  - **SEO: ≥ 80** ✓

#### Mobile Audit

- [ ] Run Lighthouse audit with "Mobile" device selected
- [ ] Verify scores:
  - **Performance: ≥ 80** ✓
  - **Accessibility: ≥ 90** ✓
  - **Best Practices: ≥ 80** ✓
  - **SEO: ≥ 80** ✓

#### Core Web Vitals

- [ ] Verify Core Web Vitals meet "Good" thresholds:
  - **LCP (Largest Contentful Paint): < 2.5s** ✓
  - **INP (Interaction to Next Paint): < 200ms** ✓
  - **CLS (Cumulative Layout Shift): < 0.1** ✓

#### Address Any Issues

- [ ] If Performance < 80:
  - Check for unoptimized images
  - Check for render-blocking resources
  - Check bundle sizes
  - Review lazy loading implementation

- [ ] If Accessibility < 90:
  - Run axe DevTools scan
  - Fix critical violations
  - Re-run audit

### 7. Cross-Browser Testing

- [ ] **Chrome (Desktop)**
  - Test all CTAs
  - Test form submission
  - Test navigation
  - Verify no console errors

- [ ] **Safari (Desktop)**
  - Test all CTAs
  - Test form submission
  - Test navigation
  - Verify no console errors

- [ ] **Firefox (Desktop)**
  - Test all CTAs
  - Test form submission
  - Test navigation
  - Verify no console errors

- [ ] **Edge (Desktop)**
  - Test all CTAs
  - Test form submission
  - Test navigation
  - Verify no console errors

### 8. Mobile Device Testing

- [ ] **iOS Safari (iPhone)**
  - Test landing page loads correctly
  - Test all CTAs are tappable
  - Test form submission works
  - Test touch targets are adequate (44x44px)
  - Test page is responsive at different orientations

- [ ] **Android Chrome (Android Phone)**
  - Test landing page loads correctly
  - Test all CTAs are tappable
  - Test form submission works
  - Test touch targets are adequate
  - Test page is responsive at different orientations

### 9. Accessibility Testing

- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Verify focus indicators are visible
  - Verify tab order is logical
  - Test form submission with keyboard only

- [ ] **Screen Reader Testing**
  - Test with NVDA (Windows) or VoiceOver (Mac)
  - Verify all images have alt text
  - Verify form labels are announced
  - Verify error messages are announced

- [ ] **Zoom Testing**
  - Zoom browser to 200%
  - Verify all content is still accessible
  - Verify no horizontal scrolling
  - Verify text doesn't overlap

### 10. Security Verification

- [ ] **HTTPS Enforcement**
  - Visit http://wizjock.com
  - Verify it redirects to https://wizjock.com

- [ ] **CORS Configuration**
  - Verify API only accepts requests from allowed origins
  - Test API call from different origin (should fail)

- [ ] **Rate Limiting**
  - Submit 6 applications in quick succession
  - Verify 6th request is rate limited (429 status)

- [ ] **Input Validation**
  - Try submitting SQL injection attempts
  - Try submitting XSS attempts
  - Verify all are properly sanitized/rejected

### 11. Email Deliverability

- [ ] **SPF Record**
  - Check DNS: `dig TXT wizjock.com`
  - Verify SPF record includes Resend

- [ ] **DKIM Record**
  - Check DNS for DKIM record
  - Verify DKIM is configured in Resend

- [ ] **DMARC Record**
  - Check DNS: `dig TXT _dmarc.wizjock.com`
  - Verify DMARC policy is set

- [ ] **Email Spam Score**
  - Send test email to mail-tester.com
  - Verify spam score is < 3/10

### 12. Database Verification

- [ ] **Check Applications Table**
  - Connect to production database
  - Verify test application was stored:
    ```sql
    SELECT * FROM applications ORDER BY created_at DESC LIMIT 5;
    ```
  - Verify all fields are populated correctly
  - Verify timestamps are correct

- [ ] **Check Indexes**
  - Verify indexes exist:
    ```sql
    SELECT indexname FROM pg_indexes WHERE tablename = 'applications';
    ```

### 13. Performance Monitoring

- [ ] **Set up uptime monitoring**
  - Configure service (UptimeRobot, Pingdom, etc.)
  - Monitor https://wizjock.com
  - Monitor https://wizjock.com/api/health (if exists)
  - Set up alerts for downtime

- [ ] **Set up performance monitoring**
  - Configure Real User Monitoring (RUM) in GA4
  - Track Core Web Vitals
  - Set up alerts for performance degradation

## Post-Verification Actions

### If All Checks Pass ✓

- [ ] Document verification results
- [ ] Share results with team
- [ ] Schedule 24-hour follow-up check
- [ ] Monitor error logs for first 24 hours
- [ ] Celebrate successful deployment! 🎉

### If Any Checks Fail ✗

- [ ] Document failed checks
- [ ] Prioritize critical failures (P0)
- [ ] Create fix plan
- [ ] Implement fixes
- [ ] Re-run verification
- [ ] Update deployment documentation

## 24-Hour Monitoring Checklist

After initial verification, monitor these metrics for 24 hours:

- [ ] **Hour 1**: Check error logs, verify no critical errors
- [ ] **Hour 4**: Check application submission rate, verify emails are being delivered
- [ ] **Hour 8**: Check GA4 events, verify tracking is working
- [ ] **Hour 12**: Check Core Web Vitals in GA4, verify performance is stable
- [ ] **Hour 24**: Full review of all metrics, document any issues

## Metrics to Track

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Application submissions | > 0 | ___ | ___ |
| Email delivery rate | 100% | ___% | ___ |
| API error rate | < 1% | ___% | ___ |
| Page load time (LCP) | < 2.5s | ___s | ___ |
| Lighthouse Performance | ≥ 80 | ___ | ___ |
| Lighthouse Accessibility | ≥ 90 | ___ | ___ |
| Uptime | 100% | ___% | ___ |

## Contact Information

**For Issues During Verification:**
- Technical Lead: [Name/Email]
- DevOps: [Name/Email]
- On-Call: [Phone/Slack]

**Escalation Path:**
1. Check error logs
2. Review deployment checklist
3. Contact technical lead
4. Rollback if critical issue

## Rollback Plan

If critical issues are found:

1. **Assess severity**: Is the site completely broken or just degraded?
2. **Attempt quick fix**: If fix can be deployed in < 15 minutes
3. **Rollback if needed**:
   ```bash
   # Rollback frontend
   vercel rollback [deployment-url]
   
   # Rollback backend
   # (depends on hosting platform)
   ```
4. **Verify rollback**: Run smoke tests
5. **Investigate root cause**: Review logs and code changes
6. **Plan fix**: Create fix plan and test in staging
7. **Re-deploy**: Follow deployment checklist again

## Verification Sign-Off

- [ ] All automated checks passed
- [ ] All manual checks completed
- [ ] No critical errors in logs
- [ ] Email delivery confirmed
- [ ] GA4 tracking verified
- [ ] Lighthouse scores meet targets
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Accessibility testing completed
- [ ] Security verification completed

**Verified By:** ___________________  
**Date:** ___________________  
**Time:** ___________________  
**Deployment Version:** ___________________

---

**Next Steps:**
1. Monitor for 24 hours
2. Review metrics daily for first week
3. Schedule post-mortem meeting
4. Document lessons learned
5. Update deployment procedures based on findings
