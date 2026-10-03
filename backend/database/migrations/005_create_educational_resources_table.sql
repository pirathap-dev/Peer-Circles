-- Educational Resources Table
CREATE TABLE IF NOT EXISTS educational_resources (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  content     TEXT,
  category    VARCHAR(100),
  url         VARCHAR(255),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
