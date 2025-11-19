import { Sport } from '@sportsbook/shared-types';
import {
  PredictionEngine,
  EngineOutput,
  EngineHealthStatus,
  EngineError,
  EngineTimeoutError,
} from './types';

/**
 * Base class for prediction engine adapters
 * Provides common functionality like timeout handling and error wrapping
 */
export abstract class BaseEngineAdapter implements PredictionEngine {
  protected readonly timeoutMs: number;

  constructor(
    public readonly sport: Sport,
    timeoutMs: number = 120000 // 120 seconds default
  ) {
    this.timeoutMs = timeoutMs;
  }

  /**
   * Generate picks with timeout protection
   */
  async generatePicks(): Promise<EngineOutput> {
    try {
      return await this.withTimeout(
        this.generatePicksInternal(),
        this.timeoutMs
      );
    } catch (error) {
      if (error instanceof EngineTimeoutError) {
        throw error;
      }
      throw new EngineError(
        `Failed to generate picks for ${this.sport}`,
        this.sport,
        error as Error
      );
    }
  }

  /**
   * Check engine health with timeout protection
   */
  async healthCheck(): Promise<EngineHealthStatus> {
    try {
      const isHealthy = await this.withTimeout(
        this.healthCheckInternal(),
        5000 // 5 second timeout for health checks
      );

      return {
        healthy: isHealthy,
        sport: this.sport,
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        healthy: false,
        sport: this.sport,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Subclasses must implement this to generate picks
   */
  protected abstract generatePicksInternal(): Promise<EngineOutput>;

  /**
   * Subclasses must implement this to check health
   */
  protected abstract healthCheckInternal(): Promise<boolean>;

  /**
   * Wraps a promise with a timeout
   */
  protected withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new EngineTimeoutError(this.sport, timeoutMs)),
          timeoutMs
        )
      ),
    ]);
  }
}
