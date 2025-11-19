import pool from '../src/db/connection';
import dotenv from 'dotenv';
import { invalidatePicksCache } from '../src/cache/cacheService';
import { connectRedis, disconnectRedis } from '../src/cache/redis';

dotenv.config();

const seedUfcDemo = async () => {
    try {
        await connectRedis();
        console.log('Seeding UFC 322 Demo Report...');

        // 0. Unpublish existing UFC reports to avoid duplicates
        await pool.query(
            `UPDATE reports SET status = 'unpublished' WHERE sport = 'UFC' AND status = 'published'`
        );

        // 1. Create the Report
        const reportResult = await pool.query(
            `INSERT INTO reports (
                sport, status, generated_at, published_at, published_by, 
                system_performance
            ) VALUES ($1, $2, NOW() - INTERVAL '1 hour', NOW(), $3, $4)
            RETURNING id`,
            [
                'UFC',
                'published',
                'admin@example.com',
                JSON.stringify({
                    totalPicks: 25,
                    totalUnits: 43.5,
                    winningBets: 18,
                    losingBets: 7,
                    winRate: 72.0,
                    netProfit: 24.8,
                    roi: 57.0,
                    summary: "Outstanding performance. All 3 critical alerts were accurate. Max bets paid off."
                })
            ]
        );
        const reportId = reportResult.rows[0].id;
        console.log(`Created Report ID: ${reportId}`);

        // 2. Insert Picks
        const picks = [
            // Main Card
            {
                game_id: 'ufc-322-makhachev-maddalena',
                matchup: 'Islam Makhachev vs. Jack Della Maddalena',
                game_time: "2025-11-15T22:00:00Z",
                bet_type: 'moneyline',
                recommendation: 'Della Maddalena ML',
                confidence_score: 78,
                hierarchy: 'high',
                units: 4,
                current_odds: '-140',
                reasoning: 'Weight cut intel was SPOT ON. Makhachev looked drained.',
                detailed_analysis: 'Makhachev gassed in Round 2, finished in Round 3. Our 78/100 risk score was accurate.',
                outcome: 'win'
            },
            {
                game_id: 'ufc-322-makhachev-maddalena-prop',
                matchup: 'Islam Makhachev vs. Jack Della Maddalena',
                game_time: "2025-11-15T22:00:00Z",
                bet_type: 'prop',
                recommendation: 'Della Maddalena by KO/TKO',
                confidence_score: 65,
                hierarchy: 'medium',
                units: 1.5,
                current_odds: '+180',
                reasoning: 'Power advantage showed exactly as predicted.',
                outcome: 'win'
            },
            {
                game_id: 'ufc-322-shevchenko-zhang',
                matchup: 'Valentina Shevchenko vs. Zhang Weili',
                game_time: "2025-11-15T21:30:00Z",
                bet_type: 'total',
                recommendation: 'Over 4.5 Rounds',
                confidence_score: 70,
                hierarchy: 'medium',
                units: 2,
                current_odds: '+110',
                reasoning: 'Technical fight went exactly as predicted. Both elite strikers.',
                outcome: 'win'
            },
            {
                game_id: 'ufc-322-shevchenko-zhang-ml',
                matchup: 'Valentina Shevchenko vs. Zhang Weili',
                game_time: "2025-11-15T21:30:00Z",
                bet_type: 'moneyline',
                recommendation: 'Zhang ML',
                confidence_score: 60,
                hierarchy: 'value',
                units: 1,
                current_odds: '+115',
                reasoning: 'Close fight, split decision loss.',
                outcome: 'loss'
            },
            {
                game_id: 'ufc-322-brady-morales',
                matchup: 'Sean Brady vs. Michael Morales',
                game_time: "2025-11-15T21:00:00Z",
                bet_type: 'prop',
                recommendation: 'Brady by Submission',
                confidence_score: 82, // "18/100 risk score" -> ~82 confidence
                hierarchy: 'high',
                units: 3,
                current_odds: '+190',
                reasoning: 'PERFECT CALL. Training intel was accurate. Brady grappling dominated.',
                outcome: 'win'
            },
            // Featured
            {
                game_id: 'ufc-322-nickal-vieira',
                matchup: 'Bo Nickal vs. Rodolfo Vieira',
                game_time: "2025-11-15T20:30:00Z",
                bet_type: 'moneyline',
                recommendation: 'Nickal ML',
                confidence_score: 85,
                hierarchy: 'featured',
                units: 2,
                current_odds: '-320',
                reasoning: 'Nickal dominated but couldn\'t finish BJJ black belt.',
                outcome: 'win'
            },
            {
                game_id: 'ufc-322-blanchfield-cortez',
                matchup: 'Erin Blanchfield vs. Tracy Cortez',
                game_time: "2025-11-15T20:00:00Z",
                bet_type: 'prop',
                recommendation: 'Blanchfield by Submission',
                confidence_score: 85,
                hierarchy: 'high',
                units: 4,
                current_odds: '+140',
                reasoning: 'RIB INJURY INTEL WAS GOLD. Cortez couldn\'t defend grappling.',
                outcome: 'win'
            },
            // Prelims - Max Bet
            {
                game_id: 'ufc-322-sabatini-mariscal',
                matchup: 'Pat Sabatini vs. Chepe Mariscal',
                game_time: "2025-11-15T19:00:00Z",
                bet_type: 'moneyline',
                recommendation: 'Sabatini ML',
                confidence_score: 95,
                hierarchy: 'lock',
                units: 6,
                current_odds: '-210',
                reasoning: 'ILLNESS INTEL WAS PERFECT. Mariscal looked terrible, gassed immediately.',
                outcome: 'win'
            }
        ];

        for (const pick of picks) {
            const pickResult = await pool.query(
                `INSERT INTO picks (
                    report_id, game_id, matchup, game_time, bet_type, recommendation,
                    confidence_score, hierarchy, units, current_odds,
                    reasoning, detailed_analysis, outcome
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id`,
                [
                    reportId,
                    pick.game_id,
                    pick.matchup,
                    pick.game_time,
                    pick.bet_type,
                    pick.recommendation,
                    pick.confidence_score,
                    pick.hierarchy,
                    pick.units,
                    pick.current_odds,
                    pick.reasoning,
                    pick.detailed_analysis || pick.reasoning,
                    pick.outcome
                ]
            );

            // Link injuries if applicable
            if (pick.matchup.includes('Cortez')) {
                await pool.query(
                    `INSERT INTO injuries (
                        report_id, player_id, player_name, status, injury_type, impact, details, reported_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '3 days')`,
                    [reportId, 'ufc-player-cortez', 'Tracy Cortez', 'questionable', 'Rib Injury', 'critical', 'Reports of rib injury during camp. Validated by submission loss.']
                );
            }

            if (pick.matchup.includes('Mariscal')) {
                await pool.query(
                    `INSERT INTO injuries (
                        report_id, player_id, player_name, status, injury_type, impact, details, reported_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '2 days')`,
                    [reportId, 'ufc-player-mariscal', 'Chepe Mariscal', 'out', 'Illness', 'critical', 'Severe illness reported before fight. Confirmed by performance.']
                );
            }
        }

        // Invalidate cache to ensure client sees new data
        await invalidatePicksCache('UFC');
        console.log('Cache invalidated for UFC');

        console.log('UFC 322 Demo Report Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding UFC demo:', error);
        process.exit(1);
    } finally {
        await pool.end();
        await disconnectRedis();
    }
};

seedUfcDemo();
