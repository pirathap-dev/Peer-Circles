-- Migration: 004_create_events
CREATE TABLE events (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    date        TIMESTAMPTZ NOT NULL,
    location    VARCHAR(200),
    category    VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events (date);
CREATE INDEX idx_events_category ON events (category);
