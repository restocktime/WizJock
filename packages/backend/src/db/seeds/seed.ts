import bcrypt from 'bcrypt';
import { query, transaction, closePool } from '../connection';

/**
 * Seed database with sample data for development and testing
 */
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    await transaction(async (client) => {
      // Create admin user
      console.log('Creating admin user...');
      const passwordHash = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO users (email, password_hash, role) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        ['admin@sportsbook.com', passwordHash, 'admin']
      );

      // Create sample NFL report
      console.log('Creating sample NFL report...');
      const reportResult = await client.query(
        `INSERT INTO reports (sport, status, generated_at, system_performance)
         VALUES ($1, $2, NOW(), $3)
         RETURNING id`,
        [
          'NFL',
          'draft',
          JSON.stringify({
            record: '47-21 ATS',
            winRate: 69.1,
          }),
        ]
      );
      const reportId = reportResult.rows[0].id;

      // Create sample picks
      console.log('Creating sample picks...');
      const pickResults = await client.query(
        `INSERT INTO picks (
          report_id, game_id, matchup, game_time, bet_type, recommendation,
          confidence_score, hierarchy, units, current_odds, opening_odds,
          expected_value, reasoning, detailed_analysis
        ) VALUES 
        ($1, 'nfl_2024_w10_kc_buf', 'Kansas City Chiefs @ Buffalo Bills', NOW() + INTERVAL '2 days', 'spread', 'Bills -3', 
         85.5, 'lock', 5, '-3 (-110)', '-2.5 (-110)', 12.5,
         'Bills defense has been dominant at home, holding opponents to 14 PPG.',
         'The Bills defense ranks 2nd in DVOA and has a significant home field advantage. Chiefs offensive line has struggled on the road with 3 key injuries. Weather forecast shows 20mph winds favoring the run game where Bills excel. Sharp money moved this line from -2.5 to -3.'),
        ($1, 'nfl_2024_w10_sf_dal', 'San Francisco 49ers @ Dallas Cowboys', NOW() + INTERVAL '3 days', 'overunder', 'Over 48.5',
         72.3, 'high', 3, 'O48.5 (-110)', 'O47.5 (-110)', 8.2,
         'Both offenses rank top 5 in scoring, and both defenses have injury concerns.',
         'SF averages 28.4 PPG while Dallas averages 26.1 PPG. Both teams missing key defensive players. Historical matchups average 52 points. Dome environment favors passing games.'),
        ($1, 'nfl_2024_w10_gb_det', 'Green Bay Packers @ Detroit Lions', NOW() + INTERVAL '4 days', 'moneyline', 'Lions ML',
         68.0, 'medium', 2, '-180', '-165', 5.5,
         'Lions undefeated at home this season with strong offensive performance.',
         'Detroit 6-0 at home with average margin of victory of 14 points. Packers struggling on road (2-4). Lions offense clicking with healthy receiving corps.')
        RETURNING id`,
        [reportId]
      );

      const pickIds = pickResults.rows.map((row) => row.id);

      // Create sample injuries
      console.log('Creating sample injuries...');
      const injuryResults = await client.query(
        `INSERT INTO injuries (
          report_id, player_id, player_name, team, status, injury_type, impact, details, reported_at
        ) VALUES
        ($1, 'nfl_player_mahomes', 'Patrick Mahomes', 'Kansas City Chiefs', 'questionable', 'ankle', 'moderate',
         'Mahomes dealing with high ankle sprain, limited in practice Wednesday and Thursday. Expected to play but mobility may be affected.',
         NOW() - INTERVAL '1 day'),
        ($1, 'nfl_player_parsons', 'Micah Parsons', 'Dallas Cowboys', 'out', 'shoulder', 'critical',
         'Parsons ruled out for Sunday game. Major loss for Cowboys pass rush.',
         NOW() - INTERVAL '2 hours'),
        ($1, 'nfl_player_bosa', 'Nick Bosa', 'San Francisco 49ers', 'probable', 'hip', 'minor',
         'Bosa full participant in practice. No injury designation for Sunday.',
         NOW() - INTERVAL '3 hours')
        RETURNING id`,
        [reportId]
      );

      const injuryIds = injuryResults.rows.map((row) => row.id);

      // Link injuries to picks
      console.log('Linking injuries to picks...');
      await client.query(
        `INSERT INTO injury_pick_impact (injury_id, pick_id) VALUES
         ($1, $2),
         ($3, $4)`,
        [injuryIds[0], pickIds[0], injuryIds[1], pickIds[1]]
      );

      // Create sample intelligence updates
      console.log('Creating sample intelligence updates...');
      await client.query(
        `INSERT INTO intelligence_updates (
          report_id, entity_id, entity_name, update_type, content, source, source_type, credibility_rating, is_new, reported_at
        ) VALUES
        ($1, 'nfl_player_mahomes', 'Patrick Mahomes', 'training', 
         'Mahomes participated in full practice Friday, showing improved mobility. Team confident he will play.',
         'Kansas City Chiefs Official', 'official', 95.0, true, NOW() - INTERVAL '2 hours'),
        ($1, 'nfl_player_allen', 'Josh Allen', 'personal',
         'Allen studying film extensively this week, focused on exploiting Chiefs secondary weaknesses.',
         '@AdamSchefter', 'verified-social', 85.0, true, NOW() - INTERVAL '5 hours'),
        ($1, 'nfl_team_cowboys', 'Dallas Cowboys', 'lineup',
         'Cowboys expected to start backup linebacker in place of Parsons. Significant defensive scheme changes anticipated.',
         'ESPN Dallas', 'media', 80.0, false, NOW() - INTERVAL '1 day'),
        ($1, 'nfl_player_mccaffrey', 'Christian McCaffrey', 'training',
         'CMC looking explosive in practice, 49ers planning to feature him heavily in game plan.',
         'NFL Insider Source', 'insider', 75.0, true, NOW() - INTERVAL '8 hours')`,
        [reportId]
      );

      // Create sample line movements
      console.log('Creating sample line movements...');
      await client.query(
        `INSERT INTO line_movements (
          pick_id, opening_line, current_line, movement_percentage, direction, sharp_money, notes, timestamp
        ) VALUES
        ($1, '-2.5', '-3', 20.0, 'toward', true, 
         'Sharp money hitting Bills hard. Multiple large bets from known sharp bettors moved the line.',
         NOW() - INTERVAL '6 hours'),
        ($2, 'O47.5', 'O48.5', 2.1, 'away', false,
         'Public money pushing total up slightly. Weather looks clear.',
         NOW() - INTERVAL '4 hours'),
        ($3, '-165', '-180', 9.1, 'toward', true,
         'Professional bettors loading up on Lions ML. Line moving despite balanced ticket count.',
         NOW() - INTERVAL '3 hours')`,
        [pickIds[0], pickIds[1], pickIds[2]]
      );

      // Create sample player props
      console.log('Creating sample player props...');
      await client.query(
        `INSERT INTO player_props (
          pick_id, player_id, player_name, stat_type, line, over_under, odds, confidence, reasoning
        ) VALUES
        ($1, 'nfl_player_allen', 'Josh Allen', 'passing yards', 275.5, 'over', '-110', 78.5,
         'Allen averages 285 passing yards at home. Chiefs secondary ranks 28th against the pass.'),
        ($1, 'nfl_player_diggs', 'Stefon Diggs', 'receptions', 6.5, 'over', '-115', 72.0,
         'Diggs targeted heavily in division games. Chiefs struggle covering slot receivers.'),
        ($2, 'nfl_player_prescott', 'Dak Prescott', 'passing touchdowns', 2.5, 'over', '+105', 68.5,
         'Prescott averages 2.8 TDs at home. 49ers missing starting cornerback.')`,
        [pickIds[0], pickIds[1]]
      );

      console.log('Sample data created successfully');
    });

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
