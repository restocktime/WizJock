
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = 'postgresql://postgres:xbDBxEqkjLBmsbSgfFqckFejrLgiPCZB@centerbeam.proxy.rlwy.net:45684/railway';

async function main() {
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

        const sqlPath = '/Users/isaac/.gemini/antigravity/brain/87921ddc-9960-4437-81e5-04b16ea6af7f/RAILWAY_DB_INIT.sql';
        console.log(`Reading SQL from ${sqlPath}...`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);
        console.log('Database initialized successfully! 🚀');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await client.end();
    }
}

main();
