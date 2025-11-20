# Requirements Document

## Introduction

This document outlines the requirements for making the WizJock landing page credible and functional. The current landing page makes bold performance claims (+18.7% ROI) but has broken call-to-action buttons and missing legal pages, creating a severe trust deficit. This focused initiative addresses only the P0 blockers and essential trust signals needed to make the landing page legitimate while the full platform is being built.

## Glossary

- **CTA (Call-to-Action)**: Buttons or links that prompt users to take a specific action, such as "Request Access" or "Get Started"
- **P0 Blocker**: A critical issue that completely prevents core functionality and must be fixed immediately
- **Landing Page**: The main public-facing homepage at wizjock.com that visitors see first
- **Application Form**: A web form where potential subscribers can request access to the service
- **Legal Pages**: Essential pages like Privacy Policy, Terms of Use, and Responsible Gambling that establish legitimacy
- **Performance Claims**: Specific metrics displayed on the site like "+18.7% ROI LAST 90 DAYS"
- **FTC Substantiation**: Federal Trade Commission requirement that advertising claims be supported by competent and reliable evidence
- **WCAG 2.2 AA**: Web Content Accessibility Guidelines Level AA compliance standard ensuring the site is usable by people with disabilities

## Requirements

### Requirement 1: Fix Broken Call-to-Action Buttons

**User Story:** As a potential subscriber visiting the WizJock landing page, I want all "Request Access" and "Get Started" buttons to work, so that I can apply for membership

#### Acceptance Criteria

1. WHEN a user clicks any "Request Access" or "Get Started" button on the landing page, THE system SHALL navigate to a functional application form page
2. THE application form SHALL be accessible at the URL path /apply
3. THE application form SHALL collect: full name, email address, phone number, and betting experience level (dropdown: Beginner, Intermediate, Advanced, Professional)
4. THE application form SHALL include a checkbox for SMS consent with TCPA-compliant language: "I agree to receive automated text messages from WizJock. Message and data rates may apply. Reply STOP to opt out."
5. WHEN a user submits the application form with valid data, THE system SHALL store the submission in a database table
6. WHEN a user submits the application form, THE system SHALL display a confirmation message: "Application received! We'll review your request and contact you within 24-48 hours."
7. THE system SHALL send an automated confirmation email to the applicant within 60 seconds of form submission
8. IF form submission fails, THEN THE system SHALL display a clear error message and preserve the user's entered data
9. ALL CTA buttons on the landing page (header, hero section, pricing cards, final CTA) SHALL link to /apply
10. THE application form SHALL validate email format and require all fields before submission

### Requirement 2: Create Essential Legal Pages

**User Story:** As a potential subscriber evaluating WizJock, I want to access Privacy Policy, Terms of Use, and Responsible Gambling pages, so that I can verify the legitimacy and understand my rights

#### Acceptance Criteria

1. THE website SHALL display a Privacy Policy page at /privacy that returns HTTP 200 (not 404)
2. THE Privacy Policy SHALL detail what personal data is collected (name, email, phone, WhatsApp data) and how it's used
3. THE Privacy Policy SHALL include data subject rights under GDPR and CCPA (right to access, delete, opt-out)
4. THE Privacy Policy SHALL specify data retention policies and third-party data sharing practices
5. THE website SHALL display a Terms of Use page at /terms that returns HTTP 200 (not 404)
6. THE Terms of Use SHALL outline subscription terms, refund policy, service rules, and user obligations
7. THE Terms of Use SHALL include a disclaimer: "Past performance does not guarantee future results"
8. THE website SHALL display a Responsible Gambling page at /responsible-gambling that returns HTTP 200 (not 404)
9. THE Responsible Gambling page SHALL include the 1-800-GAMBLER helpline, links to NCPG (National Council on Problem Gambling), and a strict 21+ age policy
10. THE website SHALL display an About Us page at /about with company mission and founder information
11. THE website SHALL display a Contact page at /contact with an email address and support form
12. ALL legal pages SHALL be linked in the website footer on every page
13. THE footer SHALL be visible on the landing page and all new pages

### Requirement 3: Add FTC-Compliant Performance Disclaimers

**User Story:** As the WizJock business owner, I want all performance claims to include proper disclaimers, so that I comply with FTC advertising regulations and avoid legal penalties

#### Acceptance Criteria

1. THE top banner displaying "+18.7% ROI LAST 90 DAYS • +4.2% AVG EV • VERIFIED RESULTS" SHALL include a disclaimer
2. THE disclaimer SHALL read: "*Past performance does not guarantee future results"
3. THE disclaimer SHALL be displayed in close proximity to the performance claims (within the same banner or immediately below)
4. THE disclaimer SHALL use a legible font size (minimum 11px) and sufficient color contrast
5. THE "Live Stats Bar" section displaying ROI, EV, and member count SHALL include the same disclaimer
6. THE "Social Proof Bar" section displaying performance metrics SHALL include the same disclaimer
7. THE disclaimer SHALL be visible on mobile devices without requiring scrolling or interaction
8. ALL performance claims SHALL be accompanied by this disclaimer wherever they appear on the landing page

### Requirement 4: Replace "Verified Results" Link with Coming Soon Message

**User Story:** As a visitor clicking on performance claims, I want to see an honest message about upcoming verification, so that I don't encounter broken links or feel misled

#### Acceptance Criteria

1. THE top banner text "VERIFIED RESULTS" SHALL be clickable
2. WHEN a user clicks "VERIFIED RESULTS", THE system SHALL display a modal or navigate to a page at /results
3. THE results page or modal SHALL display the message: "Our public performance dashboard is coming soon. All picks are currently tracked and verified in our private WhatsApp community. Request access to view live results."
4. THE message SHALL include a "Request Access" button linking to /apply
5. THE "100% Transparent Results" section on the landing page SHALL include a note: "Full public dashboard launching soon"
6. THE system SHALL NOT display 404 errors when users click on results-related links
7. THE messaging SHALL be honest and set proper expectations without making unsubstantiated claims

### Requirement 5: Ensure Mobile Responsiveness and Accessibility

**User Story:** As a mobile user or user with disabilities, I want the landing page to be fully accessible and functional on my device, so that I can navigate and apply for membership

#### Acceptance Criteria

1. THE landing page SHALL be fully responsive and functional on screen sizes from 320px to 2560px width
2. ALL buttons and links SHALL be keyboard accessible with visible focus indicators
3. ALL images SHALL include descriptive alt text
4. THE application form SHALL have properly associated labels for all input fields
5. THE website SHALL maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
6. THE website SHALL support browser zoom up to 200% without loss of functionality or content
7. THE website SHALL pass automated accessibility testing with axe DevTools with zero critical violations
8. ALL interactive elements SHALL have a minimum touch target size of 44x44 pixels on mobile devices
9. THE website SHALL load and be interactive within 3 seconds on a 4G mobile connection

### Requirement 6: Update WhatsApp Link Context

**User Story:** As a visitor clicking the WhatsApp link, I want to understand what I'm joining, so that I have proper expectations before joining the group

#### Acceptance Criteria

1. THE "Join WhatsApp" button SHALL remain functional and link to the existing WhatsApp group
2. WHEN a user hovers over or clicks the "Join WhatsApp" button, THE system SHALL display a tooltip or brief description
3. THE description SHALL read: "Join our community to see live picks and results. Free to join, subscription required for full access."
4. THE "See All Wins" button linking to WhatsApp SHALL include similar context
5. THE landing page SHALL include a section explaining: "Our WhatsApp community is where members receive daily picks and track results in real-time"
6. THE WhatsApp link SHALL open in a new tab/window with rel="noopener noreferrer" for security

### Requirement 7: Add Email Confirmation System

**User Story:** As an applicant who submitted the request access form, I want to receive a confirmation email, so that I know my application was received and what to expect next

#### Acceptance Criteria

1. WHEN a user successfully submits the application form, THE system SHALL send an automated email within 60 seconds
2. THE confirmation email SHALL include: applicant's name, confirmation that application was received, expected response time (24-48 hours), and contact email for questions
3. THE email subject line SHALL be: "WizJock Application Received - Next Steps"
4. THE email SHALL be sent from a professional email address (e.g., team@wizjock.com or hello@wizjock.com)
5. THE email SHALL include the WizJock logo and maintain brand consistency
6. THE email SHALL include a footer with links to Privacy Policy and Contact page
7. IF email delivery fails, THE system SHALL log the error and retry up to 3 times
8. THE system SHALL use a reliable email service (e.g., SendGrid, AWS SES, Resend) for delivery

### Requirement 8: Create Admin Notification for New Applications

**User Story:** As a WizJock admin, I want to be notified when someone submits an application, so that I can review and respond promptly

#### Acceptance Criteria

1. WHEN a user submits an application form, THE system SHALL send a notification email to the admin team
2. THE admin notification email SHALL include: applicant name, email, phone, betting experience level, submission timestamp, and SMS consent status
3. THE admin notification SHALL be sent to a configured admin email address (environment variable)
4. THE admin notification SHALL include a direct link to the applicant's information (if admin dashboard exists) or display all details in the email
5. THE notification SHALL be sent within 60 seconds of form submission
6. THE system SHALL log all application submissions for audit purposes

### Requirement 9: Implement Basic Analytics Tracking

**User Story:** As a product manager, I want to track key user behaviors on the landing page, so that I can measure conversion rates and identify issues

#### Acceptance Criteria

1. THE system SHALL implement Google Analytics 4 (GA4) tracking on the landing page
2. THE system SHALL track the following events: page_view, cta_click (with button location), form_start, form_submit, form_error, whatsapp_click
3. THE system SHALL track the conversion funnel: Landing Page View → Form Start → Form Submit
4. THE system SHALL respect user privacy preferences and comply with GDPR/CCPA consent requirements
5. THE system SHALL implement a cookie consent banner if required by applicable laws
6. THE analytics implementation SHALL not block page rendering or slow down page load times

### Requirement 10: Optimize Page Load Performance

**User Story:** As a visitor on a mobile device, I want the landing page to load quickly, so that I don't abandon the site due to slow performance

#### Acceptance Criteria

1. THE landing page SHALL achieve a Lighthouse Performance score of 80 or higher on mobile
2. THE landing page SHALL achieve "Good" Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
3. ALL images SHALL be optimized and served in modern formats (WebP with fallbacks)
4. THE landing page SHALL implement lazy loading for below-the-fold images
5. THE landing page SHALL minimize render-blocking resources
6. THE landing page SHALL use a CDN for static assets if possible
7. THE WizJock logo and winning slip images SHALL load without errors (no broken image links)
