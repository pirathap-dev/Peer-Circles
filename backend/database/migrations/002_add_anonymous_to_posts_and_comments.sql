-- database/migrations/002_add_anonymous_to_posts_and_comments.sql

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS anon_alias   VARCHAR(50);

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS anon_alias   VARCHAR(50);
