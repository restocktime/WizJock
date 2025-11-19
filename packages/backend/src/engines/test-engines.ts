/**
 * Test script to verify prediction engine integration
 * Run with: tsx src/engines/test-engines.ts
 */

import { EngineFactory } from './EngineFactory';
import { Sport } from '@sportsbook/shared-types';

async function testEngines() {
  console.log('🧪 Testing Prediction Engine Integration\n');

  const sports: Sport[] = ['NFL', 'NCAA', 'NBA', 'UFC'];

  for (const sport of sports) {
    console.log(`\n📊 Testing ${sport} Engine:`);
    console.log('─'.repeat(50));

    try {
      // Get engine
      const engine = EngineFactory.getEngine(sport);
      console.log(`✓ Engine instance created for ${sport}`);

      // Health check
      const health = await engine.healthCheck();
      console.log(
        `✓ Health check: ${health.healthy ? '✅ Healthy' : '❌ Unhealthy'}`
      );

      if (!health.healthy && health.error) {
        console.log(`  Error: ${health.error}`);
      }

      // Generate picks
      console.log(`⏳ Generating picks...`);
      const output = await engine.generatePicks();

      console.log(`✓ Generated ${output.picks.length} picks`);
      console.log(
        `✓ Generated ${output.injuries?.length || 0} injury updates`
      );
      console.log(
        `✓ Generated ${output.intelligenceUpdates?.length || 0} intelligence updates`
      );
      console.log(
        `✓ Generated ${output.lineMovements?.length || 0} line movements`
      );

      if (output.systemPerformance) {
        console.log(
          `✓ System performance: ${output.systemPerformance.record} (${output.systemPerformance.winRate}%)`
        );
      }

      // Show first pick details
      if (output.picks.length > 0) {
        const pick = output.picks[0];
        console.log(`\n📋 Sample Pick:`);
        console.log(`   Matchup: ${pick.matchup}`);
        console.log(`   Recommendation: ${pick.recommendation}`);
        console.log(`   Confidence: ${pick.confidenceScore}%`);
        console.log(`   Hierarchy: ${pick.hierarchy}`);
        console.log(`   Units: ${pick.units}`);
        if (pick.riskScore) {
          console.log(`   Risk Score: ${pick.riskScore}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error testing ${sport} engine:`, error);
    }
  }

  console.log('\n\n🏁 All engine tests completed!\n');
}

// Run tests
testEngines().catch(console.error);
