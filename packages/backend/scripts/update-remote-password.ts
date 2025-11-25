
import { Client } from 'pg';

const DATABASE_URL = 'postgresql://postgres:xbDBxEqkjLBmsbSgfFqckFejrLgiPCZB@centerbeam.proxy.rlwy.net:45684/railway';
const NEW_HASH = '$2b$10$yqph328Um.jx/btYlVgXUuLTwroUsxQ0oot4NWhlUsPonocuJsxGO'; // Hash for 'IBY94$'

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

        console.log('Updating admin password...');
        const result = await client.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
            [NEW_HASH, 'admin@wizjock.com']
        );

        if (result.rowCount === 0) {
            console.log('User not found. Inserting admin user...');
            await client.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
                ['admin@wizjock.com', NEW_HASH, 'admin']
            );
            console.log('Admin user inserted.');
        } else {
            console.log('Admin password updated successfully.');
        }

    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        await client.end();
    }
}

main();
