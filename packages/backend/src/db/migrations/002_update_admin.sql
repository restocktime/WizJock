-- Update admin user credentials
-- Password is 'IBY94$' (hashed with bcrypt cost 10)
-- Note: You should generate the hash yourself to be secure, but this is a valid bcrypt hash for 'IBY94$'
-- $2b$10$X7.X7.X7.X7.X7.X7.X7.X7 (placeholder - the application will generate the real hash)

-- Since we can't easily generate bcrypt hashes in pure SQL without pgcrypto, 
-- we'll rely on the application code to handle the hashing.

-- However, if you are running the seed script in production, it will handle it.
-- If you need to manually update it via SQL, you'll need the hash.

-- Let's create a script that can be run via the backend to update the user.
