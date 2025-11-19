# Database Setup

This directory contains database migrations, connection utilities, and seed data for the Unified Sportsbook Platform.

## Structure

```
db/
├── connection.ts          # Database connection pool and query utilities
├── migrations/            # SQL migration files
│   ├── 001_create_tables.sql
│   └── migrate.ts        # Migration runner
└── seeds/                # Seed data for development
    └── seed.ts           # Seed script
```

## Setup

### Prerequisites

- PostgreSQL 14+ installed and running
- Database created (see docker-compose.yml in project root)

### Environment Variables

Create a `.env` file in the backend package root with:

```
DATABASE_URL=postgresql://sportsbook:sportsbook_dev_password@localhost:5432/sportsbook_dev
```

### Running Migrations

To create all database tables and indexes:

```bash
npm run migrate
```

This will:
- Create a `migrations` tracking table
- Execute all `.sql` files in the `migrations/` directory in order
- Skip already-executed migrations

### Seeding Data

To populate the database with sample data for development:

```bash
npm run seed
```

This will create:
- Admin user (email: `admin@sportsbook.com`, password: `admin123`)
- Sample NFL report with picks
- Sample injuries with impact tracking
- Sample intelligence updates with credibility ratings
- Sample line movements
- Sample player props

### Complete Setup

To run both migrations and seeding in one command:

```bash
npm run db:setup
```

## Database Schema

### Core Tables

- **users** - Admin authentication
- **reports** - ML prediction reports by sport
- **picks** - Individual betting recommendations
- **player_props** - Player prop betting markets
- **injuries** - Player/fighter injury tracking
- **injury_pick_impact** - Junction table linking injuries to affected picks
- **intelligence_updates** - Real-time intelligence with credibility ratings
- **line_movements** - Betting line change tracking

### Indexes

Performance indexes are created on:
- `reports`: sport, status, generated_at
- `picks`: report_id, game_time, hierarchy, bet_type, outcome
- `player_props`: pick_id, player_id
- `injuries`: report_id, player_id, status, impact
- `intelligence_updates`: report_id, entity_id, credibility_rating, source_type
- `line_movements`: pick_id, timestamp

## Connection Utilities

### Basic Query

```typescript
import { query } from './db/connection';

const result = await query('SELECT * FROM reports WHERE sport = $1', ['NFL']);
```

### Transactions

```typescript
import { transaction } from './db/connection';

await transaction(async (client) => {
  await client.query('INSERT INTO reports ...');
  await client.query('INSERT INTO picks ...');
  // Both queries committed together or rolled back on error
});
```

### Get Client

```typescript
import { getClient } from './db/connection';

const client = await getClient();
try {
  await client.query('BEGIN');
  // ... multiple queries
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Adding New Migrations

1. Create a new `.sql` file in `migrations/` with a sequential number prefix:
   ```
   002_add_new_feature.sql
   ```

2. Write your SQL DDL statements

3. Run `npm run migrate` to apply the new migration

The migration system tracks which migrations have been executed and will only run new ones.
