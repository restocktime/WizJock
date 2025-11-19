import { Sport } from '@sportsbook/shared-types';
import { PredictionEngine, EngineError } from './types';
import { NFLEngineAdapter } from './adapters/NFLEngineAdapter';
import { NCAAEngineAdapter } from './adapters/NCAAEngineAdapter';
import { NBAEngineAdapter } from './adapters/NBAEngineAdapter';
import { UFCEngineAdapter } from './adapters/UFCEngineAdapter';

/**
 * Factory for creating and managing prediction engine instances
 */
export class EngineFactory {
  private static engines: Map<Sport, PredictionEngine> = new Map();

  /**
   * Get the prediction engine for a specific sport
   * @param sport The sport to get the engine for
   * @returns The prediction engine instance
   * @throws {EngineError} if sport is not supported
   */
  static getEngine(sport: Sport): PredictionEngine {
    // Return cached engine if available
    if (this.engines.has(sport)) {
      return this.engines.get(sport)!;
    }

    // Create new engine instance
    let engine: PredictionEngine;

    switch (sport) {
      case 'NFL':
        engine = new NFLEngineAdapter();
        break;
      case 'NCAA':
        engine = new NCAAEngineAdapter();
        break;
      case 'NBA':
        engine = new NBAEngineAdapter();
        break;
      case 'UFC':
        engine = new UFCEngineAdapter();
        break;
      default:
        throw new EngineError(
          `Unsupported sport: ${sport}`,
          sport as Sport
        );
    }

    // Cache the engine
    this.engines.set(sport, engine);
    return engine;
  }

  /**
   * Check health of all engines
   * @returns Map of sport to health status
   */
  static async checkAllEngines(): Promise<Map<Sport, boolean>> {
    const sports: Sport[] = ['NFL', 'NCAA', 'NBA', 'UFC'];
    const healthMap = new Map<Sport, boolean>();

    await Promise.all(
      sports.map(async (sport) => {
        try {
          const engine = this.getEngine(sport);
          const health = await engine.healthCheck();
          healthMap.set(sport, health.healthy);
        } catch (error) {
          healthMap.set(sport, false);
        }
      })
    );

    return healthMap;
  }

  /**
   * Clear cached engines (useful for testing)
   */
  static clearCache(): void {
    this.engines.clear();
  }
}
