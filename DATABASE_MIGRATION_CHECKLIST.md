# Database Migration Checklist

This checklist ensures safe and successful database migration to production.

## Pre-Migration Checklist

### 1. Backup Preparation

- [ ] **Create full database backup**
  ```bash
  # If using PostgreSQL
  pg_dump -h production-host -U username -d database_name -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
  ```

- [ ] **Verify backup is valid**
  ```bash
  # Test restore to a temporary database
  pg_restore -h localhost -U username -d test_restore backup_file.dump
  ```

- [ ] **Store backup in secure location**
  - Upload to S3, Google Cloud Storage, or similar
  - Keep backup for at least 30 days

### 2. Database Access Verification

- [ ] **Verify database credentials**
  ```bash
  psql $DATABASE_URL -c "SELECT version();"
  ```

- [ ] **Check database connection from application server**
  ```bash
  cd packages/backend
  node -e "require('./src/db/connection').query('SELECT 1').then(() => console.log('✓ Connected')).catch(e => console.error('✗ Failed:', e.message))"
  ```

- [ ] **Verify network access** (no firewall blocking)

- [ ] **Check database user permissions**
  ```sql
  -- Connect to database
  psql $DATABASE_URL
  
  -- Check permissions
  SELECT * FROM information_schema.role_table_grants 
  WHERE grantee = current_user;
  
  -- Ensure user can CREATE TABLE, CREATE INDEX, INSERT, UPDATE, DELETE
  ```

### 3. Migration Files Review

- [ ] **Review all migration files**
  - `001_create_tables.sql` - Core tables
  - `002_change_units_to_decimal.sql` - Schema change
  - `003_create_applications_table.sql` - New applications table

- [ ] **Verify SQL syntax**
  ```bash
  # Test migrations on local database first
  cd packages/backend
  npm run migrate
  ```

- [ ] **Check for breaking changes**
  - No columns being dropped that are still in use
  - No data loss from type changes
  - Indexes won't cause performance issues

### 4. Downtime Planning

- [ ] **Estimate migration duration**
  - Small migrations (< 1000 rows): < 1 minute
  - Medium migrations (< 100k rows): 1-5 minutes
  - Large migrations (> 100k rows): 5+ minutes

- [ ] **Schedule maintenance window** (if needed)
  - Notify users in advance
  - Choose low-traffic time (e.g., 2 AM local time)
  - Prepare maintenance page

- [ ] **Prepare rollback plan**
  - Document rollback steps
  - Keep backup accessible
  - Test rollback procedure

---

## Migration Execution

### Option A: Run from Local Machine

**Use this if:** You have direct database access from your local machine

#### Step 1: Set Production Database URL

```bash
cd packages/backend

# Set DATABASE_URL temporarily (don't save to .env file)
export DATABASE_URL="postgresql://username:password@production-host:5432/database_name"

# Verify connection
psql $DATABASE_URL -c "SELECT current_database();"
```

#### Step 2: Run Migrations

```bash
# Run migration script
npm run migrate
```

**Expected output:**
```
Starting database migrations...
Found 3 migration file(s)
Executing 001_create_tables.sql...
✓ 001_create_tables.sql executed successfully
Executing 002_change_units_to_decimal.sql...
✓ 002_change_units_to_decimal.sql executed successfully
Executing 003_create_applications_table.sql...
✓ 003_create_applications_table.sql executed successfully
All migrations completed successfully
Migration process completed
```

#### Step 3: Verify Migration

```bash
# Connect to database
psql $DATABASE_URL

# Check migrations table
SELECT * FROM migrations ORDER BY executed_at;

# Expected output:
#  id |              name               |       executed_at
# ----+---------------------------------+------------------------
#   1 | 001_create_tables.sql           | 2025-11-19 10:00:00
#   2 | 002_change_units_to_decimal.sql | 2025-11-19 10:00:01
#   3 | 003_create_applications_table.sql| 2025-11-19 10:00:02

# Verify all tables exist
\dt

# Expected tables:
# - migrations
# - users
# - sports
# - picks
# - reports
# - applications

# Verify applications table structure
\d applications

# Expected columns:
# - id (uuid)
# - full_name (varchar)
# - email (varchar, unique)
# - phone (varchar)
# - betting_experience (varchar)
# - sms_consent (boolean)
# - status (varchar)
# - notes (text)
# - created_at (timestamp)
# - updated_at (timestamp)

# Verify indexes
\di

# Expected indexes on applications:
# - applications_pkey (PRIMARY KEY on id)
# - idx_applications_email
# - idx_applications_status
# - idx_applications_created_at

# Exit psql
\q
```

---

### Option B: Run on Production Server

**Use this if:** You need to run migrations directly on the production server

#### Step 1: SSH into Production Server

```bash
ssh user@production-server
```

#### Step 2: Navigate to Application Directory

```bash
cd /path/to/app/packages/backend
```

#### Step 3: Verify Environment Variables

```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# If not set, load from .env
source .env
```

#### Step 4: Run Migrations

```bash
npm run migrate
```

#### Step 5: Verify Migration

```bash
# Connect to database
psql $DATABASE_URL

# Run verification queries (same as Option A Step 3)
SELECT * FROM migrations ORDER BY executed_at;
\dt
\d applications
\di
\q
```

---

### Option C: Run via CI/CD Pipeline

**Use this if:** You have automated deployment pipeline

#### Step 1: Add Migration Step to CI/CD

**GitHub Actions example:**

```yaml
# .github/workflows/deploy.yml
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    cd packages/backend
    npm run migrate
```

**GitLab CI example:**

```yaml
# .gitlab-ci.yml
migrate:
  stage: deploy
  script:
    - cd packages/backend
    - npm run migrate
  only:
    - main
```

#### Step 2: Trigger Deployment

```bash
git push origin main
```

#### Step 3: Monitor Pipeline

- Watch CI/CD logs for migration output
- Verify migration completed successfully
- Check for any errors

#### Step 4: Verify Migration

```bash
# Connect to production database
psql $DATABASE_URL

# Run verification queries
SELECT * FROM migrations ORDER BY executed_at;
\dt
\d applications
\q
```

---

## Post-Migration Verification

### 1. Table Structure Verification

```sql
-- Connect to database
psql $DATABASE_URL

-- Verify applications table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'applications'
ORDER BY ordinal_position;

-- Expected output:
-- column_name        | data_type | is_nullable | column_default
-- -------------------+-----------+-------------+------------------
-- id                 | uuid      | NO          | gen_random_uuid()
-- full_name          | varchar   | NO          | NULL
-- email              | varchar   | NO          | NULL
-- phone              | varchar   | NO          | NULL
-- betting_experience | varchar   | NO          | NULL
-- sms_consent        | boolean   | NO          | false
-- status             | varchar   | NO          | 'pending'
-- notes              | text      | YES         | NULL
-- created_at         | timestamp | NO          | now()
-- updated_at         | timestamp | NO          | now()
```

### 2. Constraints Verification

```sql
-- Check constraints
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'applications';

-- Expected constraints:
-- - PRIMARY KEY on id
-- - UNIQUE on email
-- - CHECK on betting_experience (enum values)
-- - CHECK on status (enum values)
```

### 3. Indexes Verification

```sql
-- Check indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'applications';

-- Expected indexes:
-- - applications_pkey (PRIMARY KEY)
-- - idx_applications_email
-- - idx_applications_status
-- - idx_applications_created_at
```

### 4. Permissions Verification

```sql
-- Check table permissions
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'applications';

-- Ensure application user has:
-- - SELECT
-- - INSERT
-- - UPDATE
-- - DELETE (if needed)
```

### 5. Application Connection Test

```bash
# Test database connection from application
cd packages/backend

# Start application in test mode
NODE_ENV=production npm start

# In another terminal, test API endpoint
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "bettingExperience": "intermediate",
    "smsConsent": true
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Application received successfully",
#   "applicationId": "uuid-here"
# }

# Verify record in database
psql $DATABASE_URL -c "SELECT * FROM applications WHERE email = 'test@example.com';"

# Clean up test data
psql $DATABASE_URL -c "DELETE FROM applications WHERE email = 'test@example.com';"
```

---

## Rollback Procedure

**If migration fails or causes issues:**

### Step 1: Stop Application

```bash
# Stop application to prevent further database writes
# Method depends on your hosting platform:

# Heroku
heroku ps:scale web=0 --app your-app

# Railway
railway down

# Docker
docker-compose down

# PM2
pm2 stop all
```

### Step 2: Restore from Backup

```bash
# Drop current database (CAREFUL!)
dropdb -h production-host -U username database_name

# Create new database
createdb -h production-host -U username database_name

# Restore from backup
pg_restore -h production-host -U username -d database_name backup_file.dump

# Verify restore
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### Step 3: Restart Application

```bash
# Restart application with old code (before migration)
# Method depends on your hosting platform

# Heroku
heroku ps:scale web=1 --app your-app

# Railway
railway up

# Docker
docker-compose up -d

# PM2
pm2 start all
```

### Step 4: Investigate Issue

```bash
# Check migration logs
cat migration_error.log

# Check application logs
# (method depends on hosting platform)

# Identify root cause
# - SQL syntax error?
# - Permission issue?
# - Data type mismatch?
# - Constraint violation?
```

### Step 5: Fix and Retry

```bash
# Fix migration file
vim packages/backend/src/db/migrations/003_create_applications_table.sql

# Test on local database
npm run migrate

# If successful, retry on production
# (follow migration execution steps again)
```

---

## Troubleshooting

### Issue: "relation already exists"

**Cause:** Migration was partially executed

**Solution:**
```sql
-- Check which tables exist
\dt

-- If applications table exists, drop it
DROP TABLE IF EXISTS applications CASCADE;

-- Re-run migration
npm run migrate
```

### Issue: "permission denied"

**Cause:** Database user lacks necessary permissions

**Solution:**
```sql
-- Grant permissions (run as database admin)
GRANT CREATE ON DATABASE database_name TO username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO username;
```

### Issue: "could not connect to server"

**Cause:** Network/firewall blocking connection

**Solution:**
1. Check database is running
2. Verify DATABASE_URL is correct
3. Check firewall rules (whitelist your IP)
4. Verify SSL settings if required

### Issue: Migration hangs/times out

**Cause:** Large table, slow query, or lock contention

**Solution:**
1. Check for long-running queries:
   ```sql
   SELECT pid, now() - query_start as duration, query
   FROM pg_stat_activity
   WHERE state = 'active'
   ORDER BY duration DESC;
   ```

2. Kill blocking queries if safe:
   ```sql
   SELECT pg_terminate_backend(pid);
   ```

3. Retry migration during low-traffic period

---

## Final Checklist

- [ ] Database backup created and verified
- [ ] Migrations executed successfully
- [ ] All tables created (users, sports, picks, reports, applications)
- [ ] All indexes created
- [ ] All constraints applied
- [ ] Migrations table updated
- [ ] Table structure verified
- [ ] Application can connect to database
- [ ] Test record inserted and retrieved successfully
- [ ] No errors in application logs
- [ ] Rollback procedure documented and tested
- [ ] Team notified of successful migration

---

## Next Steps

After successful migration:

1. ✅ Mark this task as complete
2. ✅ Proceed with email service configuration
3. ✅ Continue with remaining deployment preparation steps
4. ✅ Document any issues encountered for future reference

---

## Support Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Migration Best Practices:** https://www.postgresql.org/docs/current/ddl-alter.html
- **Backup and Restore:** https://www.postgresql.org/docs/current/backup.html
- **Troubleshooting:** https://wiki.postgresql.org/wiki/Troubleshooting

---

**Remember:** Always test migrations on a staging environment before running on production!
