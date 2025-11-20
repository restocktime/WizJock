# Google Analytics 4 Setup Guide

## Overview
Google Analytics 4 (GA4) tracking has been implemented for the WizJock client portal to track user behavior, conversions, and key metrics.

## Configuration

### Environment Variable
Add your GA4 measurement ID to your `.env` file:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

To get your measurement ID:
1. Go to https://analytics.google.com
2. Create a new GA4 property (or use existing)
3. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Privacy Compliance
The implementation includes:
- **IP Anonymization**: Enabled by default
- **Cookie Consent Banner**: Shows on first visit
- **Secure Cookies**: SameSite=None;Secure flags
- **Conditional Loading**: Analytics only loads if measurement ID is configured
- **No PII Tracking**: No personally identifiable information is tracked

## Tracked Events

### Automatic Events
- **page_view**: Tracked automatically on every route change

### Custom Events

#### CTA Clicks
Tracks all "Request Access" and "Get Started" button clicks:
- `cta_click` with location parameter:
  - `header` - Header "GET STARTED" button
  - `hero` - Hero section "Request Access" button
  - `pricing_starter` - Starter tier "Get Started" button
  - `pricing_pro` - Pro tier "Get Started" button
  - `pricing_elite` - Elite tier "Get Started" button
  - `final_cta` - Final CTA "Request Access Now" button

#### WhatsApp Clicks
Tracks WhatsApp community link clicks:
- `whatsapp_click` with location parameter:
  - `hero` - Hero section "Join WhatsApp" button
  - `recent_wins` - "See All Wins" button
  - `final_cta` - Final CTA "Join WhatsApp" button

#### Form Events
Tracks application form interactions:
- `form_start` - When user focuses on first form field
- `form_submit` - When form is submitted (includes success status and error message if failed)

## Usage in Components

### Tracking CTA Clicks
```typescript
import { trackCTAClick } from '../utils/analytics';

<a 
  href="/apply" 
  onClick={() => trackCTAClick('hero')}
>
  Request Access
</a>
```

### Tracking WhatsApp Clicks
```typescript
import { trackWhatsAppClick } from '../utils/analytics';

<a 
  href="https://chat.whatsapp.com/..." 
  onClick={() => trackWhatsAppClick('hero')}
>
  Join WhatsApp
</a>
```

### Tracking Form Events
```typescript
import { trackFormStart, trackFormSubmit } from '../utils/analytics';

// Track form start
const handleFocus = () => {
  if (!formStartTracked.current) {
    trackFormStart('application');
    formStartTracked.current = true;
  }
};

// Track form submission
try {
  await submitForm();
  trackFormSubmit(true, 'application');
} catch (error) {
  trackFormSubmit(false, 'application', error.message);
}
```

### Tracking Custom Events
```typescript
import { trackEvent } from '../utils/analytics';

trackEvent('custom_event_name', {
  param1: 'value1',
  param2: 'value2',
});
```

## Cookie Consent

The cookie consent banner:
- Shows on first visit
- Stores user preference in localStorage
- Allows users to accept or decline
- Links to Privacy Policy for more information

User preferences are stored as:
- `cookie-consent: accepted` - User accepted cookies
- `cookie-consent: declined` - User declined cookies

## Testing

### Local Testing
1. Set `VITE_GA_MEASUREMENT_ID` in your `.env` file
2. Run the development server: `npm run dev`
3. Open browser DevTools > Network tab
4. Filter for "google-analytics" or "gtag"
5. Interact with the site and verify events are being sent

### Production Testing
1. Deploy with `VITE_GA_MEASUREMENT_ID` configured
2. Visit the site and interact with CTAs
3. Check GA4 Real-time reports (Analytics > Reports > Realtime)
4. Verify events appear within 30 seconds

## GA4 Dashboard Setup

### Recommended Reports
1. **Conversion Funnel**:
   - Landing Page View → Form Start → Form Submit
   
2. **CTA Performance**:
   - Track which CTAs get the most clicks
   - Compare conversion rates by location
   
3. **WhatsApp Engagement**:
   - Track WhatsApp link clicks
   - Measure community interest

### Custom Dimensions (Optional)
Consider adding these custom dimensions in GA4:
- Button Location (for CTA clicks)
- Form Name (for form events)
- Error Type (for form errors)

## Files Modified

### New Files
- `packages/client-portal/src/utils/analytics.ts` - Analytics utility functions
- `packages/client-portal/src/components/CookieConsent.tsx` - Cookie consent banner
- `packages/client-portal/.env.example` - Environment variable documentation

### Modified Files
- `packages/client-portal/index.html` - Added GA4 comment
- `packages/client-portal/src/main.tsx` - GA4 initialization
- `packages/client-portal/src/App.tsx` - Page view tracking and cookie consent
- `packages/client-portal/src/pages/Apply.tsx` - Form event tracking
- `packages/client-portal/src/pages/LandingPage.tsx` - CTA and WhatsApp tracking

## Compliance Notes

### GDPR Compliance
- Cookie consent banner implemented
- IP anonymization enabled
- User can decline tracking
- Privacy policy linked

### CCPA Compliance
- No sale of personal data
- Analytics data is anonymized
- Users can opt-out via cookie banner

### Best Practices
- Analytics loads asynchronously (doesn't block page rendering)
- No PII is tracked in events
- Secure cookie flags are set
- User preferences are respected

## Troubleshooting

### Events Not Showing in GA4
1. Verify `VITE_GA_MEASUREMENT_ID` is set correctly
2. Check browser console for errors
3. Verify gtag.js script is loading (Network tab)
4. Check GA4 Real-time reports (not standard reports - they have 24-48hr delay)

### Cookie Consent Not Showing
1. Clear localStorage: `localStorage.removeItem('cookie-consent')`
2. Refresh the page
3. Banner should appear

### TypeScript Errors
If you see TypeScript errors about `window.gtag`:
- The global type declaration is in `src/utils/analytics.ts`
- Restart your TypeScript server if needed

## Next Steps

After setting up GA4:
1. Create custom reports in GA4 dashboard
2. Set up conversion goals (form submissions)
3. Configure alerts for unusual traffic patterns
4. Review data after 7 days to optimize tracking
5. Consider adding more granular event tracking as needed
