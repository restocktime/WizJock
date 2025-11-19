-- Change units column from INTEGER to DECIMAL to support fractional units
ALTER TABLE picks 
  DROP CONSTRAINT picks_units_check;

ALTER TABLE picks 
  ALTER COLUMN units TYPE DECIMAL(4,2);

ALTER TABLE picks 
  ADD CONSTRAINT picks_units_check CHECK (units >= 0.1 AND units <= 100);
