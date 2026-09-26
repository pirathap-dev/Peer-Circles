-- Conversation between exactly two users.
-- We enforce (user_a_id < user_b_id) at the application level to prevent
-- duplicate rows for the same pair of users.
CREATE TABLE IF NOT EXISTS conversations (
  id          SERIAL PRIMARY KEY,
  user_a_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT conversations_unique_pair UNIQUE (user_a_id, user_b_id)
);

-- Individual messages inside a conversation.
CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT    NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON messages(sender_id);
