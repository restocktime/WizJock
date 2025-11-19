import pool from '../src/db/connection';
import dotenv from 'dotenv';

dotenv.config();

const checkUfcReport = async () => {
    try {
        const res = await pool.query(`
            SELECT id, sport, status, generated_at, published_at 
            FROM reports 
            WHERE sport = 'UFC'
            ORDER BY generated_at DESC
        `);
        console.log('UFC Reports:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

checkUfcReport();
