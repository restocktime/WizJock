# Admin Dashboard

The admin dashboard for the unified sportsbook platform.

## Features Implemented

### Task 7.1: React Application with Routing ✅

- **React Router Setup**: Configured with protected routes for authenticated pages
- **Authentication Context**: JWT-based authentication with localStorage persistence
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Layout Components**:
  - Header with user email and logout button
  - Sidebar navigation with active state highlighting
  - Main content area with responsive layout
- **Login Page**: Full authentication flow with error handling
- **Page Stubs**: Created placeholder pages for all admin features:
  - Reports (Report Runner)
  - Publishing (Publishing Control)
  - Performance (Performance Tracker)
  - Injuries (Injury Manager)
  - Intelligence (Intelligence Hub)
  - Line Movements (Line Movement Tracker)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Routes

- `/login` - Login page (public)
- `/reports` - Report Runner (protected)
- `/publishing` - Publishing Control (protected)
- `/performance` - Performance Tracker (protected)
- `/injuries` - Injury Manager (protected)
- `/intelligence` - Intelligence Hub (protected)
- `/line-movements` - Line Movement Tracker (protected)
- `/` - Redirects to `/reports`

## Authentication

The app uses JWT tokens stored in localStorage. The authentication context provides:
- `isAuthenticated` - Boolean indicating auth status
- `user` - Current user object with email
- `login(email, password)` - Login function
- `logout()` - Logout function
- `loading` - Loading state during initial auth check

## Next Steps

Implement the remaining subtasks:
- 7.2: ReportRunner component
- 7.3: PublishingControl component
- 7.4: PerformanceTracker component
- 7.5: InjuryManager component
- 7.6: IntelligenceHub component
- 7.7: LineMovementTracker component
- 7.8: PickEditor component
- 7.9: PlayerPropsManager component
- 7.10: API integration with React Query
- 7.11: Component tests
