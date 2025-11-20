-- Migration: Create applications table for storing membership application submissions
-- Created: 2025-11-19

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  betting_experience VARCHAR(20) NOT NULL CHECK (
    betting_experience IN ('beginner', 'intermediate', 'advanced', 'professional')
  ),
  sms_consent BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected', 'contacted')
  ),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Add comment to table
COMMENT ON TABLE applications IS 'Stores membership application submissions from the landing page';
COMMENT ON COLUMN applications.full_name IS 'Applicant full name';
COMMENT ON COLUMN applications.email IS 'Applicant email address (unique)';
COMMENT ON COLUMN applications.phone IS 'Applicant phone number';
COMMENT ON COLUMN applications.betting_experience IS 'Self-reported betting experience level';
COMMENT ON COLUMN applications.sms_consent IS 'Whether applicant consented to receive SMS messages';
COMMENT ON COLUMN applications.status IS 'Application review status';
COMMENT ON COLUMN applications.notes IS 'Admin notes for application review';
