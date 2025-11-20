# 🚀 WizJock Production Deployment

## Quick Start

Ready to deploy? Follow these three simple steps:

### 1️⃣ Read the Guide
Start here: **[PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)**

### 2️⃣ Use the Checklist
Track your progress: **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

### 3️⃣ Run Smoke Tests
Verify deployment:
```bash
BACKEND_URL=https://your-backend.com \
FRONTEND_URL=https://your-frontend.com \
./scripts/smoke-test.sh
```

---

## 📚 Documentation Overview

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** | Current status & quick reference | Start here for overview |
| **[PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)** | Complete deployment instructions | Follow step-by-step |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Detailed checklist | Track progress |
| **[PRODUCTION_ENV_TEMPLATE.md](./PRODUCTION_ENV_TEMPLATE.md)** | Environment variables | Configure env vars |
| **[DATABASE_MIGRATION_CHECKLIST.md](./DATABASE_MIGRATION_CHECKLIST.md)** | Database migration | Run migrations |
| **[EMAIL_SERVICE_CONFIGURATION.md](./EMAIL_SERVICE_CONFIGURATION.md)** | Email setup | Configure Resend |
| **[DNS_AUTHENTICATION_GUIDE.md](./DNS_AUTHENTICATION_GUIDE.md)** | DNS records | Set up SPF/DKIM/DMARC |
| **[GA4_CONFIGURATION_GUIDE.md](./GA4_CONFIGURATION_GUIDE.md)** | Analytics setup | Configure Google Analytics |

---

## 🎯 Recommended Deployment Stack

### Backend: Railway
- ✅ Automatic PostgreSQL + Redis
- ✅ Zero configuration
- ✅ Generous free tier
- ✅ Easy to use

### Frontend: Vercel
- ✅ Optimized for React/Vite
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Excellent performance

---

## ⚡ Quick Deployment (30 minutes)

### Backend (Railway)
```bash
1. Go to https://railway.app
2. Create new project from GitHub
3. Configure:
   - Root Directory: packages/backend
   - Add PostgreSQL + Redis
4. Set environment variables (see PRODUCTION_ENV_TEMPLATE.md)
5. Run migration: railway run npm run migrate
6. Verify: curl https://your-backend.up.railway.app/health
```

### Frontend (Vercel)
```bash
1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - Root Directory: packages/client-portal
   - Framework: Vite
4. Set environment variables:
   - VITE_GA_MEASUREMENT_ID
   - VITE_API_URL
5. Deploy
6. Verify: curl https://your-frontend.vercel.app
```

### Update CORS
```bash
# In Railway dashboard, update CORS_ORIGIN:
CORS_ORIGIN=https://your-frontend.vercel.app,https://wizjock.com
```

### Test
```bash
# Run automated smoke tests
BACKEND_URL=https://your-backend.up.railway.app \
FRONTEND_URL=https://your-frontend.vercel.app \
./scripts/smoke-test.sh
```

---

## 🔑 Environment Variables

### Backend (Required)
```bash
NODE_ENV=production
DATABASE_URL=<from-railway>
REDIS_URL=<from-railway>
JWT_SECRET=<generate-strong-secret>
CORS_ORIGIN=<frontend-urls>
RESEND_API_KEY=<from-resend>
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com
```

### Frontend (Required)
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=<backend-url>
```

**Full details:** [PRODUCTION_ENV_TEMPLATE.md](./PRODUCTION_ENV_TEMPLATE.md)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests passing
- [ ] Environment variables prepared
- [ ] Resend account configured
- [ ] Domain verified in Resend
- [ ] SPF, DKIM, DMARC records added
- [ ] GA4 property created
- [ ] No secrets in version control

**Full checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🧪 Testing

### Automated Tests
```bash
# Run smoke tests
./scripts/smoke-test.sh
```

### Manual Tests
1. Visit landing page
2. Click "Request Access"
3. Submit application form
4. Verify:
   - Success message
   - Confirmation email
   - Admin notification
   - Application in database

---

## 🔍 Verification

After deployment, verify:

- [ ] All pages load (/, /apply, /privacy, /terms, etc.)
- [ ] Application form works
- [ ] Emails are delivered
- [ ] Analytics tracking works
- [ ] Mobile experience is smooth
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90

**Full verification:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🐛 Troubleshooting

### Backend deployment fails
- Check build logs
- Verify environment variables
- Test database connection

### Frontend shows blank page
- Check browser console
- Verify VITE_API_URL
- Check CORS configuration

### Emails not sending
- Verify Resend API key
- Check domain verification
- Verify DNS records

**Full troubleshooting:** [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)

---

## 🔄 Rollback

If something goes wrong:

### Railway
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

**Full rollback procedures:** [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)

---

## 📊 Monitoring

After deployment, monitor:

- Error rates (should be < 1%)
- Response times (should be < 500ms)
- Application submission rate
- Email delivery rate
- Core Web Vitals
- Analytics events

---

## 🎓 Support Resources

### Documentation
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Google Analytics](https://support.google.com/analytics)

### Community
- [Railway Discord](https://discord.gg/railway)
- [Vercel Discord](https://vercel.com/discord)

---

## 📋 Deployment Phases

### ✅ Phase 1-6: Complete
All development and preparation work is done.

### 🔄 Phase 6: Deployment (Current)
- **Task 17:** Deploy to production ← YOU ARE HERE
- **Task 18:** Post-deployment verification
- **Task 19:** Set up monitoring and alerts

---

## 🎯 Success Criteria

Deployment is successful when:

✅ All health checks pass  
✅ All pages load correctly  
✅ Application form works end-to-end  
✅ Emails are delivered successfully  
✅ Analytics tracking works  
✅ No critical errors in logs  
✅ Performance meets targets (Lighthouse > 80)  
✅ Accessibility meets targets (Lighthouse > 90)  

---

## 🚀 Ready to Deploy?

1. **Review:** [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
2. **Follow:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Test:** `./scripts/smoke-test.sh`
4. **Monitor:** Watch logs and metrics

---

## 📞 Need Help?

1. Check troubleshooting sections in guides
2. Review platform documentation
3. Check error logs
4. Contact platform support

---

## 🎉 After Deployment

Once deployed:

1. Complete Task 18 (Post-deployment verification)
2. Complete Task 19 (Set up monitoring)
3. Announce launch
4. Monitor and iterate

---

**Status:** Ready to Deploy ✅  
**Documentation:** Complete ✅  
**Tests:** Automated ✅  
**Next Step:** Deploy Backend → Deploy Frontend → Test

**Good luck with your deployment!** 🚀
