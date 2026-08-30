-- ==========================================================================
-- Migration: 002_add_user_avatar.sql
-- ==========================================================================
-- Adds Cloudinary avatar support to the users table.
-- Apply with:
--   psql "$DATABASE_URL" -f database/migrations/002_add_user_avatar.sql
-- ==========================================================================

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);