import pool from '../src/db/connection';
import dotenv from 'dotenv';

dotenv.config();

const checkUfcPicks = async () => {
    try {
        // Get latest UFC report
        const reportRes = await pool.query(`
            SELECT id FROM reports 
            WHERE sport = 'UFC' AND status = 'published'
            ORDER BY generated_at DESC
            LIMIT 1
        `);

        if (reportRes.rows.length === 0) {
            console.log('No published UFC report found');
            return;
        }

        const reportId = reportRes.rows[0].id;
        console.log(`Checking picks for Report ID: ${reportId}`);

        const picksRes = await pool.query(`
            SELECT id, matchup, hierarchy, outcome 
            FROM picks 
            WHERE report_id = $1
        `, [reportId]);

        console.log(`Found ${picksRes.rows.length} picks:`);
        console.log(JSON.stringify(picksRes.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

checkUfcPicks();
