-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  published_by VARCHAR(255),
  system_performance JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create picks table
CREATE TABLE IF NOT EXISTS picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  game_id VARCHAR(255) NOT NULL,
  matchup VARCHAR(255) NOT NULL,
  game_time TIMESTAMP NOT NULL,
  bet_type VARCHAR(50) NOT NULL,
  recommendation TEXT NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  risk_score DECIMAL(5,2) CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100)),
  hierarchy VARCHAR(20) NOT NULL CHECK (hierarchy IN ('lock', 'featured', 'high', 'medium', 'value')),
  units INTEGER NOT NULL CHECK (units BETWEEN 1 AND 5),
  current_odds VARCHAR(20) NOT NULL,
  opening_odds VARCHAR(20),
  expected_value DECIMAL(5,2),
  reasoning TEXT NOT NULL,
  detailed_analysis TEXT,
  outcome VARCHAR(20) CHECK (outcome IS NULL OR outcome IN ('win', 'loss', 'push')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create player_props table
CREATE TABLE IF NOT EXISTS player_props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pick_id UUID NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  stat_type VARCHAR(100) NOT NULL,
  line DECIMAL(10,2) NOT NULL,
  over_under VARCHAR(10) NOT NULL CHECK (over_under IN ('over', 'under')),
  odds VARCHAR(20) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  reasoning TEXT,
  outcome VARCHAR(20) CHECK (outcome IS NULL OR outcome IN ('win', 'loss', 'push')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create injuries table
CREATE TABLE IF NOT EXISTS injuries (
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

-- Create injury_pick_impact junction table
CREATE TABLE IF NOT EXISTS injury_pick_impact (
  injury_id UUID NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  pick_id UUID NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  PRIMARY KEY (injury_id, pick_id)
);

-- Create intelligence_updates table
CREATE TABLE IF NOT EXISTS intelligence_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  entity_id VARCHAR(255) NOT NULL,
  entity_name VARCHAR(255) NOT NULL,
  update_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('official', 'verified-social', 'media', 'forum', 'insider')),
  credibility_rating DECIMAL(5,2) NOT NULL CHECK (credibility_rating >= 0 AND credibility_rating <= 100),
  is_new BOOLEAN DEFAULT true,
  reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create line_movements table
CREATE TABLE IF NOT EXISTS line_movements (
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

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_reports_sport ON reports(sport);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

CREATE INDEX IF NOT EXISTS idx_picks_report_id ON picks(report_id);
CREATE INDEX IF NOT EXISTS idx_picks_game_time ON picks(game_time);
CREATE INDEX IF NOT EXISTS idx_picks_hierarchy ON picks(hierarchy);
CREATE INDEX IF NOT EXISTS idx_picks_bet_type ON picks(bet_type);
CREATE INDEX IF NOT EXISTS idx_picks_outcome ON picks(outcome) WHERE outcome IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_player_props_pick_id ON player_props(pick_id);
CREATE INDEX IF NOT EXISTS idx_player_props_player_id ON player_props(player_id);

CREATE INDEX IF NOT EXISTS idx_injuries_report_id ON injuries(report_id);
CREATE INDEX IF NOT EXISTS idx_injuries_player_id ON injuries(player_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status ON injuries(status);
CREATE INDEX IF NOT EXISTS idx_injuries_impact ON injuries(impact);

CREATE INDEX IF NOT EXISTS idx_intelligence_report_id ON intelligence_updates(report_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_entity_id ON intelligence_updates(entity_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_credibility ON intelligence_updates(credibility_rating);
CREATE INDEX IF NOT EXISTS idx_intelligence_source_type ON intelligence_updates(source_type);

CREATE INDEX IF NOT EXISTS idx_line_movements_pick_id ON line_movements(pick_id);
CREATE INDEX IF NOT EXISTS idx_line_movements_timestamp ON line_movements(timestamp);
