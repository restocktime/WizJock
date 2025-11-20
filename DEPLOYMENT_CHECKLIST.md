# Production Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test` in all packages)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] Latest changes merged to main branch

### Environment Variables
- [ ] Backend `.env` configured (see PRODUCTION_ENV_TEMPLATE.md)
- [ ] Frontend `.env.production` configured
- [ ] JWT_SECRET generated (32+ characters)
- [ ] RESEND_API_KEY obtained
- [ ] GA4 Measurement ID obtained
- [ ] All secrets stored securely (not in version control)

### Database
- [ ] Production database provisioned
- [ ] Database backup created
- [ ] Migration files tested in staging
- [ ] Database credentials secured

### Email Service
- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] SPF record added and verified
- [ ] DKIM records added and verified
- [ ] DMARC record added and verified
- [ ] Test emails sent successfully

### Analytics
- [ ] GA4 property created
- [ ] Measurement ID configured
- [ ] Enhanced measurement enabled
- [ ] Custom events configured
- [ ] Real-time tracking verified

### Security
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] No secrets in logs

### Performance
- [ ] Images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90

---

## Deployment Steps

### Step 1: Deploy Backend

#### Railway
- [ ] Railway account created
- [ ] Project created
- [ ] Backend service configured
- [ ] PostgreSQL database added
- [ ] Redis added
- [ ] Environment variables set
- [ ] Domain generated
- [ ] Database migration run
- [ ] Health check verified

#### Render
- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Redis instance created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Service deployed
- [ ] Database migration run
- [ ] Health check verified

#### Heroku
- [ ] Heroku CLI installed
- [ ] Heroku app created
- [ ] PostgreSQL addon added
- [ ] Redis addon added
- [ ] Environment variables set
- [ ] Code deployed
- [ ] Database migration run
- [ ] Health check verified

### Step 2: Deploy Frontend

#### Vercel
- [ ] Vercel account created
- [ ] Project imported
- [ ] Root directory set to `packages/client-portal`
- [ ] Environment variables set
- [ ] Project deployed
- [ ] Deployment URL verified
- [ ] Custom domain added (if applicable)
- [ ] SSL certificate active

### Step 3: Connect Frontend and Backend

- [ ] Backend URL added to frontend env (`VITE_API_URL`)
- [ ] Frontend URL added to backend CORS (`CORS_ORIGIN`)
- [ ] Both services redeployed
- [ ] Cross-origin requests working

---

## Post-Deployment Verification

### Backend Verification

#### Health Checks
- [ ] `/health` endpoint returns 200
- [ ] `/api/health/db` endpoint returns 200
- [ ] No errors in logs

#### API Endpoints
- [ ] `POST /api/applications` accepts valid data
- [ ] `POST /api/applications` rejects invalid data
- [ ] Rate limiting works (5 requests per hour)
- [ ] Error responses are user-friendly

#### Database
- [ ] All tables exist
- [ ] Indexes created
- [ ] Constraints working
- [ ] Can insert test data
- [ ] Can query test data

#### Email Service
- [ ] Confirmation emails sending
- [ ] Admin notification emails sending
- [ ] Emails not going to spam
- [ ] Email templates rendering correctly
- [ ] Retry logic working

### Frontend Verification

#### Pages Load
- [ ] `/` - Landing page loads
- [ ] `/apply` - Application form loads
- [ ] `/privacy` - Privacy policy loads
- [ ] `/terms` - Terms of use loads
- [ ] `/responsible-gambling` - Responsible gambling loads
- [ ] `/about` - About page loads
- [ ] `/contact` - Contact page loads
- [ ] `/404` - Not found page loads

#### Functionality
- [ ] All CTA buttons link to `/apply`
- [ ] Application form validates input
- [ ] Application form submits successfully
- [ ] Success message displays
- [ ] Error messages display correctly
- [ ] WhatsApp links work
- [ ] Coming Soon modal works
- [ ] Footer links work

#### Mobile Responsiveness
- [ ] Works on 320px width (iPhone SE)
- [ ] Works on 375px width (iPhone 12)
- [ ] Works on 768px width (iPad)
- [ ] Works on 1920px width (Desktop)
- [ ] Touch targets are 44x44px
- [ ] No horizontal scrolling

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces content
- [ ] Color contrast meets WCAG AA
- [ ] Works at 200% zoom
- [ ] No critical axe violations

#### Performance
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Images load correctly
- [ ] No broken images

#### Analytics
- [ ] GA4 script loads
- [ ] `page_view` events tracked
- [ ] `cta_click` events tracked
- [ ] `form_start` events tracked
- [ ] `form_submit` events tracked
- [ ] Events visible in GA4 Real-Time

### End-to-End Testing

#### User Flow 1: Apply for Membership
1. [ ] Visit landing page
2. [ ] Click "Request Access" button
3. [ ] Fill out application form
4. [ ] Submit form
5. [ ] See success message
6. [ ] Receive confirmation email
7. [ ] Admin receives notification email
8. [ ] Application stored in database

#### User Flow 2: Browse Legal Pages
1. [ ] Visit landing page
2. [ ] Scroll to footer
3. [ ] Click "Privacy Policy"
4. [ ] Read privacy policy
5. [ ] Click "Terms of Use"
6. [ ] Read terms
7. [ ] Click "Responsible Gambling"
8. [ ] See resources

#### User Flow 3: Mobile Experience
1. [ ] Visit on mobile device
2. [ ] Navigate through pages
3. [ ] Fill out form on mobile
4. [ ] Submit form
5. [ ] Verify all features work

### Browser Testing

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Security Verification

- [ ] HTTPS enforced (no HTTP)
- [ ] CORS only allows your domains
- [ ] Rate limiting prevents spam
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] No secrets exposed in client code
- [ ] No secrets in error messages
- [ ] No PII in logs

---

## Monitoring Setup

### Error Monitoring
- [ ] Error logging configured
- [ ] Error alerts set up
- [ ] Error rate < 1%

### Performance Monitoring
- [ ] Response time monitoring
- [ ] API response times < 500ms
- [ ] Page load times < 3s
- [ ] Core Web Vitals monitored

### Business Metrics
- [ ] Application submission rate tracked
- [ ] Email delivery rate tracked
- [ ] Conversion funnel tracked
- [ ] CTA click rates tracked

### Alerts Configured
- [ ] Error rate > 5%
- [ ] Response time > 1s
- [ ] Email delivery failure
- [ ] Database connection failure
- [ ] High CPU/memory usage

---

## Rollback Plan

### If Backend Deployment Fails
1. [ ] Identify the issue from logs
2. [ ] Rollback to previous deployment
3. [ ] Verify rollback successful
4. [ ] Fix issue in development
5. [ ] Redeploy

### If Frontend Deployment Fails
1. [ ] Identify the issue from logs
2. [ ] Rollback to previous deployment
3. [ ] Verify rollback successful
4. [ ] Fix issue in development
5. [ ] Redeploy

### If Database Migration Fails
1. [ ] Stop application
2. [ ] Restore database backup
3. [ ] Verify data integrity
4. [ ] Fix migration script
5. [ ] Test in staging
6. [ ] Retry migration

---

## Communication Plan

### Before Deployment
- [ ] Notify team of deployment window
- [ ] Schedule deployment during low-traffic period
- [ ] Prepare rollback plan
- [ ] Assign roles (deployer, monitor, support)

### During Deployment
- [ ] Update team on progress
- [ ] Monitor logs and metrics
- [ ] Test critical paths
- [ ] Document any issues

### After Deployment
- [ ] Announce successful deployment
- [ ] Share deployment URL
- [ ] Monitor for 24 hours
- [ ] Document lessons learned

---

## Post-Deployment Tasks

### Immediate (Within 1 Hour)
- [ ] Verify all critical paths work
- [ ] Monitor error logs
- [ ] Check email delivery
- [ ] Verify analytics tracking
- [ ] Test on multiple devices

### Within 24 Hours
- [ ] Monitor application submission rate
- [ ] Review error logs
- [ ] Check email deliverability
- [ ] Review analytics data
- [ ] Respond to any user issues

### Within 1 Week
- [ ] Review conversion funnel
- [ ] Analyze CTA performance
- [ ] Review form abandonment rate
- [ ] Optimize based on data
- [ ] Plan next iteration

---

## Success Criteria

Deployment is considered successful when:

- [ ] All health checks pass
- [ ] All pages load correctly
- [ ] Application form works end-to-end
- [ ] Emails are delivered successfully
- [ ] Analytics tracking works
- [ ] No critical errors in logs
- [ ] Performance meets targets (Lighthouse > 80)
- [ ] Accessibility meets targets (Lighthouse > 90)
- [ ] Mobile experience is smooth
- [ ] All browsers supported
- [ ] Security measures in place
- [ ] Monitoring and alerts configured

---

## Sign-Off

### Deployment Team

**Deployed by:** ___________________  
**Date:** ___________________  
**Time:** ___________________  

**Verified by:** ___________________  
**Date:** ___________________  
**Time:** ___________________  

### Deployment Notes

Record any issues, workarounds, or important observations:

```
[Add notes here]
```

---

## Next Steps

After successful deployment:

1. **Task 18: Post-deployment verification**
   - Complete all verification steps
   - Monitor for 24 hours
   - Document any issues

2. **Task 19: Set up monitoring and alerts**
   - Configure comprehensive monitoring
   - Set up alerting rules
   - Create dashboards

3. **Continuous Improvement**
   - Review analytics weekly
   - Optimize based on data
   - Iterate on user feedback
   - Keep dependencies updated

---

**Deployment Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back

**Production URL:** ___________________

**Backend URL:** ___________________

**Deployment Date:** ___________________
