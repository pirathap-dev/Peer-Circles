CREATE TABLE IF NOT EXISTS educational_resources (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    content     TEXT,
    url         VARCHAR(1000),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT educational_resources_content_or_url CHECK (content IS NOT NULL OR url IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_educational_resources_category
    ON educational_resources (category);