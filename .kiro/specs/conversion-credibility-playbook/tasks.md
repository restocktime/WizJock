# Implementation Plan

## Phase 1: Critical Fixes - Make Landing Page Functional

- [x] 1. Set up React Router and basic page structure
  - Install react-router-dom package
  - Create BrowserRouter wrapper in App.tsx
  - Create pages directory structure
  - Set up basic routes for all pages
  - _Requirements: 1.1, 1.7_

- [x] 2. Create application form page and API endpoint
- [x] 2.1 Build frontend application form component
  - Create Apply.tsx page component
  - Implement form fields (name, email, phone, experience, SMS consent)
  - Add client-side validation with error messages
  - Implement loading and success states
  - Style form with Tailwind CSS (mobile-responsive)
  - _Requirements: 1.2, 1.3, 1.4, 1.10_

- [x] 2.2 Create database schema for applications
  - Write migration file for applications table
  - Include all required fields and constraints
  - Add indexes for performance
  - Run migration on development database
  - _Requirements: 1.5_

- [x] 2.3 Build backend API endpoint for applications
  - Create POST /api/applications route
  - Implement Zod validation schema
  - Add database insert logic
  - Implement error handling (validation, duplicate email)
  - Add rate limiting (5 requests per hour per IP)
  - _Requirements: 1.5, 1.8_

- [x] 2.4 Connect frontend form to backend API
  - Implement form submission handler with axios
  - Handle success response (show confirmation message)
  - Handle error responses (display user-friendly errors)
  - Preserve form data on error
  - _Requirements: 1.6, 1.8_

- [x] 3. Update all CTA buttons to link to application form
  - Replace all href="#coming-soon" with href="/apply" or Link to="/apply"
  - Update header "GET STARTED" button
  - Update hero "Request Access" button
  - Update all three pricing card "Get Started" buttons
  - Update final CTA "Request Access Now" button
  - _Requirements: 1.1, 1.9_

- [x] 4. Create all essential legal pages
- [x] 4.1 Create Privacy Policy page
  - Write comprehensive privacy policy content
  - Include all required sections (data collection, usage, rights, retention)
  - Style with readable typography
  - Add last updated date
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4.2 Create Terms of Use page
  - Write terms of use content
  - Include subscription terms, disclaimers, liability limitations
  - Add "Past performance does not guarantee future results" disclaimer
  - Style consistently with Privacy Policy
  - _Requirements: 2.5, 2.6, 2.7_

- [x] 4.3 Create Responsible Gambling page
  - Write responsible gambling content
  - Include 1-800-GAMBLER helpline
  - Add NCPG links and resources
  - Include 21+ age policy
  - _Requirements: 2.8, 2.9_

- [x] 4.4 Create About Us page
  - Write company mission statement
  - Add founder/team information
  - Style with brand consistency
  - _Requirements: 2.10_

- [x] 4.5 Create Contact page
  - Add contact email address
  - Create simple contact form (optional)
  - Include business hours if applicable
  - _Requirements: 2.11_

- [x] 4.6 Create and add footer component to all pages
  - Create Footer.tsx component
  - Add links to all legal pages
  - Include copyright notice and "Gamble responsibly. 21+" message
  - Ensure footer displays on landing page and all new pages
  - _Requirements: 2.12, 2.13_

## Phase 2: Email Integration and FTC Compliance

- [x] 5. Set up email service integration
- [x] 5.1 Configure Resend email service
  - Create Resend account and get API key
  - Add environment variables (RESEND_API_KEY, FROM_EMAIL, ADMIN_EMAIL)
  - Install Resend SDK in backend
  - _Requirements: 7.7_

- [x] 5.2 Create email service module
  - Create EmailService.ts in backend services
  - Implement sendApplicationConfirmation method
  - Implement sendAdminNotification method
  - Add retry logic with exponential backoff (3 attempts)
  - Add comprehensive error logging
  - _Requirements: 7.1, 7.2, 8.1, 8.2_

- [x] 5.3 Create email templates
  - Write applicant confirmation email template
  - Write admin notification email template
  - Include all required information in each template
  - Add WizJock branding and footer links
  - _Requirements: 7.2, 7.3, 7.6, 8.2, 8.3_

- [x] 5.4 Integrate email service with application endpoint
  - Call email service after successful application submission
  - Send confirmation email to applicant
  - Send notification email to admin
  - Ensure emails don't block application submission
  - Log email delivery status
  - _Requirements: 7.1, 7.5, 8.1, 8.4, 8.5_

- [x] 6. Add FTC-compliant performance disclaimers
- [x] 6.1 Create PerformanceDisclaimer component
  - Build reusable disclaimer component
  - Support inline and block variants
  - Ensure minimum 11px font size and proper contrast
  - _Requirements: 3.2, 3.4_

- [x] 6.2 Add disclaimers to all performance claims
  - Add disclaimer to top banner (ROI/EV/Verified Results)
  - Add disclaimer to Live Stats Bar section
  - Add disclaimer to Social Proof Bar section
  - Ensure disclaimers are visible on mobile without scrolling
  - _Requirements: 3.1, 3.3, 3.5, 3.6, 3.7, 3.8_

- [x] 7. Create "Coming Soon" modal for results
  - Build ComingSoonModal component
  - Add honest messaging about upcoming dashboard
  - Include "Request Access" button linking to /apply
  - Make "VERIFIED RESULTS" in top banner clickable
  - Add note to "100% Transparent Results" section
  - Implement modal accessibility (focus trap, ESC key, ARIA)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

## Phase 3: Analytics, Performance, and Accessibility

- [x] 8. Implement Google Analytics 4 tracking
- [x] 8.1 Set up GA4 account and tracking
  - Create GA4 property
  - Get measurement ID
  - Add GA4 script to index.html
  - Configure environment variable (VITE_GA_MEASUREMENT_ID)
  - _Requirements: 9.1_

- [x] 8.2 Create analytics utility module
  - Create analytics.ts utility file
  - Implement trackEvent function
  - Implement trackPageView function
  - Implement trackCTAClick function
  - Implement trackFormStart and trackFormSubmit functions
  - _Requirements: 9.2_

- [x] 8.3 Add event tracking to components
  - Track CTA clicks with location parameter
  - Track form start (on first field focus)
  - Track form submit (success and error)
  - Track WhatsApp link clicks
  - Track page views on route changes
  - _Requirements: 9.2, 9.3_

- [x] 8.4 Implement privacy compliance for analytics
  - Add cookie consent banner (if required for target audience)
  - Respect user privacy preferences
  - Ensure analytics doesn't block page rendering
  - _Requirements: 9.4, 9.5, 9.6_

- [x] 9. Optimize page load performance
- [x] 9.1 Optimize images
  - Convert winning slip images to WebP format with JPEG fallbacks
  - Compress all images to <100KB
  - Optimize WizJock logo
  - Implement responsive images with srcSet
  - Add lazy loading to below-the-fold images
  - _Requirements: 10.3, 10.4_

- [x] 9.2 Implement code splitting
  - Add lazy loading for route components
  - Create Suspense boundaries with loading states
  - Configure Vite for optimal bundle splitting
  - _Requirements: 10.5_

- [x] 9.3 Run Lighthouse audit and fix issues
  - Run Lighthouse performance audit
  - Fix render-blocking resources
  - Optimize Core Web Vitals (LCP, INP, CLS)
  - Achieve Performance score > 80
  - _Requirements: 10.1, 10.2, 10.6_

- [x] 10. Ensure accessibility compliance
- [x] 10.1 Implement keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Add visible focus indicators (2px outline)
  - Verify logical tab order
  - Add skip-to-main-content link
  - _Requirements: 5.2_

- [x] 10.2 Add ARIA labels and semantic HTML
  - Use semantic HTML elements (header, nav, main, footer)
  - Add ARIA labels for icon buttons
  - Add ARIA live regions for dynamic content
  - Add alt text to all images
  - _Requirements: 5.3_

- [x] 10.3 Ensure proper form accessibility
  - Associate labels with inputs (for/id)
  - Add aria-required to required fields
  - Link error messages with aria-describedby
  - _Requirements: 5.4_

- [x] 10.4 Test and fix accessibility issues
  - Run axe DevTools scan and fix critical violations
  - Test with NVDA or VoiceOver screen reader
  - Test keyboard-only navigation
  - Verify color contrast meets WCAG AA (4.5:1 for normal text)
  - Test browser zoom up to 200%
  - Verify touch targets are 44x44px on mobile
  - Achieve Lighthouse Accessibility score > 90
  - _Requirements: 5.5, 5.6, 5.7, 5.8, 10.7_

## Phase 4: Mobile Responsiveness and WhatsApp Context

- [x] 11. Ensure mobile responsiveness
  - Test landing page on screen sizes 320px to 2560px
  - Fix any layout issues on mobile devices
  - Ensure all buttons and forms work on touch devices
  - Verify page loads within 3 seconds on 4G connection
  - Test on actual mobile devices (iOS and Android)
  - _Requirements: 5.1, 5.9_

- [x] 12. Update WhatsApp link with context
  - Add tooltip or description to "Join WhatsApp" button
  - Update button text or add subtext with context
  - Add section explaining WhatsApp community
  - Ensure WhatsApp links open in new tab with rel="noopener noreferrer"
  - Update "See All Wins" button with similar context
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

## Phase 5: Testing and Quality Assurance

- [x] 13. Write and run automated tests
- [x] 13.1 Write unit tests for frontend components
  - Test ApplicationForm validation logic
  - Test PerformanceDisclaimer rendering
  - Test analytics utility functions
  - _Requirements: All_

- [x] 13.2 Write integration tests for backend API
  - Test POST /api/applications with valid data
  - Test validation errors (invalid email, missing fields)
  - Test duplicate email handling
  - Test rate limiting
  - _Requirements: 1.5, 1.8_

- [x] 13.3 Write accessibility tests
  - Add axe-core automated tests
  - Verify no critical accessibility violations
  - _Requirements: 5.7_

- [x] 14. Perform manual testing
  - Test complete user flow: landing page → apply → confirmation
  - Verify confirmation email is received
  - Verify admin notification email is received
  - Test all legal pages load correctly (no 404s)
  - Test on multiple browsers (Chrome, Safari, Firefox, Edge)
  - Test on mobile devices (iOS Safari, Android Chrome)
  - Test with screen reader (NVDA or VoiceOver)
  - Test keyboard-only navigation
  - _Requirements: All_

- [x] 15. Security review and hardening
  - Verify input validation on backend
  - Test rate limiting works correctly
  - Verify CORS configuration is correct
  - Ensure no PII is logged
  - Test SQL injection prevention
  - Verify HTTPS is enforced in production
  - _Requirements: 1.8_

## Phase 6: Deployment and Monitoring

- [x] 16. Prepare for deployment
  - Set all environment variables in production
  - Run database migration on production database
  - Configure Resend for production email sending
  - Set up domain authentication (SPF, DKIM, DMARC)
  - Configure GA4 for production domain
  - _Requirements: All_

- [x] 17. Deploy to production
  - Deploy backend API
  - Deploy frontend application
  - Verify all environment variables are set
  - Run smoke tests on production
  - _Requirements: All_

- [x] 18. Post-deployment verification
  - Test all CTAs link to /apply
  - Submit test application and verify emails
  - Check all legal pages return 200
  - Verify GA4 events are being tracked
  - Monitor error logs for first 24 hours
  - Run Lighthouse audit on production
  - _Requirements: All_

- [x] 19. Set up monitoring and alerts
  - Configure error logging and alerting
  - Set up email delivery monitoring
  - Monitor application submission rate
  - Track Core Web Vitals in GA4
  - Create admin dashboard for viewing applications
  - _Requirements: 8.6, 9.2_
