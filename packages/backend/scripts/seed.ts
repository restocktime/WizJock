import pool from '../src/db/connection';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    try {
        console.log('Starting seed process...');

        // Clear existing data
        await pool.query('DELETE FROM line_movements');
        await pool.query('DELETE FROM player_props');
        await pool.query('DELETE FROM injury_pick_impact');
        await pool.query('DELETE FROM injuries');
        await pool.query('DELETE FROM intelligence_updates');
        await pool.query('DELETE FROM picks');
        await pool.query('DELETE FROM reports');
        await pool.query('DELETE FROM users');
        console.log('Cleared existing data');

        // Create Admin User
        const hashedPassword = await bcrypt.hash('IBY94$', 10);
        await pool.query(
            `INSERT INTO users (email, password_hash, role, created_at)
             VALUES ($1, $2, $3, NOW())`,
            ['admin@wizjock.com', hashedPassword, 'admin']
        );
        console.log('Created admin user: admin / admin123');

        // Create Sample NFL Report (Published)
        const nflReportResult = await pool.query(
            `INSERT INTO reports (sport, status, generated_at, published_at, published_by)
             VALUES ($1, $2, NOW(), NOW(), $3)
             RETURNING id`,
            ['NFL', 'published', 'admin@example.com']
        );
        const nflReportId = nflReportResult.rows[0].id;

        // Create Picks for NFL Report
        await pool.query(
            `INSERT INTO picks (
                report_id, game_id, matchup, game_time, bet_type, recommendation,
                confidence_score, risk_score, hierarchy, units, current_odds,
                reasoning, detailed_analysis
            ) VALUES 
            ($1, 'GAME001', 'Chiefs vs. Bills', NOW() + INTERVAL '1 day', 'spread', 'Chiefs -2.5', 
             85, 2, 'lock', 2, '-110', 'Chiefs have a strong offense.', 'Detailed analysis here...'),
            ($1, 'GAME002', 'Eagles vs. Cowboys', NOW() + INTERVAL '2 days', 'total', 'Over 48.5', 
             75, 4, 'featured', 1, '-110', 'High scoring potential.', 'Detailed analysis here...')`,
            [nflReportId]
        );
        console.log('Created published NFL report with picks');

        // Create Sample NBA Report (Draft)
        const nbaReportResult = await pool.query(
            `INSERT INTO reports (sport, status, generated_at)
             VALUES ($1, $2, NOW())
             RETURNING id`,
            ['NBA', 'draft']
        );
        const nbaReportId = nbaReportResult.rows[0].id;

        // Create Picks for NBA Report
        await pool.query(
            `INSERT INTO picks (
                report_id, game_id, matchup, game_time, bet_type, recommendation,
                confidence_score, risk_score, hierarchy, units, current_odds,
                reasoning, detailed_analysis
            ) VALUES 
            ($1, 'GAME003', 'Lakers vs. Warriors', NOW() + INTERVAL '12 hours', 'spread', 'Warriors -5', 
             70, 5, 'high', 1, '-110', 'Warriors at home.', 'Detailed analysis here...')`,
            [nbaReportId]
        );
        console.log('Created draft NBA report with picks');

        console.log('Seed process completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

seed();
