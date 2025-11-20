# Design Document

## Overview

This design document outlines the technical approach for making the WizJock landing page credible and functional. The solution focuses on fixing critical conversion blockers (broken CTAs), establishing legal legitimacy (essential pages), and ensuring compliance (FTC disclaimers, accessibility). The implementation leverages the existing React/TypeScript stack in the `client-portal` package and extends the backend API to handle application submissions and email notifications.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Landing Page (React - client-portal)            │
│  - Fixed CTAs → /apply                                       │
│  - Legal Pages (Privacy, Terms, About, Contact, Resp. Gamb.)│
│  - FTC Disclaimers on Performance Claims                     │
│  - GA4 Analytics Tracking                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                Backend API (Node.js/Express)                 │
│  - POST /api/applications (store submissions)               │
│  - Email Service Integration (SendGrid/Resend)              │
│  - Admin Notifications                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  - applications table (store form submissions)              │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Landing Page)**
- React 18+ with TypeScript
- Tailwind CSS (already in use)
- React Router for page navigation
- Axios for API calls (already installed)
- Google Analytics 4 (gtag.js)

**Backend**
- Node.js with Express (existing)
- PostgreSQL (existing)
- Email Service: Resend (modern, simple API) or SendGrid
- Environment variables for configuration


## Components and Interfaces

### Frontend Components

#### 1. Application Form Component (`/apply` page)

**Location:** `packages/client-portal/src/pages/Apply.tsx`

**Purpose:** Capture lead information from potential subscribers

**Component Structure:**
```typescript
interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  smsConsent: boolean;
}

interface ApplicationFormProps {
  onSuccess?: () => void;
}
```

**Key Features:**
- Form validation (email format, required fields)
- Loading state during submission
- Success message display
- Error handling with user-friendly messages
- TCPA-compliant SMS consent checkbox (unticked by default)
- Mobile-responsive design
- Accessibility: proper labels, keyboard navigation, ARIA attributes

**API Integration:**
- POST to `/api/applications` with form data
- Handle 201 (success), 400 (validation error), 500 (server error) responses

#### 2. Legal Page Components

**Location:** `packages/client-portal/src/pages/legal/`

**Pages to Create:**
- `PrivacyPolicy.tsx` - Full privacy policy content
- `TermsOfUse.tsx` - Terms and conditions
- `ResponsibleGambling.tsx` - Responsible gambling resources
- `About.tsx` - Company mission and team
- `Contact.tsx` - Contact form and information

**Shared Layout:**
- Consistent header/footer
- Readable typography (max-width: 800px, line-height: 1.6)
- Table of contents for long pages
- Last updated date displayed

#### 3. Performance Disclaimer Component

**Location:** `packages/client-portal/src/components/PerformanceDisclaimer.tsx`

**Purpose:** Reusable disclaimer for FTC compliance

**Component:**
```typescript
interface DisclaimerProps {
  variant?: 'inline' | 'block';
  className?: string;
}

// Usage: <PerformanceDisclaimer variant="inline" />
```

**Styling:**
- Minimum 11px font size
- Sufficient contrast (4.5:1 ratio)
- Asterisk (*) prefix for inline disclaimers
- Positioned close to performance claims

#### 4. Coming Soon Modal Component

**Location:** `packages/client-portal/src/components/ComingSoonModal.tsx`

**Purpose:** Replace broken "Verified Results" link with honest messaging

**Features:**
- Modal overlay with backdrop
- Clear messaging about upcoming dashboard
- CTA button to /apply
- Close button (X) and ESC key support
- Focus trap for accessibility


#### 5. Updated Footer Component

**Location:** `packages/client-portal/src/components/Footer.tsx`

**Purpose:** Display legal page links on all pages

**Links to Include:**
- Privacy Policy (/privacy)
- Terms of Use (/terms)
- Responsible Gambling (/responsible-gambling)
- About Us (/about)
- Contact (/contact)

**Additional Elements:**
- Copyright notice
- "Gamble responsibly. 21+" message
- Social media links (if applicable)

#### 6. Analytics Wrapper

**Location:** `packages/client-portal/src/utils/analytics.ts`

**Purpose:** Centralized GA4 event tracking

**Functions:**
```typescript
export const trackEvent = (eventName: string, params?: Record<string, any>) => void;
export const trackPageView = (path: string) => void;
export const trackCTAClick = (location: string) => void;
export const trackFormStart = () => void;
export const trackFormSubmit = (success: boolean) => void;
```

**Events to Track:**
- `page_view` - Automatic on route change
- `cta_click` - When any CTA button is clicked (with location parameter)
- `form_start` - When user focuses on first form field
- `form_submit` - When form is successfully submitted
- `form_error` - When form submission fails
- `whatsapp_click` - When WhatsApp link is clicked

### Backend API Endpoints

#### POST /api/applications

**Purpose:** Store application form submissions

**Request Body:**
```typescript
{
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  smsConsent: boolean;
}
```

**Response (201 Created):**
```typescript
{
  success: true;
  message: "Application received successfully",
  applicationId: string;
}
```

**Response (400 Bad Request):**
```typescript
{
  success: false;
  error: "Validation error",
  details: string[];
}
```

**Validation Rules:**
- fullName: required, 2-100 characters
- email: required, valid email format, unique
- phone: required, valid phone format
- bettingExperience: required, one of enum values
- smsConsent: boolean

**Side Effects:**
1. Store application in database
2. Send confirmation email to applicant
3. Send notification email to admin
4. Log submission for analytics


## Data Models

### Applications Table

**Table Name:** `applications`

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  betting_experience VARCHAR(20) NOT NULL CHECK (
    betting_experience IN ('beginner', 'intermediate', 'advanced', 'professional')
  ),
  sms_consent BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected', 'contacted')
  ),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
```

**Fields:**
- `id` - UUID primary key
- `full_name` - Applicant's full name
- `email` - Unique email address (used for communication)
- `phone` - Phone number (for SMS alerts if consented)
- `betting_experience` - Self-reported experience level
- `sms_consent` - Whether user agreed to receive SMS
- `status` - Application status (for future admin review workflow)
- `notes` - Admin notes (for future use)
- `created_at` - Submission timestamp
- `updated_at` - Last modification timestamp

### Shared Types

**Location:** `packages/shared-types/src/index.ts`

**New Types to Add:**
```typescript
export type BettingExperience = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'contacted';

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: BettingExperience;
  smsConsent: boolean;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: BettingExperience;
  smsConsent: boolean;
}

export interface CreateApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
  error?: string;
  details?: string[];
}
```


## Email Service Integration

### Email Provider: Resend

**Rationale:** 
- Modern, developer-friendly API
- Generous free tier (100 emails/day)
- Excellent deliverability
- Simple React Email integration for templates
- Better than SendGrid for small-scale use

**Configuration:**
```typescript
// Environment Variables
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=team@wizjock.com
FROM_EMAIL=hello@wizjock.com
```

### Email Templates

#### 1. Applicant Confirmation Email

**Subject:** "WizJock Application Received - Next Steps"

**Content:**
```
Hi [Full Name],

Thanks for your interest in WizJock!

We've received your application and our team will review it within 24-48 hours. 

What happens next:
1. We'll review your application
2. If approved, you'll receive an email with subscription options and WhatsApp group access
3. You can reply to this email if you have any questions

In the meantime, check out our WhatsApp community to see what members are saying:
[WhatsApp Link]

Best,
The WizJock Team

---
Questions? Reply to this email or visit wizjock.com/contact
Privacy Policy: wizjock.com/privacy
```

#### 2. Admin Notification Email

**Subject:** "New WizJock Application: [Full Name]"

**Content:**
```
New application received:

Name: [Full Name]
Email: [Email]
Phone: [Phone]
Experience: [Betting Experience]
SMS Consent: [Yes/No]
Submitted: [Timestamp]

Application ID: [UUID]

---
This is an automated notification from the WizJock application system.
```

### Email Service Implementation

**Location:** `packages/backend/src/services/EmailService.ts`

**Interface:**
```typescript
interface EmailService {
  sendApplicationConfirmation(application: Application): Promise<void>;
  sendAdminNotification(application: Application): Promise<void>;
}
```

**Error Handling:**
- Retry logic: 3 attempts with exponential backoff
- Log all email failures
- Don't block application submission if email fails
- Store failed emails in a queue for manual retry


## Routing and Navigation

### React Router Setup

**Location:** `packages/client-portal/src/App.tsx`

**Routes to Add:**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/apply" element={<Apply />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsOfUse />} />
    <Route path="/responsible-gambling" element={<ResponsibleGambling />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/results" element={<ComingSoon />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Note:** The current App.tsx uses hash routing (`#coming-soon`). We'll migrate to proper React Router for clean URLs.

### CTA Button Updates

**Current State:** All CTAs link to `#coming-soon`

**New State:** All CTAs link to `/apply`

**Locations to Update in LandingPage:**
1. Header "GET STARTED" button
2. Hero "Request Access" button
3. Pricing card "Get Started" buttons (all 3 tiers)
4. Final CTA "Request Access Now" button

**Implementation:**
```typescript
// Replace all instances of:
<a href="#coming-soon">

// With:
<Link to="/apply">
// or
<a href="/apply">
```


## Error Handling

### Frontend Error Handling

**Form Validation Errors:**
- Display inline error messages below each field
- Highlight invalid fields with red border
- Prevent submission until all errors are resolved
- Show field-specific error messages (e.g., "Please enter a valid email address")

**API Errors:**
- 400 Bad Request: Display validation errors from server
- 409 Conflict (duplicate email): "An application with this email already exists. Please contact us if you need assistance."
- 500 Server Error: "Something went wrong. Please try again or contact support."
- Network Error: "Unable to connect. Please check your internet connection and try again."

**Error Display Component:**
```typescript
interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
}
```

### Backend Error Handling

**Validation Errors:**
- Use Zod for request validation
- Return 400 with detailed error messages
- Log validation failures for monitoring

**Database Errors:**
- Catch unique constraint violations (duplicate email)
- Return 409 Conflict with user-friendly message
- Log all database errors

**Email Service Errors:**
- Don't block application submission if email fails
- Log email failures with full context
- Implement retry queue for failed emails
- Alert admin if email service is down

**Error Response Format:**
```typescript
{
  success: false,
  error: "Human-readable error message",
  details: ["Specific validation error 1", "Specific validation error 2"],
  code: "ERROR_CODE" // For programmatic handling
}
```


## Accessibility Implementation

### WCAG 2.2 AA Compliance Strategy

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Visible focus indicators (2px outline with high contrast)
- Logical tab order following visual layout
- Skip to main content link for screen readers

**Screen Reader Support:**
- Semantic HTML (header, nav, main, footer, article)
- ARIA labels for icon buttons
- ARIA live regions for dynamic content (form errors, success messages)
- Alt text for all images (decorative images: alt="")

**Color and Contrast:**
- Minimum 4.5:1 contrast for normal text
- Minimum 3:1 contrast for large text (18px+)
- Don't rely on color alone to convey information
- Test with color blindness simulators

**Form Accessibility:**
- Label elements associated with inputs (for/id or aria-labelledby)
- Required fields indicated with aria-required="true"
- Error messages linked with aria-describedby
- Fieldset and legend for grouped inputs

**Testing Tools:**
- axe DevTools browser extension
- WAVE browser extension
- Manual testing with NVDA (Windows) or VoiceOver (Mac)
- Keyboard-only navigation testing

### Mobile Responsiveness

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Adequate spacing between clickable elements (8px minimum)

**Viewport Configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```


## Performance Optimization

### Image Optimization

**Current Issues:**
- Winning slip images may not be optimized
- Logo might be loading at full resolution

**Solutions:**
1. **Optimize all images:**
   - Convert to WebP format with JPEG fallback
   - Compress images (target: <100KB per image)
   - Use appropriate dimensions (no oversized images)

2. **Lazy Loading:**
   ```typescript
   <img src="/slips/slip1.png" alt="Recent win" loading="lazy" />
   ```

3. **Responsive Images:**
   ```typescript
   <img 
     srcSet="/slips/slip1-small.webp 400w, /slips/slip1-large.webp 800w"
     sizes="(max-width: 768px) 400px, 800px"
     src="/slips/slip1.jpg"
     alt="Recent win"
   />
   ```

### Code Splitting

**Route-based Code Splitting:**
```typescript
import { lazy, Suspense } from 'react';

const Apply = lazy(() => import('./pages/Apply'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));

<Suspense fallback={<LoadingSpinner />}>
  <Route path="/apply" element={<Apply />} />
</Suspense>
```

### Bundle Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query']
        }
      }
    }
  }
});
```

### Core Web Vitals Targets

**Largest Contentful Paint (LCP):** < 2.5s
- Optimize hero image loading
- Preload critical assets
- Use CDN for static assets

**Interaction to Next Paint (INP):** < 200ms
- Minimize JavaScript execution time
- Debounce form input handlers
- Avoid layout thrashing

**Cumulative Layout Shift (CLS):** < 0.1
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content


## Analytics Implementation

### Google Analytics 4 Setup

**Installation:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Environment Variable:**
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Event Tracking Implementation

**Analytics Utility:**
```typescript
// src/utils/analytics.ts
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackCTAClick = (location: string) => {
  trackEvent('cta_click', { location });
};

export const trackFormStart = () => {
  trackEvent('form_start', { form_name: 'application' });
};

export const trackFormSubmit = (success: boolean) => {
  trackEvent('form_submit', { 
    form_name: 'application',
    success 
  });
};
```

**Usage in Components:**
```typescript
// In Apply.tsx
import { trackFormStart, trackFormSubmit } from '../utils/analytics';

const handleFocus = () => {
  trackFormStart();
};

const handleSubmit = async (data) => {
  try {
    await submitApplication(data);
    trackFormSubmit(true);
  } catch (error) {
    trackFormSubmit(false);
  }
};
```

### Privacy Compliance

**Cookie Consent:**
- For EU/UK visitors, implement cookie consent banner
- Use library like `react-cookie-consent`
- Only load GA4 after consent is given
- Provide opt-out mechanism

**Data Minimization:**
- Don't track PII (names, emails, phone numbers)
- Use anonymized IP addresses
- Set appropriate data retention periods in GA4


## Testing Strategy

### Unit Testing

**Framework:** Vitest (already configured)

**Components to Test:**
1. **ApplicationForm:**
   - Validates required fields
   - Validates email format
   - Handles submission success
   - Handles submission errors
   - Tracks analytics events

2. **PerformanceDisclaimer:**
   - Renders correct text
   - Applies correct styling

3. **Analytics Utility:**
   - Calls gtag with correct parameters
   - Handles missing gtag gracefully

**Example Test:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Apply } from './Apply';

describe('Apply Page', () => {
  it('displays validation error for invalid email', async () => {
    render(<Apply />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Testing

**API Endpoint Testing:**
```typescript
import request from 'supertest';
import app from '../src/index';

describe('POST /api/applications', () => {
  it('creates application with valid data', async () => {
    const response = await request(app)
      .post('/api/applications')
      .send({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        bettingExperience: 'intermediate',
        smsConsent: true
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
  
  it('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/applications')
      .send({
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        bettingExperience: 'intermediate',
        smsConsent: false
      });
    
    expect(response.status).toBe(400);
  });
});
```

### Accessibility Testing

**Automated Testing:**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Apply />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Manual Testing Checklist:**
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces form labels and errors
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Page works at 200% zoom
- [ ] Touch targets are at least 44x44px on mobile

### Performance Testing

**Lighthouse CI:**
- Run Lighthouse audits in CI/CD pipeline
- Fail build if Performance score < 80
- Fail build if Accessibility score < 90

**Manual Testing:**
- Test on 3G network throttling
- Test on low-end mobile devices
- Verify Core Web Vitals in Chrome DevTools


## Deployment and Configuration

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:3000/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Backend (.env):**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sportsbook

# Email Service
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=hello@wizjock.com
ADMIN_EMAIL=team@wizjock.com

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://wizjock.com

# JWT (existing)
JWT_SECRET=your-secret-key
```

### Database Migration

**Migration File:** `packages/backend/src/db/migrations/002_create_applications_table.sql`

```sql
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  betting_experience VARCHAR(20) NOT NULL CHECK (
    betting_experience IN ('beginner', 'intermediate', 'advanced', 'professional')
  ),
  sms_consent BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected', 'contacted')
  ),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
```

**Run Migration:**
```bash
cd packages/backend
npm run migrate
```

### Deployment Checklist

**Pre-Deployment:**
- [ ] Run all tests (unit, integration, accessibility)
- [ ] Run Lighthouse audit (Performance > 80, Accessibility > 90)
- [ ] Test on mobile devices
- [ ] Verify all environment variables are set
- [ ] Run database migration on production database
- [ ] Test email delivery in production

**Post-Deployment:**
- [ ] Verify all CTAs link to /apply
- [ ] Test application form submission end-to-end
- [ ] Verify confirmation email is received
- [ ] Verify admin notification email is received
- [ ] Check all legal pages return 200 (not 404)
- [ ] Verify GA4 events are being tracked
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Monitor error logs for first 24 hours

### Monitoring and Alerts

**Application Monitoring:**
- Log all application submissions
- Alert if submission rate drops to zero (potential bug)
- Alert if error rate exceeds 5%

**Email Monitoring:**
- Log all email send attempts
- Alert if email delivery fails for 3+ consecutive attempts
- Monitor email bounce rate

**Performance Monitoring:**
- Track Core Web Vitals in GA4
- Alert if LCP exceeds 3s for 10+ users
- Monitor API response times


## Security Considerations

### Input Validation and Sanitization

**Frontend Validation:**
- Client-side validation for UX (immediate feedback)
- Never trust client-side validation alone

**Backend Validation:**
- Use Zod for schema validation
- Sanitize all inputs to prevent XSS
- Validate email format with regex
- Validate phone number format
- Limit string lengths to prevent buffer overflow

**Example Zod Schema:**
```typescript
import { z } from 'zod';

const applicationSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  bettingExperience: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  smsConsent: z.boolean()
});
```

### Rate Limiting

**Application Endpoint:**
- Limit to 5 submissions per IP per hour
- Prevent spam and abuse
- Return 429 Too Many Requests if exceeded

**Implementation:**
```typescript
import rateLimit from 'express-rate-limit';

const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many applications from this IP, please try again later.'
});

app.post('/api/applications', applicationLimiter, handleApplication);
```

### CORS Configuration

**Allowed Origins:**
- Production: `https://wizjock.com`, `https://www.wizjock.com`
- Development: `http://localhost:5173`

**Configuration:**
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

### Data Protection

**PII Handling:**
- Store minimal PII (only what's necessary)
- Never log PII in application logs
- Use HTTPS for all data transmission
- Encrypt sensitive data at rest (if required by compliance)

**Email Security:**
- Use authenticated SMTP (Resend API)
- Implement SPF, DKIM, DMARC records for domain
- Never expose email API keys in frontend code

### SQL Injection Prevention

**Use Parameterized Queries:**
```typescript
// GOOD - Parameterized query
const result = await pool.query(
  'INSERT INTO applications (full_name, email) VALUES ($1, $2)',
  [fullName, email]
);

// BAD - String concatenation (vulnerable to SQL injection)
const result = await pool.query(
  `INSERT INTO applications (full_name, email) VALUES ('${fullName}', '${email}')`
);
```


## Legal Content Guidelines

### Privacy Policy Content

**Required Sections:**
1. **Information We Collect:**
   - Name, email, phone number (from application form)
   - WhatsApp data (if user joins community)
   - Analytics data (GA4 cookies, page views, events)
   - IP address (for rate limiting and fraud prevention)

2. **How We Use Information:**
   - Process membership applications
   - Send service communications (picks, alerts)
   - Improve service quality
   - Comply with legal obligations

3. **Data Sharing:**
   - Email service provider (Resend)
   - Analytics provider (Google Analytics)
   - No selling of personal data

4. **User Rights (GDPR/CCPA):**
   - Right to access personal data
   - Right to delete personal data
   - Right to opt-out of marketing
   - How to exercise these rights

5. **Data Retention:**
   - Application data: retained for 2 years
   - Email communications: retained per legal requirements
   - Analytics data: retained per GA4 settings

6. **Security Measures:**
   - HTTPS encryption
   - Secure database storage
   - Access controls

7. **Contact Information:**
   - Email for privacy inquiries
   - Response time commitment (e.g., 7 business days)

### Terms of Use Content

**Required Sections:**
1. **Service Description:**
   - Sports betting analysis and picks
   - Educational content
   - Community access

2. **Eligibility:**
   - Must be 21+ years old
   - Must be in jurisdiction where sports betting is legal
   - Responsible gambling commitment

3. **Subscription Terms:**
   - Pricing and billing
   - Cancellation policy
   - Refund policy (if any)

4. **Disclaimer:**
   - "Past performance does not guarantee future results"
   - No guarantee of profits
   - User responsible for own betting decisions
   - Not financial advice

5. **Prohibited Conduct:**
   - No sharing of picks outside community
   - No harassment of other members
   - No illegal activity

6. **Intellectual Property:**
   - All content owned by WizJock
   - Limited license to subscribers

7. **Limitation of Liability:**
   - Not liable for betting losses
   - Service provided "as is"

8. **Dispute Resolution:**
   - Arbitration clause (if applicable)
   - Governing law

### Responsible Gambling Content

**Required Elements:**
1. **Warning Signs:**
   - List of problem gambling indicators
   - Self-assessment quiz

2. **Resources:**
   - 1-800-GAMBLER (National Helpline)
   - National Council on Problem Gambling (NCPG)
   - Gamblers Anonymous
   - State-specific resources

3. **Self-Exclusion:**
   - How to self-exclude from service
   - Links to state self-exclusion programs

4. **Betting Limits:**
   - Importance of setting limits
   - Bankroll management tips

5. **Age Verification:**
   - 21+ requirement
   - Consequences of underage gambling


## Implementation Phases

### Phase 1: Critical Fixes (Week 1)

**Priority: P0 - Must Have**

1. **Fix CTA Buttons:**
   - Update all CTA links from `#coming-soon` to `/apply`
   - Install React Router
   - Create basic routing structure

2. **Create Application Form:**
   - Build Apply page component
   - Implement form validation
   - Create backend API endpoint
   - Set up database table
   - Test end-to-end submission

3. **Add Legal Pages:**
   - Create Privacy Policy page
   - Create Terms of Use page
   - Create Responsible Gambling page
   - Create About page
   - Create Contact page
   - Add footer with links

**Success Criteria:**
- All CTAs navigate to working application form
- Form successfully submits and stores data
- All legal pages return 200 (no 404s)
- Footer displays on all pages

### Phase 2: Email & Compliance (Week 1-2)

**Priority: P0 - Must Have**

1. **Email Integration:**
   - Set up Resend account
   - Implement EmailService
   - Create confirmation email template
   - Create admin notification template
   - Test email delivery

2. **FTC Compliance:**
   - Create PerformanceDisclaimer component
   - Add disclaimers to all performance claims
   - Update Terms of Use with required disclaimers

3. **Coming Soon Modal:**
   - Create modal component
   - Update "VERIFIED RESULTS" link
   - Add honest messaging about dashboard

**Success Criteria:**
- Applicants receive confirmation email within 60 seconds
- Admin receives notification email
- All performance claims have disclaimers
- "Verified Results" shows coming soon message

### Phase 3: Analytics & Optimization (Week 2)

**Priority: P1 - Should Have**

1. **Analytics Setup:**
   - Install GA4
   - Implement event tracking
   - Test all events fire correctly

2. **Performance Optimization:**
   - Optimize images (WebP conversion)
   - Implement lazy loading
   - Code splitting for routes
   - Run Lighthouse audit

3. **Accessibility Audit:**
   - Run axe DevTools scan
   - Fix critical violations
   - Test keyboard navigation
   - Test with screen reader

**Success Criteria:**
- GA4 tracking all key events
- Lighthouse Performance score > 80
- Lighthouse Accessibility score > 90
- Zero critical accessibility violations

### Phase 4: Testing & Polish (Week 2-3)

**Priority: P1 - Should Have**

1. **Testing:**
   - Write unit tests for form component
   - Write integration tests for API
   - Manual testing on mobile devices
   - Cross-browser testing

2. **Error Handling:**
   - Implement comprehensive error messages
   - Add retry logic for email service
   - Test all error scenarios

3. **Final Polish:**
   - Review all copy for typos
   - Ensure consistent styling
   - Test all user flows
   - Security review

**Success Criteria:**
- All tests passing
- Error handling works correctly
- Site works on all major browsers
- Security vulnerabilities addressed


## Success Metrics

### Primary Metrics

**Conversion Rate:**
- **Definition:** (Form Submissions / Landing Page Visitors) × 100
- **Target:** > 2% (industry baseline for lead gen forms)
- **Measurement:** GA4 conversion tracking

**Form Completion Rate:**
- **Definition:** (Form Submissions / Form Starts) × 100
- **Target:** > 50%
- **Measurement:** GA4 event tracking (form_start vs form_submit)

**Email Delivery Rate:**
- **Definition:** (Emails Delivered / Emails Sent) × 100
- **Target:** > 95%
- **Measurement:** Resend dashboard + backend logs

### Secondary Metrics

**Page Load Performance:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **INP (Interaction to Next Paint):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Measurement:** Lighthouse CI + GA4 Web Vitals

**Accessibility Score:**
- **Target:** Lighthouse Accessibility score > 90
- **Zero critical violations** in axe DevTools
- **Measurement:** Automated testing in CI/CD

**Error Rate:**
- **Definition:** (Failed Form Submissions / Total Attempts) × 100
- **Target:** < 5%
- **Measurement:** Backend error logs + GA4 error events

### Business Impact Metrics

**Application Volume:**
- **Target:** Establish baseline in first 2 weeks
- **Growth Target:** 10% week-over-week increase
- **Measurement:** Database query + admin dashboard

**Bounce Rate:**
- **Definition:** % of visitors who leave without interaction
- **Target:** < 60% (industry average for landing pages)
- **Measurement:** GA4

**Time on Page:**
- **Target:** > 2 minutes (indicates engagement)
- **Measurement:** GA4

### Monitoring Dashboard

**Key Metrics to Display:**
1. Daily application submissions (chart)
2. Conversion rate trend (7-day rolling average)
3. Email delivery success rate
4. Page load performance (Core Web Vitals)
5. Error rate by type
6. Top traffic sources

**Tools:**
- GA4 for user behavior
- Backend admin dashboard for applications
- Resend dashboard for email metrics
- Lighthouse CI for performance trends

