// Sport types
export type Sport = 'NFL' | 'NCAA' | 'NBA' | 'UFC';

// Report types
export type ReportStatus = 'draft' | 'published' | 'unpublished';

export interface Report {
  id: string;
  sport: Sport;
  generatedAt: Date;
  status: ReportStatus;
  picks: Pick[];
  injuries: InjuryUpdate[];
  intelligenceUpdates: IntelligenceUpdate[];
  lineMovements: LineMovement[];
  systemPerformance?: SystemPerformance;
}

export interface SystemPerformance {
  record: string;
  winRate: number;
}

// Pick types
export type BetType = 'moneyline' | 'spread' | 'overunder' | 'playerprop';
export type PickHierarchy = 'lock' | 'featured' | 'high' | 'medium' | 'value';
export type PickOutcome = 'win' | 'loss' | 'push' | null;

export interface Pick {
  id: string;
  gameId: string;
  matchup: string;
  gameTime: Date;
  betType: BetType;
  recommendation: string;
  confidenceScore: number;
  riskScore?: number;
  hierarchy: PickHierarchy;
  units: number;
  currentOdds: string;
  openingOdds?: string;
  expectedValue?: number;
  reasoning: string;
  detailedAnalysis: string;
  injuryImpact?: string[];
  intelligenceRefs?: string[];
  playerProps?: PlayerProp[];
  outcome?: PickOutcome;
}

// Player prop types
export type OverUnder = 'over' | 'under';

export interface PlayerProp {
  id?: string;
  playerId: string;
  playerName: string;
  statType: string;
  line: number;
  overUnder: OverUnder;
  odds: string;
  confidence: number;
  reasoning: string;
  outcome?: PickOutcome;
}

// Injury types
export type InjuryStatus = 'out' | 'questionable' | 'probable' | 'season-ending';
export type InjuryImpact = 'critical' | 'moderate' | 'minor';

export interface InjuryUpdate {
  id: string;
  playerId: string;
  playerName: string;
  team?: string;
  status: InjuryStatus;
  injuryType: string;
  impact: InjuryImpact;
  details: string;
  reportedAt: Date;
  affectedPicks: string[];
}

// Intelligence types
export type IntelligenceUpdateType = 'training' | 'weight-cut' | 'personal' | 'lineup' | 'other';
export type IntelligenceSourceType =
  | 'official'
  | 'verified-social'
  | 'media'
  | 'forum'
  | 'insider';

export interface IntelligenceUpdate {
  id: string;
  entityId: string;
  entityName: string;
  updateType: IntelligenceUpdateType;
  content: string;
  source: string;
  sourceType: IntelligenceSourceType;
  credibilityRating: number;
  reportedAt: Date;
  isNew: boolean;
}

// Line movement types
export type LineDirection = 'toward' | 'away';

export interface LineMovement {
  id?: string;
  pickId: string;
  openingLine: string;
  currentLine: string;
  movementPercentage: number;
  direction: LineDirection;
  sharpMoney?: boolean;
  notes?: string;
  timestamp: Date;
}

// Client-facing types (simplified)
export interface ClientPick {
  id: string;
  matchup: string;
  gameTime: Date;
  betType: string;
  recommendation: string;
  currentOdds: string;
  hierarchy: PickHierarchy;
  stars: number;
  units: number;
  reasoning: string;
  injurySummary?: string;
  playerProps?: ClientPlayerProp[];
}

export interface ClientPlayerProp {
  playerName: string;
  statType: string;
  line: number;
  pick: OverUnder;
  odds: string;
  confidence: number;
}

// User types
export type UserRole = 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

// Prediction engine interface
export interface PredictionEngine {
  sport: string;
  generatePicks(): Promise<Pick[]>;
  healthCheck(): Promise<boolean>;
}

// API request/response types
export interface GenerateReportRequest {
  sport: Sport;
}

export interface GenerateReportResponse {
  reportId: string;
  report: Report;
}

export interface PublishReportResponse {
  success: boolean;
  publishedAt: Date;
}

export interface UnpublishReportResponse {
  success: boolean;
}

export interface GetReportsQuery {
  sport?: Sport;
  status?: ReportStatus;
  limit?: number;
  offset?: number;
}

export interface GetReportsResponse {
  reports: Report[];
  total: number;
}

export interface UpdatePickRequest {
  hierarchy?: PickHierarchy;
  units?: number;
  reasoning?: string;
  detailedAnalysis?: string;
}

export interface CreateInjuryRequest {
  reportId: string;
  playerId: string;
  playerName: string;
  team?: string;
  status: InjuryStatus;
  injuryType: string;
  impact: InjuryImpact;
  details: string;
}

export interface UpdateInjuryRequest {
  status?: InjuryStatus;
  impact?: InjuryImpact;
  details?: string;
}

export interface CreateIntelligenceRequest {
  reportId: string;
  entityId: string;
  entityName: string;
  updateType: IntelligenceUpdateType;
  content: string;
  source: string;
  sourceType: IntelligenceSourceType;
}

export interface CreateLineMovementRequest {
  pickId: string;
  openingLine: string;
  currentLine: string;
  sharpMoney?: boolean;
  notes?: string;
}

export interface CreatePlayerPropRequest {
  pickId: string;
  playerId: string;
  playerName: string;
  statType: string;
  line: number;
  overUnder: OverUnder;
  odds: string;
  confidence: number;
  reasoning: string;
}

export interface GetPerformanceQuery {
  sport?: Sport;
  startDate?: string;
  endDate?: string;
  betType?: BetType;
}

export interface PerformanceMetrics {
  winRate: number;
  lossRate: number;
  pushRate: number;
  trends: PerformanceTrend[];
}

export interface PerformanceTrend {
  date: string;
  wins: number;
  losses: number;
  pushes: number;
}

export interface RecordOutcomeRequest {
  outcome: 'win' | 'loss' | 'push';
}

export interface GetPicksQuery {
  sport?: Sport;
  betType?: BetType;
  hierarchy?: PickHierarchy;
}

export interface GetPicksResponse {
  picks: ClientPick[];
  publishedAt: Date;
  nextUpdate?: Date;
  lockOfWeek?: ClientPick;
}

export interface SportInfo {
  name: Sport;
  pickCount: number;
  lockOfWeek?: string;
}

export interface GetSportsResponse {
  sports: SportInfo[];
}
