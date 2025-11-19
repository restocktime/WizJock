# Design Document

## Overview

The unified sportsbook platform consists of three primary systems:

1. **Admin Dashboard** - A web-based administrative interface for running ML prediction reports, reviewing picks, and publishing to clients
2. **Client Portal** - A simplified, mobile-responsive public interface for viewing betting picks and analytics
3. **Backend API** - A RESTful API that connects prediction engines, manages data flow, and handles publishing operations

The architecture prioritizes simplicity, reliability, and ease of use for non-technical users while maintaining the flexibility to integrate multiple ML prediction engines.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard (React)                  │
│  - Report Management  - Publishing Controls  - Analytics    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/REST
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Backend API (Node.js/Express)             │
│  - Authentication  - Report Processing  - Data Management   │
└─────┬──────────────┬──────────────┬────────────────────┬────┘
      │              │              │                    │
      │              │              │                    │
┌─────▼─────┐  ┌────▼────┐  ┌──────▼──────┐  ┌─────────▼──────┐
│ NFL/NCAA  │  │   NBA   │  │     UFC     │  │   PostgreSQL   │
│  Engine   │  │  Engine │  │   Engine    │  │    Database    │
└───────────┘  └─────────┘  └─────────────┘  └────────────────┘
                                                       │
                                                       │
┌──────────────────────────────────────────────────────▼──────┐
│                  Client Portal (React)                       │
│  - Pick Display  - Sport Navigation  - Mobile Optimized     │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Admin Dashboard & Client Portal)**
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Query for data fetching and caching
- React Router for navigation
- Recharts for performance visualizations (admin only)

**Backend API**
- Node.js with Express
- TypeScript
- JWT for authentication (admin only)
- PostgreSQL for data persistence
- Redis for caching published picks

**Deployment**
- Docker containers for all services
- Nginx as reverse proxy
- SSL/TLS encryption for all traffic

## Components and Interfaces

### 1. Admin Dashboard Components

#### ReportRunner Component
- Displays sport selection dropdown (NFL, NCAA, NBA, UFC)
- Triggers prediction engine execution via API
- Shows loading state during report generation (up to 120 seconds)
- Displays comprehensive report with multiple sections:
  - Critical injury updates with impact assessment
  - Intelligence updates sorted by credibility
  - Line movements and sharp money indicators
  - Generated picks with full details (confidence, risk scores, EV, detailed analysis)
  - Pick hierarchy assignments
- Provides inline editing for pick hierarchy, unit recommendations, and reasoning
- Allows adding/editing injury updates and intelligence
- Provides approve/publish action for entire report

**Interface:**
```typescript
interface Report {
  id: string;
  sport: 'NFL' | 'NCAA' | 'NBA' | 'UFC';
  generatedAt: Date;
  status: 'draft' | 'published' | 'unpublished';
  picks: Pick[];
  injuries: InjuryUpdate[];
  intelligenceUpdates: IntelligenceUpdate[];
  lineMovements: LineMovement[];
  systemPerformance?: {
    record: string; // e.g., "47-21 ATS"
    winRate: number;
  };
}

interface Pick {
  id: string;
  gameId: string;
  matchup: string;
  gameTime: Date;
  betType: 'moneyline' | 'spread' | 'overunder' | 'playerprop';
  recommendation: string;
  confidenceScore: number; // 0-100 percentage
  riskScore?: number; // 0-100 for UFC (higher = riskier)
  hierarchy: 'lock' | 'featured' | 'high' | 'medium' | 'value';
  units: number; // 1-5 unit recommendation
  currentOdds: string; // e.g., "-7", "+150"
  openingOdds?: string;
  expectedValue?: number; // EV percentage
  reasoning: string; // Brief explanation for clients
  detailedAnalysis: string; // Full analysis for admin
  injuryImpact?: string[]; // References to injury IDs affecting this pick
  intelligenceRefs?: string[]; // References to intelligence update IDs
  playerProps?: PlayerProp[]; // For player prop bets
}

interface PlayerProp {
  playerId: string;
  playerName: string;
  statType: string; // e.g., "passing yards", "receptions", "touchdowns"
  line: number;
  overUnder: 'over' | 'under';
  odds: string;
  confidence: number;
  reasoning: string;
}

interface InjuryUpdate {
  id: string;
  playerId: string;
  playerName: string;
  team?: string;
  status: 'out' | 'questionable' | 'probable' | 'season-ending';
  injuryType: string; // e.g., "hamstring", "torn ACL"
  impact: 'critical' | 'moderate' | 'minor';
  details: string;
  reportedAt: Date;
  affectedPicks: string[]; // Pick IDs affected by this injury
}

interface IntelligenceUpdate {
  id: string;
  entityId: string; // Player or fighter ID
  entityName: string;
  updateType: 'training' | 'weight-cut' | 'personal' | 'lineup' | 'other';
  content: string;
  source: string;
  sourceType: 'official' | 'verified-social' | 'media' | 'forum' | 'insider';
  credibilityRating: number; // 0-100 percentage
  reportedAt: Date;
  isNew: boolean; // Flagged if added in last 24 hours
}

interface LineMovement {
  pickId: string;
  openingLine: string;
  currentLine: string;
  movementPercentage: number;
  direction: 'toward' | 'away'; // Toward or away from the pick
  sharpMoney?: boolean;
  notes?: string;
  timestamp: Date;
}
```

#### PublishingControl Component
- Shows list of draft reports ready for publishing
- Displays currently published reports with unpublish option
- Shows publication history with timestamps
- Provides bulk publish/unpublish actions

#### PerformanceTracker Component
- Displays win/loss/push statistics per sport
- Shows accuracy trends over time with line charts
- Allows filtering by date range and bet type
- Provides export functionality for performance data

#### InjuryManager Component
- Displays all tracked injuries with status indicators
- Allows adding new injury updates with player search
- Shows which picks are affected by each injury
- Provides bulk actions for updating injury statuses
- Highlights critical injuries (Out, Season-Ending) in red
- Auto-flags picks for review when related injuries are added

#### IntelligenceHub Component
- Displays all intelligence updates for current report
- Allows adding new intelligence with source credibility assignment
- Filters by credibility threshold (show only 80%+ sources)
- Highlights new intelligence added in last 24 hours
- Shows intelligence grouped by player/fighter
- Provides search and tagging functionality

#### LineMovementTracker Component
- Displays opening vs current lines for all picks
- Highlights significant movements (>10% change)
- Shows direction indicators (toward/away from pick)
- Allows adding notes about sharp money
- Calculates and displays expected value based on current odds
- Provides alerts for favorable line movements

### 2. Client Portal Components

#### SportNavigation Component
- Large, touch-friendly buttons for each sport
- Visual indicators showing number of available picks
- Active state highlighting for selected sport
- Responsive layout that stacks vertically on mobile

#### PicksDisplay Component
- Card-based layout for each pick with hierarchy-based ordering
- Extra-large fonts (20px+ for body, 28px+ for headings)
- Visual hierarchy indicators:
  - Lock of the Week: Gold badge with 5 stars
  - Featured Picks: Silver badge with 4 stars
  - High Confidence: 3 stars
  - Medium Confidence: 2 stars
  - Value Plays: 1-2 stars with "Value" tag
- Displays: matchup, game time, bet type, recommendation, current odds, unit recommendation (1-5 units), brief reasoning (1-2 sentences max)
- Shows simplified injury summary if relevant (e.g., "Key player out")
- Hides detailed intelligence, credibility ratings, risk scores, line movements, and complex analytics
- Expandable section for player props under each game (collapsed by default)

**Interface:**
```typescript
interface ClientPick {
  id: string;
  matchup: string;
  gameTime: Date;
  betType: string; // Human-readable: "Money Line", "Spread", etc.
  recommendation: string;
  currentOdds: string;
  hierarchy: 'lock' | 'featured' | 'high' | 'medium' | 'value';
  stars: number; // 1-5 star rating for visual display
  units: number; // 1-5 unit recommendation
  reasoning: string; // Simple 1-2 sentence explanation
  injurySummary?: string; // Simplified injury info if relevant
  playerProps?: ClientPlayerProp[]; // Simplified props
}

interface ClientPlayerProp {
  playerName: string;
  statType: string;
  line: number;
  pick: 'over' | 'under';
  odds: string;
  confidence: number;
}
```

#### BetTypeFilter Component
- Horizontal scrollable filter chips on mobile
- Shows count of picks per bet type
- Maintains filter state across navigation
- Clear "All" option to reset filters

#### UpdateIndicator Component
- Displays "Last Updated: X minutes ago"
- Auto-refreshes every 60 seconds
- Shows warning icon if picks are >24 hours old
- Displays next scheduled update time

### 3. Backend API Endpoints

#### Admin Endpoints (Authenticated)

```
POST   /api/admin/reports/generate
  Body: { sport: string }
  Response: { reportId: string, report: Report }

POST   /api/admin/reports/:reportId/publish
  Response: { success: boolean, publishedAt: Date }

DELETE /api/admin/reports/:reportId/unpublish
  Response: { success: boolean }

GET    /api/admin/reports
  Query: { sport?, status?, limit?, offset? }
  Response: { reports: Report[], total: number }

GET    /api/admin/reports/:reportId
  Response: { report: Report }

PATCH  /api/admin/picks/:pickId
  Body: { hierarchy?, units?, reasoning?, detailedAnalysis? }
  Response: { success: boolean, pick: Pick }

POST   /api/admin/injuries
  Body: { reportId, playerId, playerName, status, injuryType, impact, details }
  Response: { success: boolean, injury: InjuryUpdate }

PATCH  /api/admin/injuries/:injuryId
  Body: { status?, impact?, details? }
  Response: { success: boolean, injury: InjuryUpdate }

GET    /api/admin/injuries
  Query: { reportId?, playerId?, status? }
  Response: { injuries: InjuryUpdate[] }

POST   /api/admin/intelligence
  Body: { reportId, entityId, entityName, updateType, content, source, sourceType }
  Response: { success: boolean, intelligence: IntelligenceUpdate }

GET    /api/admin/intelligence
  Query: { reportId?, entityId?, minCredibility? }
  Response: { updates: IntelligenceUpdate[] }

POST   /api/admin/line-movements
  Body: { pickId, openingLine, currentLine, sharpMoney?, notes? }
  Response: { success: boolean, movement: LineMovement }

GET    /api/admin/line-movements/:pickId
  Response: { movements: LineMovement[] }

POST   /api/admin/player-props
  Body: { pickId, playerId, playerName, statType, line, overUnder, odds, confidence, reasoning }
  Response: { success: boolean, prop: PlayerProp }

GET    /api/admin/performance
  Query: { sport?, startDate?, endDate?, betType? }
  Response: { winRate: number, lossRate: number, pushRate: number, trends: [] }

POST   /api/admin/picks/:pickId/outcome
  Body: { outcome: 'win' | 'loss' | 'push' }
  Response: { success: boolean }

POST   /api/admin/player-props/:propId/outcome
  Body: { outcome: 'win' | 'loss' | 'push' }
  Response: { success: boolean }
```

#### Client Endpoints (Public)

```
GET    /api/picks
  Query: { sport?, betType?, hierarchy? }
  Response: { picks: ClientPick[], publishedAt: Date, nextUpdate?: Date, lockOfWeek?: ClientPick }

GET    /api/picks/sports
  Response: { sports: Array<{ name: string, pickCount: number, lockOfWeek?: string }> }

GET    /api/picks/:pickId/props
  Response: { props: ClientPlayerProp[] }
```

### 4. Prediction Engine Integration

Each prediction engine (NFL/NCAA, NBA, UFC) will be integrated via a standardized interface:

```typescript
interface PredictionEngine {
  sport: string;
  generatePicks(): Promise<Pick[]>;
  healthCheck(): Promise<boolean>;
}
```

The backend will:
- Call the appropriate engine based on sport selection
- Transform engine output to standardized Pick format
- Handle engine failures gracefully with error messages
- Cache results to avoid redundant computations

## Data Models

### Database Schema

**reports table**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  published_by VARCHAR(255),
  system_performance JSONB, -- Record, win rate, etc.
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**picks table**
```sql
CREATE TABLE picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  game_id VARCHAR(255) NOT NULL,
  matchup VARCHAR(255) NOT NULL,
  game_time TIMESTAMP NOT NULL,
  bet_type VARCHAR(50) NOT NULL,
  recommendation TEXT NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL, -- 0-100 percentage
  risk_score DECIMAL(5,2), -- 0-100 for UFC
  hierarchy VARCHAR(20) NOT NULL, -- 'lock', 'featured', 'high', 'medium', 'value'
  units INTEGER NOT NULL CHECK (units BETWEEN 1 AND 5),
  current_odds VARCHAR(20) NOT NULL,
  opening_odds VARCHAR(20),
  expected_value DECIMAL(5,2), -- EV percentage
  reasoning TEXT NOT NULL, -- Brief for clients
  detailed_analysis TEXT, -- Full analysis for admin
  outcome VARCHAR(20), -- 'win', 'loss', 'push', null
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_picks_report_id ON picks(report_id);
CREATE INDEX idx_picks_game_time ON picks(game_time);
CREATE INDEX idx_picks_hierarchy ON picks(hierarchy);
CREATE INDEX idx_picks_outcome ON picks(outcome) WHERE outcome IS NOT NULL;
```

**player_props table**
```sql
CREATE TABLE player_props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pick_id UUID NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  stat_type VARCHAR(100) NOT NULL,
  line DECIMAL(10,2) NOT NULL,
  over_under VARCHAR(10) NOT NULL CHECK (over_under IN ('over', 'under')),
  odds VARCHAR(20) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  reasoning TEXT,
  outcome VARCHAR(20), -- 'win', 'loss', 'push', null
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_player_props_pick_id ON player_props(pick_id);
CREATE INDEX idx_player_props_player_id ON player_props(player_id);
```

**injuries table**
```sql
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  team VARCHAR(100),
  status VARCHAR(20) NOT NULL CHECK (status IN ('out', 'questionable', 'probable', 'season-ending')),
  injury_type VARCHAR(100) NOT NULL,
  impact VARCHAR(20) NOT NULL CHECK (impact IN ('critical', 'moderate', 'minor')),
  details TEXT,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_injuries_report_id ON injuries(report_id);
CREATE INDEX idx_injuries_player_id ON injuries(player_id);
CREATE INDEX idx_injuries_status ON injuries(status);
```

**injury_pick_impact table** (junction table)
```sql
CREATE TABLE injury_pick_impact (
  injury_id UUID NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  pick_id UUID NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  PRIMARY KEY (injury_id, pick_id)
);
```

**intelligence_updates table**
```sql
CREATE TABLE intelligence_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  entity_id VARCHAR(255) NOT NULL, -- Player or fighter ID
  entity_name VARCHAR(255) NOT NULL,
  update_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('official', 'verified-social', 'media', 'forum', 'insider')),
  credibility_rating DECIMAL(5,2) NOT NULL,
  is_new BOOLEAN DEFAULT true,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intelligence_report_id ON intelligence_updates(report_id);
CREATE INDEX idx_intelligence_entity_id ON intelligence_updates(entity_id);
CREATE INDEX idx_intelligence_credibility ON intelligence_updates(credibility_rating);
```

**line_movements table**
```sql
CREATE TABLE line_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pick_id UUID NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  opening_line VARCHAR(20) NOT NULL,
  current_line VARCHAR(20) NOT NULL,
  movement_percentage DECIMAL(5,2) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('toward', 'away')),
  sharp_money BOOLEAN DEFAULT false,
  notes TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_line_movements_pick_id ON line_movements(pick_id);
CREATE INDEX idx_line_movements_timestamp ON line_movements(timestamp);
```

**users table (admin authentication)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Redis Caching Strategy

**Published Picks Cache**
- Key: `picks:{sport}:{betType}`
- TTL: 5 minutes
- Value: JSON array of ClientPick objects
- Invalidated on publish/unpublish operations

**Performance Metrics Cache**
- Key: `performance:{sport}:{startDate}:{endDate}`
- TTL: 1 hour
- Value: Aggregated statistics object

## Error Handling

### Admin Dashboard Error Handling

1. **Report Generation Failures**
   - Display user-friendly error message
   - Log detailed error to backend
   - Provide retry button
   - Show engine health status

2. **Publishing Failures**
   - Rollback database transaction
   - Maintain report in draft state
   - Alert administrator with specific error
   - Queue for automatic retry (max 3 attempts)

3. **Authentication Errors**
   - Redirect to login page
   - Preserve intended action after re-authentication
   - Clear expired tokens from storage

### Client Portal Error Handling

1. **Data Loading Failures**
   - Display "Unable to load picks" message
   - Provide manual refresh button
   - Show cached data if available with staleness indicator
   - Automatic retry with exponential backoff

2. **Network Errors**
   - Detect offline state
   - Display offline indicator
   - Queue requests for when connection restored
   - Show last successfully loaded data

### Backend Error Handling

1. **Prediction Engine Failures**
   - Return 503 Service Unavailable
   - Include retry-after header
   - Log engine-specific errors
   - Send alert to administrators

2. **Database Errors**
   - Rollback transactions
   - Return 500 Internal Server Error
   - Log full error stack
   - Implement circuit breaker for repeated failures

3. **Validation Errors**
   - Return 400 Bad Request
   - Include specific field errors in response
   - Validate all inputs before processing

## Testing Strategy

### Unit Testing

**Frontend Components**
- Test each component in isolation using React Testing Library
- Mock API calls with MSW (Mock Service Worker)
- Test user interactions (clicks, form submissions)
- Verify correct rendering based on props and state
- Target: 80% code coverage

**Backend API**
- Test each endpoint with various inputs
- Mock database and external services
- Test authentication and authorization logic
- Verify error handling paths
- Target: 85% code coverage

### Integration Testing

**API Integration Tests**
- Test complete request/response cycles
- Use test database with seed data
- Verify database state changes
- Test authentication flows end-to-end
- Test prediction engine integration

**Frontend Integration Tests**
- Test user workflows across multiple components
- Verify navigation and routing
- Test data fetching and caching behavior
- Test responsive design breakpoints

### End-to-End Testing

**Critical User Paths**
1. Admin generates report → reviews picks → publishes → verifies client view
2. Client navigates to sport → filters by bet type → views pick details
3. Admin unpublishes report → verifies removal from client view
4. Admin views performance metrics → filters by date range

**Tools**
- Playwright for E2E tests
- Run against staging environment
- Include mobile viewport testing
- Test on Chrome, Firefox, Safari

### Performance Testing

**Load Testing**
- Simulate 1000 concurrent client users
- Test API response times under load
- Verify caching effectiveness
- Identify bottlenecks

**Metrics to Monitor**
- API response time (target: <200ms for cached, <1s for uncached)
- Page load time (target: <3s on 4G)
- Time to interactive (target: <5s)
- Database query performance

### Accessibility Testing

**WCAG 2.1 AA Compliance**
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)
- Color contrast verification
- Focus management testing

## Security Considerations

### Authentication & Authorization
- JWT tokens with 24-hour expiration
- Refresh token rotation
- Role-based access control (admin only for dashboard)
- Rate limiting on authentication endpoints

### Data Protection
- HTTPS only (redirect HTTP to HTTPS)
- Secure cookie flags (HttpOnly, Secure, SameSite)
- SQL injection prevention via parameterized queries
- XSS prevention via React's built-in escaping
- CSRF protection for state-changing operations

### API Security
- Rate limiting: 100 requests/minute per IP for public endpoints
- Input validation on all endpoints
- Request size limits
- CORS configuration for known origins only

## Deployment Strategy

### Environment Setup
- Development: Local Docker Compose
- Staging: Cloud-hosted (AWS/GCP/Azure)
- Production: Cloud-hosted with auto-scaling

### CI/CD Pipeline
1. Code push triggers automated tests
2. Build Docker images on test success
3. Deploy to staging automatically
4. Manual approval for production deployment
5. Blue-green deployment to minimize downtime

### Monitoring & Logging
- Application logs aggregated to centralized service
- Error tracking with Sentry or similar
- Performance monitoring with New Relic or similar
- Uptime monitoring with alerts
- Database performance monitoring

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for live pick updates
2. **User Accounts**: Client login for personalized pick history
3. **Push Notifications**: Mobile notifications for new picks
4. **Advanced Analytics**: More detailed performance breakdowns
5. **API Access**: Public API for third-party integrations
6. **Multi-language Support**: Internationalization for broader audience
