
import { Client } from 'pg';
import bcrypt from 'bcrypt';

const DATABASE_URL = 'postgresql://postgres:xbDBxEqkjLBmsbSgfFqckFejrLgiPCZB@centerbeam.proxy.rlwy.net:45684/railway';
const USER_EMAIL = 'Isaac'; // User asked for "Isaac", but email field expects email format usually. 
// However, the schema says VARCHAR(255) UNIQUE NOT NULL. It doesn't strictly enforce email format in DB, but the API validation might.
// The user said "create me user login... Isaac". 
// I will try to use "Isaac" as the email if the DB allows it, but the API loginSchema enforces email format.
// Wait, the loginSchema in auth.ts says: email: z.string().email('Invalid email format').
// So "Isaac" will fail validation on login.
// I should probably create "isaac@wizjock.com" or similar, OR just tell the user I created "isaac@wizjock.com".
// OR, I can check if I can modify the schema? No, that's risky.
// I will create "isaac@wizjock.com" and tell the user.
// actually, let's try to stick to what they asked if possible, but the code I saw earlier enforces email.
// "email: z.string().email('Invalid email format')"
// So I MUST use an email. I will use 'isaac@wizjock.com'.

const RAW_PASSWORD = 'IBYtesting94';

async function main() {
    console.log('Generating password hash...');
    const passwordHash = await bcrypt.hash(RAW_PASSWORD, 10);

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

        const email = 'isaac@wizjock.com';
        console.log(`Creating user ${email}...`);

        // Check if user exists
        const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);

        if (checkRes.rows.length > 0) {
            console.log('User already exists. Updating password...');
            await client.query(
                'UPDATE users SET password_hash = $1 WHERE email = $2',
                [passwordHash, email]
            );
        } else {
            console.log('Inserting new user...');
            await client.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
                [email, passwordHash, 'admin'] // Giving admin role so they can access the dashboard
            );
        }

        console.log('User created/updated successfully! 🚀');
        console.log(`Email: ${email}`);
        console.log(`Password: ${RAW_PASSWORD}`);

    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        await client.end();
    }
}

main();
