# Backend Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker installed and running
- PostgreSQL 14+ (via Docker or local installation)

## Installation Steps

### 1. Install Dependencies

```bash
cd packages/backend
npm install
```

### 2. Start Database Services

Start PostgreSQL and Redis using Docker Compose from the project root:

```bash
# From project root
docker compose up -d postgres redis
```

Verify services are running:

```bash
docker compose ps
```

You should see both `sportsbook-postgres` and `sportsbook-redis` running.

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

The default configuration should work with the Docker Compose setup:

```
DATABASE_URL=postgresql://sportsbook:sportsbook_dev_password@localhost:5432/sportsbook_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Run Database Migrations

Create all database tables and indexes:

```bash
npm run migrate
```

Expected output:
```
Starting database migrations...
Found 1 migration file(s)
Executing 001_create_tables.sql...
✓ 001_create_tables.sql executed successfully
All migrations completed successfully
```

### 5. Seed Development Data

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user: `admin@sportsbook.com` / `admin123`
- Sample NFL report with picks, injuries, intelligence, and line movements

### 6. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## Quick Setup (All Steps)

Run everything in one go:

```bash
# From project root
docker compose up -d postgres redis

# From packages/backend
cd packages/backend
npm install
npm run db:setup  # Runs migrate + seed
npm run dev
```

## Database Management

### Reset Database

To drop all tables and start fresh:

```bash
# Connect to PostgreSQL
docker exec -it sportsbook-postgres psql -U sportsbook -d sportsbook_dev

# Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

# Re-run migrations and seeds
npm run db:setup
```

### View Database

Connect to PostgreSQL:

```bash
docker exec -it sportsbook-postgres psql -U sportsbook -d sportsbook_dev
```

Useful commands:
```sql
-- List all tables
\dt

-- Describe a table
\d reports

-- View sample data
SELECT * FROM reports;
SELECT * FROM picks LIMIT 5;
SELECT * FROM injuries;
```

### Stop Services

```bash
# From project root
docker compose down

# To also remove volumes (deletes all data)
docker compose down -v
```

## Troubleshooting

### Connection Refused

If you get "connection refused" errors:

1. Check if PostgreSQL is running:
   ```bash
   docker compose ps postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker compose logs postgres
   ```

3. Verify the DATABASE_URL in `.env` matches the Docker Compose configuration

### Migration Already Executed

If you need to re-run a migration:

```sql
-- Connect to database
docker exec -it sportsbook-postgres psql -U sportsbook -d sportsbook_dev

-- Remove migration record
DELETE FROM migrations WHERE name = '001_create_tables.sql';
```

Then run `npm run migrate` again.

### TypeScript Errors

If you see TypeScript errors about missing types:

```bash
npm install --save-dev @types/node @types/express @types/pg
```

## Next Steps

After setup is complete:

1. Test the database connection by running the dev server
2. Verify sample data was created correctly
3. Begin implementing API endpoints (Task 3 in the implementation plan)
4. Use the admin credentials to test authentication endpoints

## Database Schema Overview

The database includes these main tables:

- **users** - Admin authentication
- **reports** - ML prediction reports by sport
- **picks** - Individual betting recommendations
- **player_props** - Player prop betting markets
- **injuries** - Player/fighter injury tracking
- **injury_pick_impact** - Links injuries to affected picks
- **intelligence_updates** - Real-time intelligence with credibility
- **line_movements** - Betting line change tracking

See `src/db/README.md` for detailed schema documentation.
