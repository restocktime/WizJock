import { Sport, Report, Pick } from '@sportsbook/shared-types';
import { EngineFactory, EngineOutput, EngineError } from '../engines';
import { query, transaction } from '../db/connection';

/**
 * Service for generating and saving prediction reports
 */
export class ReportGenerationService {
  /**
   * Generate a complete report for a sport
   * @param sport The sport to generate report for
   * @returns The generated report with all data
   */
  static async generateReport(sport: Sport): Promise<Report> {
    try {
      // Get the appropriate prediction engine
      const engine = EngineFactory.getEngine(sport);

      // Generate picks and associated data from the engine
      const engineOutput = await engine.generatePicks();

      // Save the report to database within a transaction
      const report = await this.saveReport(sport, engineOutput);

      return report;
    } catch (error) {
      if (error instanceof EngineError) {
        throw error;
      }
      throw new Error(
        `Failed to generate report for ${sport}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Save a report and all associated data to the database
   */
  private static async saveReport(
    sport: Sport,
    engineOutput: EngineOutput
  ): Promise<Report> {
    return await transaction(async (client) => {
      // 1. Create the report
      const reportResult = await client.query(
        `INSERT INTO reports (sport, status, system_performance, generated_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, sport, status, generated_at, system_performance`,
        [
          sport,
          'draft',
          engineOutput.systemPerformance
            ? JSON.stringify(engineOutput.systemPerformance)
            : null,
        ]
      );

      const reportRow = reportResult.rows[0];
      const reportId = reportRow.id;

      // 2. Save picks and collect their IDs
      const picks: Pick[] = [];
      const pickIdMap = new Map<number, string>(); // Map original index to DB ID

      for (let i = 0; i < engineOutput.picks.length; i++) {
        const pick = engineOutput.picks[i];
        
        // Calculate expected value if not provided
        const expectedValue = pick.expectedValue ?? this.calculateExpectedValue(
          pick.confidenceScore,
          pick.currentOdds
        );

        const pickResult = await client.query(
          `INSERT INTO picks (
            report_id, game_id, matchup, game_time, bet_type, recommendation,
            confidence_score, risk_score, hierarchy, units, current_odds,
            opening_odds, expected_value, reasoning, detailed_analysis
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id, report_id, game_id, matchup, game_time, bet_type, recommendation,
                    confidence_score, risk_score, hierarchy, units, current_odds,
                    opening_odds, expected_value, reasoning, detailed_analysis, outcome`,
          [
            reportId,
            pick.gameId,
            pick.matchup,
            pick.gameTime,
            pick.betType,
            pick.recommendation,
            pick.confidenceScore,
            pick.riskScore ?? null,
            pick.hierarchy,
            pick.units,
            pick.currentOdds,
            pick.openingOdds ?? null,
            expectedValue,
            pick.reasoning,
            pick.detailedAnalysis,
          ]
        );

        const savedPick = this.rowToPick(pickResult.rows[0]);
        picks.push(savedPick);
        pickIdMap.set(i, savedPick.id);

        // Save player props if any
        if (pick.playerProps && pick.playerProps.length > 0) {
          for (const prop of pick.playerProps) {
            await client.query(
              `INSERT INTO player_props (
                pick_id, player_id, player_name, stat_type, line,
                over_under, odds, confidence, reasoning
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                savedPick.id,
                prop.playerId,
                prop.playerName,
                prop.statType,
                prop.line,
                prop.overUnder,
                prop.odds,
                prop.confidence,
                prop.reasoning,
              ]
            );
          }
        }
      }

      // 3. Save injuries and track affected picks
      const injuries = [];
      if (engineOutput.injuries && engineOutput.injuries.length > 0) {
        for (const injury of engineOutput.injuries) {
          const injuryResult = await client.query(
            `INSERT INTO injuries (
              report_id, player_id, player_name, team, status,
              injury_type, impact, details, reported_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, report_id, player_id, player_name, team, status,
                      injury_type, impact, details, reported_at`,
            [
              reportId,
              injury.playerId,
              injury.playerName,
              injury.team ?? null,
              injury.status,
              injury.injuryType,
              injury.impact,
              injury.details,
              injury.reportedAt,
            ]
          );

          const savedInjury = injuryResult.rows[0];
          
          // Link injury to affected picks
          // For now, link to all picks in the report
          // TODO: Implement smarter logic to determine affected picks
          for (const pick of picks) {
            await client.query(
              `INSERT INTO injury_pick_impact (injury_id, pick_id)
               VALUES ($1, $2)`,
              [savedInjury.id, pick.id]
            );
          }

          injuries.push({
            id: savedInjury.id,
            playerId: savedInjury.player_id,
            playerName: savedInjury.player_name,
            team: savedInjury.team,
            status: savedInjury.status,
            injuryType: savedInjury.injury_type,
            impact: savedInjury.impact,
            details: savedInjury.details,
            reportedAt: new Date(savedInjury.reported_at),
            affectedPicks: picks.map((p) => p.id),
          });
        }
      }

      // 4. Save intelligence updates
      const intelligenceUpdates = [];
      if (
        engineOutput.intelligenceUpdates &&
        engineOutput.intelligenceUpdates.length > 0
      ) {
        for (const intel of engineOutput.intelligenceUpdates) {
          const intelResult = await client.query(
            `INSERT INTO intelligence_updates (
              report_id, entity_id, entity_name, update_type, content,
              source, source_type, credibility_rating, is_new, reported_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, report_id, entity_id, entity_name, update_type, content,
                      source, source_type, credibility_rating, is_new, reported_at`,
            [
              reportId,
              intel.entityId,
              intel.entityName,
              intel.updateType,
              intel.content,
              intel.source,
              intel.sourceType,
              intel.credibilityRating,
              intel.isNew,
              intel.reportedAt,
            ]
          );

          const savedIntel = intelResult.rows[0];
          intelligenceUpdates.push({
            id: savedIntel.id,
            entityId: savedIntel.entity_id,
            entityName: savedIntel.entity_name,
            updateType: savedIntel.update_type,
            content: savedIntel.content,
            source: savedIntel.source,
            sourceType: savedIntel.source_type,
            credibilityRating: parseFloat(savedIntel.credibility_rating),
            reportedAt: new Date(savedIntel.reported_at),
            isNew: savedIntel.is_new,
          });
        }
      }

      // 5. Save line movements
      const lineMovements = [];
      if (engineOutput.lineMovements && engineOutput.lineMovements.length > 0) {
        for (const movement of engineOutput.lineMovements) {
          // Find the corresponding pick ID
          // Line movements reference picks by their original index or game ID
          const pickId = picks[0]?.id; // For now, link to first pick
          // TODO: Implement proper pick matching logic

          if (pickId) {
            const movementResult = await client.query(
              `INSERT INTO line_movements (
                pick_id, opening_line, current_line, movement_percentage,
                direction, sharp_money, notes, timestamp
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING id, pick_id, opening_line, current_line, movement_percentage,
                        direction, sharp_money, notes, timestamp`,
              [
                pickId,
                movement.openingLine,
                movement.currentLine,
                movement.movementPercentage,
                movement.direction,
                movement.sharpMoney ?? false,
                movement.notes ?? null,
                movement.timestamp,
              ]
            );

            const savedMovement = movementResult.rows[0];
            lineMovements.push({
              id: savedMovement.id,
              pickId: savedMovement.pick_id,
              openingLine: savedMovement.opening_line,
              currentLine: savedMovement.current_line,
              movementPercentage: parseFloat(savedMovement.movement_percentage),
              direction: savedMovement.direction,
              sharpMoney: savedMovement.sharp_money,
              notes: savedMovement.notes,
              timestamp: new Date(savedMovement.timestamp),
            });
          }
        }
      }

      // 6. Build and return the complete report
      const report: Report = {
        id: reportId,
        sport: reportRow.sport,
        status: reportRow.status,
        generatedAt: new Date(reportRow.generated_at),
        picks,
        injuries,
        intelligenceUpdates,
        lineMovements,
        systemPerformance: reportRow.system_performance
          ? JSON.parse(reportRow.system_performance)
          : undefined,
      };

      return report;
    });
  }

  /**
   * Calculate expected value based on confidence and odds
   * EV = (Probability of Win × Amount Won per Bet) - (Probability of Loss × Amount Lost per Bet)
   */
  private static calculateExpectedValue(
    confidenceScore: number,
    odds: string
  ): number {
    const probability = confidenceScore / 100;

    // Parse American odds
    const oddsNum = parseFloat(odds);
    let decimalOdds: number;

    if (oddsNum > 0) {
      // Positive odds (underdog)
      decimalOdds = oddsNum / 100 + 1;
    } else {
      // Negative odds (favorite)
      decimalOdds = 100 / Math.abs(oddsNum) + 1;
    }

    // Calculate EV as percentage
    const ev = (probability * (decimalOdds - 1) - (1 - probability)) * 100;

    return Math.round(ev * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Convert database row to Pick object
   */
  private static rowToPick(row: any): Pick {
    return {
      id: row.id,
      gameId: row.game_id,
      matchup: row.matchup,
      gameTime: new Date(row.game_time),
      betType: row.bet_type,
      recommendation: row.recommendation,
      confidenceScore: parseFloat(row.confidence_score),
      riskScore: row.risk_score ? parseFloat(row.risk_score) : undefined,
      hierarchy: row.hierarchy,
      units: row.units,
      currentOdds: row.current_odds,
      openingOdds: row.opening_odds,
      expectedValue: row.expected_value
        ? parseFloat(row.expected_value)
        : undefined,
      reasoning: row.reasoning,
      detailedAnalysis: row.detailed_analysis,
      outcome: row.outcome,
    };
  }
}
