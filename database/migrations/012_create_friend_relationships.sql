CREATE TABLE IF NOT EXISTS friend_relationships (
  id           SERIAL PRIMARY KEY,
  user_a_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  user_b_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  requested_by INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT friend_relationships_ordered_pair CHECK (user_a_id < user_b_id),
  CONSTRAINT friend_relationships_requester_in_pair
    CHECK (requested_by = user_a_id OR requested_by = user_b_id),
  CONSTRAINT friend_relationships_status CHECK (status IN ('pending', 'accepted')),
  CONSTRAINT friend_relationships_unique_pair UNIQUE (user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_relationships_requested_by
  ON friend_relationships (requested_by, status);
