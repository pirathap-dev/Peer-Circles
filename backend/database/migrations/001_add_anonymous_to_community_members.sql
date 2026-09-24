-- database/migrations/001_add_anonymous_to_community_members.sql
ALTER TABLE community_members
  ADD COLUMN IF NOT EXISTS anonymous BOOLEAN NOT NULL DEFAULT FALSE;
