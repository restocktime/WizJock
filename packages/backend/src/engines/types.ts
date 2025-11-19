import {
  Pick,
  InjuryUpdate,
  IntelligenceUpdate,
  LineMovement,
  Sport,
} from '@sportsbook/shared-types';

/**
 * Raw output from a prediction engine before transformation
 */
export interface EngineOutput {
  picks: Pick[];
  injuries?: InjuryUpdate[];
  intelligenceUpdates?: IntelligenceUpdate[];
  lineMovements?: LineMovement[];
  systemPerformance?: {
    record: string;
    winRate: number;
  };
}

/**
 * Health status of a prediction engine
 */
export interface EngineHealthStatus {
  healthy: boolean;
  sport: Sport;
  lastCheck: Date;
  error?: string;
}

/**
 * Standardized interface that all prediction engines must implement
 */
export interface PredictionEngine {
  /**
   * The sport this engine handles
   */
  readonly sport: Sport;

  /**
   * Generate picks and associated data for the sport
   * @throws {EngineError} if generation fails
   * @returns Promise resolving to engine output
   */
  generatePicks(): Promise<EngineOutput>;

  /**
   * Check if the engine is healthy and operational
   * @returns Promise resolving to health status
   */
  healthCheck(): Promise<EngineHealthStatus>;
}

/**
 * Custom error class for prediction engine failures
 */
export class EngineError extends Error {
  constructor(
    message: string,
    public readonly sport: Sport,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'EngineError';
    Object.setPrototypeOf(this, EngineError.prototype);
  }
}

/**
 * Timeout error for long-running engine operations
 */
export class EngineTimeoutError extends EngineError {
  constructor(sport: Sport, timeoutMs: number) {
    super(`Engine timed out after ${timeoutMs}ms`, sport);
    this.name = 'EngineTimeoutError';
    Object.setPrototypeOf(this, EngineTimeoutError.prototype);
  }
}
