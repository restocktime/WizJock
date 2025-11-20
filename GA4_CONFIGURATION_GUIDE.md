# Google Analytics 4 Configuration Guide

Complete guide for setting up Google Analytics 4 for production.

## Table of Contents

1. [Create GA4 Property](#create-ga4-property)
2. [Configure Data Stream](#configure-data-stream)
3. [Get Measurement ID](#get-measurement-id)
4. [Configure Settings](#configure-settings)
5. [Set Up Custom Events](#set-up-custom-events)
6. [Create Reports](#create-reports)
7. [Privacy Compliance](#privacy-compliance)
8. [Verification](#verification)

---

## 1. Create GA4 Property

### Step 1: Access Google Analytics

1. **Go to Google Analytics:**
   - Visit https://analytics.google.com
   - Sign in with your Google account

2. **If you don't have an account:**
   - Click "Start measuring"
   - Follow the setup wizard

### Step 2: Create Property

1. **Click Admin** (gear icon in bottom left)

2. **In the Property column, click "Create Property"**

3. **Fill in property details:**
   - **Property name:** WizJock
   - **Reporting time zone:** Select your timezone (e.g., America/New_York)
   - **Currency:** USD - US Dollar
   - Click "Next"

4. **Business information:**
   - **Industry category:** Sports & Recreation (or Online Communities)
   - **Business size:** Select appropriate size
     - Small (1-10 employees)
     - Medium (11-100 employees)
     - Large (100+ employees)
   - Click "Next"

5. **Business objectives:** (Select all that apply)
   - ✅ Generate leads
   - ✅ Examine user behavior
   - ✅ Get baseline reports
   - Click "Create"

6. **Accept Terms of Service:**
   - Read and accept Google Analytics Terms of Service
   - Accept Data Processing Amendment
   - Click "I Accept"

---

## 2. Configure Data Stream

### Step 1: Create Web Data Stream

1. **Select platform:** Web

2. **Set up web stream:**
   - **Website URL:** `https://wizjock.com`
   - **Stream name:** WizJock Website
   - Click "Create stream"

### Step 2: Configure Enhanced Measurement

Enhanced measurement automatically tracks common events without code changes.

**Enable these events:**
- ✅ **Page views** - Automatically tracked
- ✅ **Scrolls** - When user scrolls to bottom (90%)
- ✅ **Outbound clicks** - Clicks to external sites
- ✅ **Site search** - Search queries (if applicable)
- ✅ **Form interactions** - Form starts and submissions
- ✅ **File downloads** - PDF, ZIP, etc.
- ✅ **Video engagement** - YouTube/Vimeo videos (if applicable)

**To configure:**
1. In your data stream, click "Enhanced measurement"
2. Toggle on/off specific events
3. Click "Save"

### Step 3: Configure Additional Settings

**Data collection:**
- **Google signals:** Enable (for cross-device tracking)
- **User-ID:** Optional (for logged-in users)

**Data retention:**
- Go to Admin > Data Settings > Data Retention
- Set to **14 months** (maximum for free tier)
- Event data retention: 14 months
- Reset user data on new activity: On

---

## 3. Get Measurement ID

### Step 1: Find Measurement ID

1. **In your data stream, look for "Measurement ID"**
   - Format: `G-XXXXXXXXXX`
   - Example: `G-1A2B3C4D5E`

2. **Copy the Measurement ID**
   - Click the copy icon
   - Or select and copy manually

### Step 2: Add to Environment Variables

**Frontend .env.production file:**
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Platform-specific:**

**Vercel:**
```bash
# In Vercel dashboard: Settings > Environment Variables
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Heroku:**
```bash
heroku config:set VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX --app your-app
```

**Railway:**
```bash
# In Railway dashboard: Variables tab
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Verify Installation

The application already has GA4 installed in `packages/client-portal/index.html`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%VITE_GA_MEASUREMENT_ID%', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

**No code changes needed!** Just set the environment variable.

---

## 4. Configure Settings

### Data Collection Settings

**Admin > Data Settings > Data Collection:**

1. **Google signals data collection:**
   - Enable for cross-device tracking
   - Allows remarketing and demographics

2. **User-provided data:**
   - Enable if you collect user data (email, name)
   - Mark as "User-provided data from your website"

### Data Filters

**Admin > Data Settings > Data Filters:**

1. **Internal Traffic Filter:**
   - Create filter to exclude your office/home IP
   - Name: Internal Traffic
   - IP address: Your IP address
   - Click "Create"

2. **Developer Traffic Filter:**
   - Create filter to exclude localhost
   - Name: Developer Traffic
   - IP address: 127.0.0.1
   - Click "Create"

### User Data Deletion

**Admin > Data Settings > Data Deletion Requests:**

Set up process for handling user data deletion requests (GDPR/CCPA compliance).

### IP Anonymization

**Already enabled by default in GA4!**

The code includes `anonymize_ip: true` for additional privacy.

---

## 5. Set Up Custom Events

The application already tracks these custom events:

### Events Tracked

1. **cta_click** - When CTA buttons are clicked
   - Parameters:
     - `location` - Where the CTA is located (header, hero, pricing, footer)

2. **form_start** - When application form is started
   - Parameters:
     - `form_name` - "application"

3. **form_submit** - When application form is submitted
   - Parameters:
     - `form_name` - "application"
     - `success` - true/false

4. **form_error** - When form submission fails
   - Parameters:
     - `form_name` - "application"
     - `error_message` - Error description

5. **whatsapp_click** - When WhatsApp link is clicked
   - Parameters:
     - `link_location` - Where the link is located

### Mark Events as Conversions

1. **Go to Admin > Events**

2. **Mark these as conversions:**
   - ✅ `form_submit` (when success = true)
   - ✅ `cta_click` (optional)

3. **To mark as conversion:**
   - Find event in list
   - Toggle "Mark as conversion" switch

### Create Custom Dimensions

**For better reporting, create custom dimensions:**

1. **Go to Admin > Custom Definitions**

2. **Click "Create custom dimension"**

3. **Create these dimensions:**

**CTA Location:**
- Dimension name: CTA Location
- Scope: Event
- Event parameter: location
- Click "Save"

**Form Name:**
- Dimension name: Form Name
- Scope: Event
- Event parameter: form_name
- Click "Save"

**Form Success:**
- Dimension name: Form Success
- Scope: Event
- Event parameter: success
- Click "Save"

---

## 6. Create Reports

### Conversion Funnel Report

Track the user journey from landing page to application submission.

1. **Go to Explore > Funnel exploration**

2. **Create funnel:**
   - **Step 1:** page_view (Landing Page)
     - Add condition: page_location contains "wizjock.com"
   - **Step 2:** form_start
   - **Step 3:** form_submit (success = true)

3. **Name:** Application Conversion Funnel

4. **Save**

**This shows:**
- How many visitors start the form
- How many complete it
- Where drop-off occurs

### CTA Performance Report

See which CTAs drive the most engagement.

1. **Go to Explore > Free form**

2. **Add dimension:** Event name

3. **Add filter:** Event name = cta_click

4. **Add secondary dimension:** CTA Location (custom dimension)

5. **Add metric:** Event count

6. **Name:** CTA Performance

7. **Save**

**This shows:**
- Which CTAs are clicked most
- Which locations perform best

### Form Performance Report

Track form completion rates and errors.

1. **Go to Explore > Free form**

2. **Add dimension:** Event name

3. **Add filter:** Event name contains "form"

4. **Add secondary dimension:** Form Success

5. **Add metrics:**
   - Event count
   - Conversions

6. **Name:** Form Performance

7. **Save**

**This shows:**
- Form start rate
- Form completion rate
- Form error rate

### Real-Time Report

Monitor live traffic and events.

1. **Go to Reports > Realtime**

2. **View:**
   - Users by country
   - Users by page
   - Event count by event name
   - Conversions

**Use this to:**
- Verify GA4 is working
- Monitor launch day traffic
- Debug tracking issues

---

## 7. Privacy Compliance

### Cookie Consent

The application includes a cookie consent banner in `packages/client-portal/src/components/CookieConsent.tsx`.

**Features:**
- Appears on first visit
- Allows accept/decline
- Stores preference in localStorage
- Only loads GA4 after consent

**To enable:**
- Already implemented and active
- No additional configuration needed

### GDPR Compliance

**For EU/UK visitors:**

1. **Cookie consent required** ✅ (already implemented)

2. **Privacy policy must include:**
   - What data is collected (page views, events, IP address)
   - How it's used (analytics, improving service)
   - Third parties (Google Analytics)
   - User rights (access, deletion, opt-out)
   - How to exercise rights

3. **Data deletion process:**
   - User emails privacy@wizjock.com
   - Verify identity
   - Delete from GA4: Admin > Data Settings > Data Deletion Requests
   - Delete from database: `DELETE FROM applications WHERE email = 'user@example.com'`

### CCPA Compliance

**For California residents:**

1. **Privacy policy must include:**
   - Categories of data collected
   - Purpose of collection
   - Third parties data is shared with
   - Right to opt-out
   - Right to delete

2. **Opt-out mechanism:**
   - "Do Not Sell My Personal Information" link in footer
   - Respect Do Not Track (DNT) browser setting

3. **Data deletion:**
   - Same process as GDPR

### IP Anonymization

**Already enabled!**

The GA4 configuration includes:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  anonymize_ip: true
});
```

This removes the last octet of IP addresses before storage.

### Data Retention

**Set to 14 months** (maximum for free tier)

To change:
1. Admin > Data Settings > Data Retention
2. Select retention period
3. Click "Save"

---

## 8. Verification

### Test 1: Real-Time Tracking

1. **Go to Reports > Realtime**

2. **Open your production site in incognito window**

3. **You should see:**
   - 1 user online
   - Page view event
   - Your location on map

4. **Click a CTA button**
   - Should see `cta_click` event

5. **Start application form**
   - Should see `form_start` event

6. **Submit form**
   - Should see `form_submit` event

**If not appearing:**
- Check VITE_GA_MEASUREMENT_ID is set correctly
- Check browser console for errors
- Disable ad blockers
- Wait 30-60 seconds for data to appear

### Test 2: Debug Mode

**Enable debug mode in browser:**

1. **Install Google Analytics Debugger extension:**
   - Chrome: https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

2. **Enable the extension**

3. **Open browser console (F12)**

4. **Visit your site**

5. **Check console for GA debug messages:**
   ```
   Running command: config
   Running command: event
   Event: page_view
   Event: cta_click
   ```

**If errors appear:**
- Check Measurement ID is correct
- Check GA4 script is loaded
- Check for JavaScript errors

### Test 3: Tag Assistant

**Use Google Tag Assistant:**

1. **Install Tag Assistant extension:**
   - https://tagassistant.google.com/

2. **Click extension icon**

3. **Click "Connect"**

4. **Visit your site**

5. **Check tags:**
   - ✅ Google Analytics: GA4 - Connected
   - ✅ Events firing correctly

### Test 4: Events Report

**Check events are being recorded:**

1. **Go to Reports > Engagement > Events**

2. **Wait 24-48 hours for data to appear**

3. **You should see:**
   - page_view
   - cta_click
   - form_start
   - form_submit
   - whatsapp_click

4. **Click on event to see details:**
   - Event count
   - Users
   - Event parameters

### Test 5: Conversions

**Verify conversions are tracked:**

1. **Go to Reports > Engagement > Conversions**

2. **You should see:**
   - form_submit (if marked as conversion)

3. **Check conversion rate:**
   - Should match form submission rate

---

## Troubleshooting

### Issue: No data appearing

**Possible causes:**
1. Measurement ID not set or incorrect
2. Ad blocker blocking GA4
3. JavaScript error preventing GA4 from loading
4. Wrong environment (dev vs prod)

**Solutions:**
1. Verify VITE_GA_MEASUREMENT_ID is set correctly
2. Test in incognito mode without ad blockers
3. Check browser console for errors
4. Verify you're testing production build, not development

### Issue: Events not firing

**Possible causes:**
1. Event tracking code not implemented
2. JavaScript error
3. Event name typo

**Solutions:**
1. Check `packages/client-portal/src/utils/analytics.ts` exists
2. Check browser console for errors
3. Verify event names match exactly (case-sensitive)
4. Enable debug mode to see events in console

### Issue: Real-time not showing data

**Possible causes:**
1. Data delay (can take 30-60 seconds)
2. Internal traffic filter blocking you
3. Ad blocker

**Solutions:**
1. Wait 1-2 minutes
2. Disable internal traffic filter temporarily
3. Test in incognito mode
4. Disable ad blockers

### Issue: Conversions not tracking

**Possible causes:**
1. Event not marked as conversion
2. Event name doesn't match
3. Conversion condition not met

**Solutions:**
1. Go to Admin > Events and mark event as conversion
2. Verify event name matches exactly
3. Check event parameters (e.g., success = true)

---

## Checklist

- [ ] GA4 property created (WizJock)
- [ ] Data stream configured (wizjock.com)
- [ ] Measurement ID obtained (G-XXXXXXXXXX)
- [ ] VITE_GA_MEASUREMENT_ID set in environment variables
- [ ] Enhanced measurement enabled
- [ ] Data retention set to 14 months
- [ ] IP anonymization enabled
- [ ] Custom dimensions created (CTA Location, Form Name, Form Success)
- [ ] Events marked as conversions (form_submit)
- [ ] Conversion funnel report created
- [ ] CTA performance report created
- [ ] Form performance report created
- [ ] Real-time tracking verified
- [ ] Debug mode tested
- [ ] Tag Assistant verified
- [ ] Cookie consent banner active
- [ ] Privacy policy updated with GA4 information

---

## Best Practices

### 1. Monitor Regularly

- Check reports weekly
- Review conversion funnel monthly
- Analyze CTA performance
- Identify drop-off points

### 2. Set Up Alerts

**Create custom alerts:**

1. Go to Admin > Custom Alerts
2. Create alerts for:
   - Sudden traffic drop (> 50% decrease)
   - Conversion rate drop (> 20% decrease)
   - High bounce rate (> 80%)

### 3. Use Annotations

**Mark important events:**

1. Go to Reports > Any report
2. Click date range
3. Click "Create annotation"
4. Mark:
   - Launch date
   - Marketing campaigns
   - Major updates
   - Issues/outages

### 4. Regular Audits

**Monthly checklist:**
- [ ] Review top pages
- [ ] Check conversion rates
- [ ] Analyze user flow
- [ ] Review event tracking
- [ ] Check for errors
- [ ] Update reports as needed

### 5. Privacy First

- Always respect user privacy
- Honor opt-out requests
- Keep privacy policy updated
- Minimize data collection
- Delete data when requested

---

## Next Steps

After completing GA4 configuration:

1. ✅ Mark GA4 configuration as complete
2. ✅ Complete pre-deployment checklist
3. ✅ Proceed with deployment (Task 17)
4. ✅ Monitor analytics after launch

---

## Support Resources

- **GA4 Documentation:** https://support.google.com/analytics/answer/10089681
- **GA4 Setup Guide:** https://support.google.com/analytics/answer/9304153
- **Event Tracking:** https://support.google.com/analytics/answer/9267735
- **Privacy Controls:** https://support.google.com/analytics/answer/9019185
- **GA4 Community:** https://support.google.com/analytics/community

---

**Remember:** Analytics data can take 24-48 hours to fully populate. Be patient!
