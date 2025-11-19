# Spec Updates Summary

## Overview
Updated the unified sportsbook platform spec to match the actual complexity of your UFC and NFL reports, including injury tracking, intelligence updates with credibility ratings, line movements, pick hierarchy, and two-tier information architecture.

## Key Changes

### Requirements Document
**Added 6 new requirements:**
- **Requirement 9**: Injury tracking and management with automatic pick flagging
- **Requirement 10**: Intelligence updates with credibility ratings (Official 95%, Verified Social 85%, Media 80%, Forum 70%)
- **Requirement 11**: Line movement tracking and sharp money identification
- **Requirement 12**: Pick hierarchy management (Lock of Week, Featured, High Confidence, Medium Confidence, Value Plays)
- **Requirement 13**: Player props management with injury impact tracking

**Enhanced existing requirements:**
- Requirement 1: Added intelligence data, risk scores, line movements to admin report generation
- Requirement 3: Simplified client view with star ratings, unit recommendations, hiding complex data

### Design Document
**Expanded data models:**
- `Pick` interface now includes: hierarchy, units, risk scores, EV, detailed vs brief reasoning, injury/intelligence references
- Added `InjuryUpdate` interface with status, impact, affected picks
- Added `IntelligenceUpdate` interface with credibility ratings and source types
- Added `LineMovement` interface with sharp money indicators
- Added `PlayerProp` interface for player-specific bets
- `ClientPick` interface simplified to hide admin-only data

**New database tables:**
- `injuries` - Track player/fighter injuries with status and impact
- `injury_pick_impact` - Junction table linking injuries to affected picks
- `intelligence_updates` - Store intelligence with credibility ratings
- `line_movements` - Track odds changes over time
- `player_props` - Store player prop bets

**New admin components:**
- `InjuryManager` - Add/edit injuries, see affected picks
- `IntelligenceHub` - Manage intelligence with credibility filtering
- `LineMovementTracker` - Track odds changes and sharp money
- `PickEditor` - Edit hierarchy, units, reasoning inline
- `PlayerPropsManager` - Manage player props with injury flagging

**Enhanced components:**
- `ReportRunner` - Now displays comprehensive intelligence, injuries, line movements
- `PicksDisplay` (client) - Star ratings, hierarchy badges, simplified injury summaries, expandable props

**New API endpoints:**
- Injury management: POST/PATCH/GET `/api/admin/injuries`
- Intelligence: POST/GET `/api/admin/intelligence`
- Line movements: POST/GET `/api/admin/line-movements`
- Pick editing: PATCH `/api/admin/picks/:pickId`
- Player props: POST/GET `/api/admin/player-props`

### Tasks Document
**Added new implementation tasks:**
- Task 5.2: Implement injury management endpoints
- Task 5.3: Implement intelligence management endpoints
- Task 5.4: Implement line movement tracking endpoints
- Task 5.5: Implement pick editing endpoints
- Task 5.6: Implement player props endpoints
- Task 7.5: Build InjuryManager component
- Task 7.6: Build IntelligenceHub component
- Task 7.7: Build LineMovementTracker component
- Task 7.8: Build PickEditor component
- Task 7.9: Build PlayerPropsManager component

**Enhanced existing tasks:**
- Database migrations now include 5 additional tables
- Report generation service extracts injuries, intelligence, line movements
- Client API transforms admin data to simplified format
- PicksDisplay component implements hierarchy-based ordering with star ratings

## Two-Tier Information Architecture

### Admin Dashboard (Full Data)
- Comprehensive intelligence reports
- Risk scores (0-100 for UFC)
- Confidence percentages
- Credibility ratings for sources
- Line movements and sharp money indicators
- Detailed injury analysis
- Expected value calculations
- Full pick analysis

### Client Portal (Simplified)
- Matchup and game time
- Current odds
- Pick recommendation
- Star rating (1-5 stars based on hierarchy)
- Unit recommendation (1-5 units)
- Brief reasoning (1-2 sentences max)
- Simplified injury summary ("Key player out")
- Expandable player props

**Hidden from clients:**
- Risk scores
- Credibility ratings
- Intelligence sources
- Line movement details
- Detailed analysis
- Sharp money indicators
- Expected value calculations

## Data Flow

1. **Admin runs report** → Prediction engine generates comprehensive data
2. **Admin reviews** → Full intelligence, injuries, line movements, picks with all details
3. **Admin edits** → Adjust hierarchy, units, reasoning; add injuries/intelligence
4. **Admin publishes** → System transforms data for client view
5. **Clients view** → Simplified picks with only essential information

## Next Steps

You can now start implementing tasks from the updated `tasks.md` file. The spec accurately reflects your UFC and NFL report complexity while maintaining a simplified client experience for your older adult users.

Start with Task 1 (project setup) and work sequentially through the implementation plan.
