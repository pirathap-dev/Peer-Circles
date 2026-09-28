-- backend/database/migrations/004_add_privacy_settings_to_users.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS allow_private_messages BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS make_profile_private BOOLEAN NOT NULL DEFAULT FALSE;
