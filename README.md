# Unified Sportsbook Platform

A comprehensive sports betting analytics platform that consolidates multiple ML-driven prediction engines (NFL, NCAA, NBA, UFC) into a unified interface with an admin dashboard and client-facing portal.

## Project Structure

This is a monorepo managed with npm workspaces:

```
unified-sportsbook-platform/
├── packages/
│   ├── shared-types/       # Shared TypeScript types and interfaces
│   ├── backend/            # Node.js/Express API server
│   ├── admin-dashboard/    # React admin interface
│   └── client-portal/      # React client-facing interface
├── docker-compose.yml      # PostgreSQL and Redis services
└── package.json            # Root workspace configuration
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### 2. Start Development Services

Start PostgreSQL and Redis using Docker Compose:

```bash
npm run docker:up
```

### 3. Configure Environment Variables

Copy the example environment file for the backend:

```bash
cp packages/backend/.env.example packages/backend/.env
```

Edit `packages/backend/.env` if needed (defaults should work for local development).

### 4. Start Development Servers

Start all services in development mode:

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Admin Dashboard on http://localhost:5173
- Client Portal on http://localhost:5174

Or start services individually:

```bash
npm run dev:backend
npm run dev:admin
npm run dev:client
```

## Available Scripts

### Root Level

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View Docker logs

### Package-Specific

Navigate to a package directory and run:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint code

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL (database)
- Redis (caching)
- JWT authentication

### Frontend (Admin & Client)
- React 18
- TypeScript
- Tailwind CSS
- React Query (data fetching)
- React Router (navigation)
- Vite (build tool)

## Development Workflow

1. Make changes to code in any package
2. Changes will hot-reload automatically
3. Shared types are available to all packages via `@sportsbook/shared-types`
4. Backend API is proxied through Vite dev servers

## Docker Services

The `docker-compose.yml` file provides:

- **PostgreSQL** on port 5432
  - Database: `sportsbook_dev`
  - User: `sportsbook`
  - Password: `sportsbook_dev_password`

- **Redis** on port 6379

## Post-Deployment Verification

After deploying to production, run the verification suite to ensure everything is working correctly:

### Quick Verification (15 minutes)

```bash
# Run automated checks
./scripts/post-deployment-verification.sh

# Test application flow
./scripts/test-application-flow.sh

# Verify GA4 setup
node scripts/verify-ga4-events.js
```

See `VERIFICATION_QUICK_GUIDE.md` for a condensed checklist.

### Comprehensive Verification

For full verification including Lighthouse audits and 24-hour monitoring:

```bash
# Run Lighthouse audits (requires lighthouse CLI)
npm install -g lighthouse
./scripts/lighthouse-audit.sh

# Start 24-hour monitoring
./scripts/setup-monitoring.sh
```

See `POST_DEPLOYMENT_VERIFICATION.md` for the complete verification checklist.

### Verification Documents

- **VERIFICATION_QUICK_GUIDE.md** - 15-minute quick verification
- **POST_DEPLOYMENT_VERIFICATION.md** - Comprehensive verification checklist
- **VERIFICATION_SUMMARY.md** - Template for documenting verification results

## Next Steps

Refer to the implementation plan in `.kiro/specs/unified-sportsbook-platform/tasks.md` for the development roadmap.

## License

Private - All Rights Reserved
