# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Create monorepo structure with separate packages for backend, admin-dashboard, and client-portal
  - Initialize TypeScript configuration for all packages
  - Set up Docker Compose for local development with PostgreSQL and Redis
  - Configure ESLint and Prettier for code consistency
  - Create shared types package for interfaces used across frontend and backend
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement database schema and migrations
  - Create PostgreSQL migration files for reports, picks, users, injuries, intelligence_updates, line_movements, player_props, and junction tables
  - Write database seed scripts for development and testing with sample injury and intelligence data
  - Implement database connection utility with connection pooling
  - Create database indexes for performance optimization (hierarchy, credibility, status, etc.)
  - _Requirements: 1.3, 2.1, 2.2, 7.1, 9.1, 9.2, 10.1, 11.1, 12.1, 13.1_

- [x] 3. Build backend API foundation
  - [x] 3.1 Set up Express server with TypeScript
    - Configure Express application with middleware (CORS, body-parser, helmet)
    - Implement request logging middleware
    - Set up error handling middleware
    - Create health check endpoint
    - _Requirements: All requirements depend on API foundation_

  - [x] 3.2 Implement authentication system
    - Create JWT token generation and validation utilities
    - Implement password hashing with bcrypt
    - Build login endpoint with email/password validation
    - Create authentication middleware for protected routes
    - Implement token refresh mechanism
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

  - [x] 3.3 Set up Redis caching layer
    - Create Redis connection utility
    - Implement cache get/set/delete helper functions
    - Build cache invalidation logic for publish/unpublish operations
    - _Requirements: 2.1, 3.3_

- [x] 4. Implement prediction engine integration layer
  - [x] 4.1 Create standardized prediction engine interface
    - Define TypeScript interface for prediction engines
    - Create adapter pattern for each sport's engine (NFL/NCAA, NBA, UFC)
    - Implement engine health check functionality
    - Build error handling for engine failures
    - _Requirements: 1.1, 1.2_

  - [x] 4.2 Build report generation service
    - Create service to call appropriate prediction engine based on sport
    - Transform engine output to standardized Pick format with hierarchy, units, confidence, and risk scores
    - Extract and save injury updates, intelligence updates, and line movements from engine output
    - Save generated report with all associated data to database
    - Implement timeout handling for long-running engines (up to 120 seconds)
    - Calculate expected value for each pick based on confidence and odds
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 9.1, 10.1, 11.1, 11.5, 12.4_

- [x] 5. Build admin API endpoints
  - [x] 5.1 Implement report management endpoints
    - Create POST /api/admin/reports/generate endpoint with full report data
    - Create GET /api/admin/reports endpoint with filtering by sport and status
    - Create GET /api/admin/reports/:reportId endpoint for detailed report view
    - Create POST /api/admin/reports/:reportId/publish endpoint
    - Create DELETE /api/admin/reports/:reportId/unpublish endpoint
    - Implement transaction handling for publish/unpublish operations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 5.1, 5.2, 5.3, 5.4_

  - [x] 5.2 Implement injury management endpoints
    - Create POST /api/admin/injuries endpoint for adding injury updates
    - Create PATCH /api/admin/injuries/:injuryId endpoint for updating injury status
    - Create GET /api/admin/injuries endpoint with filtering by report, player, and status
    - Implement automatic pick flagging when critical injuries are added
    - Calculate and return affected picks for each injury
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 5.3 Implement intelligence management endpoints
    - Create POST /api/admin/intelligence endpoint for adding intelligence updates
    - Create GET /api/admin/intelligence endpoint with filtering by report, entity, and credibility
    - Implement automatic credibility rating assignment based on source type
    - Flag intelligence updates added in last 24 hours as "new"
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 5.4 Implement line movement tracking endpoints
    - Create POST /api/admin/line-movements endpoint for tracking line changes
    - Create GET /api/admin/line-movements/:pickId endpoint for movement history
    - Calculate movement percentage and direction automatically
    - Highlight significant movements (>10% change)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 5.5 Implement pick editing endpoints
    - Create PATCH /api/admin/picks/:pickId endpoint for updating hierarchy, units, and reasoning
    - Validate pick hierarchy assignments (warn on multiple locks)
    - Allow manual override of auto-suggested hierarchy
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 5.6 Implement player props endpoints
    - Create POST /api/admin/player-props endpoint for adding props to picks
    - Create GET /api/admin/player-props endpoint with filtering
    - Associate props with parent game picks
    - Implement automatic prop flagging when player injuries occur
    - Create POST /api/admin/player-props/:propId/outcome endpoint for tracking results
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 5.7 Implement performance tracking endpoints
    - Create POST /api/admin/picks/:pickId/outcome endpoint
    - Create GET /api/admin/performance endpoint with aggregation logic
    - Implement date range filtering for performance metrics
    - Calculate win/loss/push rates from database
    - Build trend data aggregation for charts
    - Track performance by pick hierarchy (locks vs value plays)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.8 Write API endpoint tests
    - Create integration tests for all admin endpoints (reports, injuries, intelligence, line movements, picks, props)
    - Test authentication and authorization flows
    - Test error handling scenarios
    - Verify database state changes after operations
    - Test automatic flagging and credibility assignment logic
    - _Requirements: All admin requirements_

- [x] 6. Build client-facing API endpoints
  - [x] 6.1 Implement picks retrieval endpoints
    - Create GET /api/picks endpoint with sport, bet type, and hierarchy filtering
    - Implement data transformation from admin Pick format to simplified ClientPick format
    - Hide detailed intelligence, risk scores, credibility ratings, and line movements from client response
    - Include only essential fields: matchup, odds, hierarchy, stars, units, brief reasoning, simplified injury summary
    - Implement Redis caching for published picks
    - Create GET /api/picks/sports endpoint for navigation data with lock of week indicator
    - Create GET /api/picks/:pickId/props endpoint for player props
    - Add response headers for cache control
    - Sort picks by hierarchy first (locks at top), then by game time
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.5, 12.5, 13.3_

  - [x] 6.2 Write client API tests
    - Test picks retrieval with various filters (sport, bet type, hierarchy)
    - Verify caching behavior
    - Test response format matches ClientPick interface
    - Verify admin-only data is excluded from client responses
    - Test hierarchy-based sorting
    - Test player props retrieval
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 13.3_

- [-] 7. Build admin dashboard frontend
  - [x] 7.1 Set up React application with routing
    - Initialize React app with TypeScript and Vite
    - Configure React Router with protected routes
    - Set up Tailwind CSS
    - Create layout components (header, sidebar, main content)
    - Implement authentication context and login page
    - _Requirements: All admin requirements_

  - [x] 7.2 Implement ReportRunner component
    - Create sport selection dropdown
    - Build report generation trigger button with loading state (up to 120 seconds)
    - Display comprehensive report with multiple sections: injuries, intelligence, line movements, picks
    - Show picks with full admin details: confidence, risk scores, EV, hierarchy, units, detailed analysis
    - Display intelligence updates sorted by credibility with source indicators
    - Highlight critical injuries and new intelligence updates
    - Show line movements with direction indicators
    - Implement approve/publish button for entire report
    - Add error display for generation failures
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 7.3 Build PublishingControl component
    - Display list of draft reports
    - Show currently published reports with unpublish button
    - Implement publication history view with timestamps
    - Add confirmation dialogs for publish/unpublish actions
    - Display administrator who published each report
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.4 Create PerformanceTracker component
    - Display win/loss/push statistics cards for each sport
    - Implement date range picker for filtering
    - Build line charts using Recharts for accuracy trends
    - Add bet type filter dropdown
    - Add hierarchy filter to compare performance of locks vs value plays
    - Create export functionality for performance data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 7.5 Build InjuryManager component
    - Display all tracked injuries with status indicators (red for critical, yellow for moderate)
    - Create form for adding new injury updates with player search
    - Show affected picks for each injury
    - Implement bulk status update actions
    - Add automatic pick flagging when critical injuries are added
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 7.6 Build IntelligenceHub component
    - Display all intelligence updates for current report
    - Create form for adding new intelligence with source credibility assignment
    - Implement credibility threshold filter (show only 80%+ sources)
    - Highlight new intelligence added in last 24 hours with "NEW" badge
    - Group intelligence by player/fighter
    - Add search and tagging functionality
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 7.7 Build LineMovementTracker component
    - Display opening vs current lines for all picks in a table
    - Highlight significant movements (>10% change) with color coding
    - Show direction indicators (arrows toward/away from pick)
    - Allow adding notes about sharp money
    - Display calculated expected value for each pick
    - Provide alerts for favorable line movements
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 7.8 Build PickEditor component
    - Create inline editing interface for pick hierarchy, units, and reasoning
    - Implement hierarchy dropdown with validation (warn on multiple locks)
    - Add unit selector (1-5 units)
    - Provide text areas for brief reasoning and detailed analysis
    - Show auto-suggested hierarchy with manual override option
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 7.9 Build PlayerPropsManager component
    - Display player props associated with each game pick
    - Create form for adding new props with player search
    - Show prop details: player, stat type, line, over/under, odds, confidence
    - Implement automatic flagging when player injuries occur
    - Allow editing and deleting props
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 7.10 Implement API integration with React Query
    - Set up React Query client with caching configuration
    - Create custom hooks for all admin API endpoints (reports, injuries, intelligence, line movements, picks, props, performance)
    - Implement optimistic updates for publish/unpublish and pick editing
    - Add error handling and retry logic
    - Implement real-time refetching for injury and intelligence updates
    - _Requirements: All admin requirements_

  - [x] 7.11 Write admin dashboard component tests
    - Test ReportRunner user interactions and comprehensive report display
    - Test PublishingControl publish/unpublish flows
    - Test PerformanceTracker filtering and display
    - Test InjuryManager adding and updating injuries
    - Test IntelligenceHub filtering by credibility
    - Test LineMovementTracker highlighting significant movements
    - Test PickEditor hierarchy validation and manual overrides
    - Test PlayerPropsManager adding and flagging props
    - Verify error handling in all components
    - _Requirements: All admin requirements_

- [ ] 8. Build client portal frontend
  - [x] 8.1 Set up React application with routing
    - Initialize React app with TypeScript and Vite
    - Configure React Router for sport navigation
    - Set up Tailwind CSS with custom theme for large fonts
    - Create responsive layout component
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.2 Implement SportNavigation component
    - Create large touch-friendly sport selection buttons
    - Display pick count badge on each sport button
    - Implement active state highlighting
    - Make navigation responsive (horizontal on desktop, vertical on mobile)
    - _Requirements: 4.1, 4.4_

  - [x] 8.3 Build PicksDisplay component
    - Create card-based layout for picks with hierarchy-based ordering
    - Implement extra-large font sizes (20px body, 28px headings)
    - Add visual hierarchy indicators: gold badge + 5 stars for locks, silver badge + 4 stars for featured, 3 stars for high confidence, 2 stars for medium, 1-2 stars + "Value" tag for value plays
    - Display: matchup, game time, bet type, recommendation, current odds, unit recommendation (1-5 units), brief reasoning (1-2 sentences max)
    - Show simplified injury summary if relevant (e.g., "Key player out")
    - Hide detailed intelligence, credibility ratings, risk scores, line movements, and complex analytics
    - Sort picks by hierarchy first (locks at top), then by game time
    - Make cards responsive and touch-friendly with minimum 44px touch targets
    - Add expandable section for player props under each game (collapsed by default)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 13.3_

  - [x] 8.4 Create BetTypeFilter component
    - Build horizontal scrollable filter chips
    - Display pick count for each bet type
    - Implement filter state management
    - Add "All" option to clear filters
    - Persist filter selection across navigation
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x] 8.5 Implement UpdateIndicator component
    - Display "Last Updated: X minutes ago" text
    - Implement auto-refresh every 60 seconds
    - Show warning icon for picks older than 24 hours
    - Display next scheduled update time if available
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 8.6 Implement API integration with React Query
    - Set up React Query client with aggressive caching
    - Create custom hooks for picks retrieval
    - Implement automatic background refetching
    - Add offline detection and cached data display
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 8.7 Optimize for mobile devices
    - Implement responsive breakpoints for all components
    - Ensure minimum 44px touch targets for all interactive elements
    - Test and optimize page load performance
    - Implement lazy loading for images if any
    - Add viewport meta tag for proper mobile rendering
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.8 Write client portal component tests
    - Test SportNavigation interactions
    - Test PicksDisplay rendering with hierarchy-based ordering and star ratings
    - Test that admin-only data is not displayed (intelligence, risk scores, etc.)
    - Test player props expandable sections
    - Test BetTypeFilter state management
    - Test UpdateIndicator auto-refresh behavior
    - Verify responsive behavior at different breakpoints
    - Test simplified injury summary display
    - _Requirements: All client requirements_

- [x] 9. Implement error handling across the application
  - [x] 9.1 Add backend error handling
    - Implement global error handler middleware
    - Add specific error classes for different error types
    - Implement circuit breaker for prediction engine failures
    - Add database transaction rollback on errors
    - Create error logging service
    - _Requirements: 2.3_

  - [x] 9.2 Add frontend error boundaries
    - Create React error boundary components
    - Implement user-friendly error messages
    - Add retry buttons for failed operations
    - Display offline indicators when network is unavailable
    - Implement exponential backoff for retries
    - _Requirements: 2.3_

- [x] 10. Set up deployment infrastructure
  - [x] 10.1 Create Docker configurations
    - Write Dockerfile for backend API
    - Write Dockerfile for admin dashboard
    - Write Dockerfile for client portal
    - Create production Docker Compose file
    - Configure Nginx as reverse proxy
    - _Requirements: All requirements_

  - [x] 10.2 Configure SSL/TLS
    - Set up SSL certificates (Let's Encrypt or similar)
    - Configure Nginx for HTTPS
    - Implement HTTP to HTTPS redirect
    - Configure secure headers
    - _Requirements: All requirements_

  - [x] 10.3 Set up CI/CD pipeline
    - Create GitHub Actions or similar CI workflow
    - Configure automated testing on pull requests
    - Set up automated Docker image builds
    - Configure staging deployment
    - Create production deployment workflow with manual approval
    - _Requirements: All requirements_

- [x] 11. Implement monitoring and logging
  - [x] 11.1 Set up application logging
    - Configure structured logging for backend
    - Implement log aggregation
    - Set up error tracking (Sentry or similar)ke
    - Create log rotation policies
    - _Requirements: All requirements_

  - [x] 11.2 Set up performance monitoring
    - Implement API response time tracking
    - Set up slow query logging
    - Configure resource usage monitoring
    - Create performance dashboards
    - _Requirements: All requirements_
    - Set up database query performance monitoring
    - Configure uptime monitoring with alerts
    - Create performance dashboards
    - _Requirements: All requirements_

- [x] 12. Perform security hardening
  - [x] 12.1 Implement rate limiting
    - Add rate limiting middleware to API
    - Configure different limits for public vs admin endpoints
    - Implement IP-based rate limiting
    - Add rate limit headers to responses
    - _Requirements: All requirements_

  - [x] 12.2 Add input validation
    - Implement request validation middleware using Zod or Joi
    - Validate all user inputs on backend
    - Add SQL injection prevention checks
    - Implement XSS prevention measures
    - Configure CSRF protection
    - _Requirements: All requirements_

- [x] 13. Create initial admin user and seed data
  - Write script to create first admin user
  - Create seed data for testing (sample reports and picks)
  - Document admin user creation process
  - _Requirements: 1.1, 5.5_

- [x] 14. Write end-to-end tests
  - Set up Playwright for E2E testing
  - Write test for admin report generation and publishing flow
  - Write test for client viewing picks flow
  - Write test for admin unpublishing flow
  - Test mobile viewport scenarios
  - _Requirements: All requirements_

- [x] 15. Perform accessibility audit
  - Run automated accessibility tests with axe-core
  - Test keyboard navigation throughout application
  - Test with screen readers (NVDA, VoiceOver)
  - Verify color contrast ratios
  - Fix any identified accessibility issues
  - _Requirements: 3.2, 3.3, 6.2_

- [x] 16. Create documentation
  - Write API documentation with example requests/responses
  - Create admin user guide with screenshots
  - Document deployment process
  - Create troubleshooting guide
  - Document prediction engine integration process
  - _Requirements: All requirements_
