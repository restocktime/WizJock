
import { Client } from 'pg';

const DATABASE_URL = 'postgresql://postgres:xbDBxEqkjLBmsbSgfFqckFejrLgiPCZB@centerbeam.proxy.rlwy.net:45684/railway';

async function migrateUnitsToDecimal() {
    console.log('Connecting to remote database...');
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();
        console.log('Connected successfully.');
        console.log('Migrating units column to DECIMAL...');

        // 1. Drop the check constraint
        // We need to find the name of the constraint first, but usually it's picks_units_check
        // Or we can just try to drop it if we know the name or use a do block

        // Let's try to find and drop the constraint dynamically or just alter the column type which might require dropping the constraint first

        // First, let's try to identify the constraint name
        const constraintResult = await client.query(`
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'picks'::regclass
            AND conname LIKE '%units%'
        `);

        if (constraintResult.rows.length > 0) {
            const constraintName = constraintResult.rows[0].conname;
            console.log(`Found constraint: ${constraintName}. Dropping it...`);
            await client.query(`ALTER TABLE picks DROP CONSTRAINT ${constraintName}`);
        } else {
            console.log('No specific check constraint found for units (or already dropped).');
        }

        // 2. Alter the column type
        console.log('Altering column type to DECIMAL(4,2)...');
        await client.query(`ALTER TABLE picks ALTER COLUMN units TYPE DECIMAL(4,2)`);

        console.log('Migration completed successfully! 🚀');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await client.end();
    }
}

migrateUnitsToDecimal();
