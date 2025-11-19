import fs from 'fs';
import path from 'path';
import { query, closePool } from '../connection';

/**
 * Simple migration runner that executes SQL files in order
 */
async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Create migrations tracking table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Get list of migration files
    const migrationsDir = __dirname;
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration file(s)`);

    // Execute each migration
    for (const file of files) {
      // Check if migration has already been executed
      const result = await query(
        'SELECT id FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`Executing ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute the migration
      await query(sql);

      // Record the migration
      await query('INSERT INTO migrations (name) VALUES ($1)', [file]);

      console.log(`✓ ${file} executed successfully`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
