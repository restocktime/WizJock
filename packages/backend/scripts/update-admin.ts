import pool from '../src/db/connection';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const updateAdmin = async () => {
    try {
        console.log('Updating admin user...');

        const email = 'admin@wizjock.com';
        const password = 'IBY94$';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);

        if (result.rows.length > 0) {
            // Update existing admin
            await pool.query(
                'UPDATE users SET email = $1, password_hash = $2 WHERE role = $3',
                [email, hashedPassword, 'admin']
            );
            console.log(`Updated existing admin to ${email}`);
        } else {
            // Create new admin
            await pool.query(
                `INSERT INTO users (email, password_hash, role, created_at)
                 VALUES ($1, $2, $3, NOW())`,
                [email, hashedPassword, 'admin']
            );
            console.log(`Created new admin: ${email}`);
        }

        console.log('Admin user updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating admin:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

updateAdmin();
