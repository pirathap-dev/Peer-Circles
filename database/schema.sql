-- ==========================================================================
-- Community Mental Health Peer-Support Network
-- PostgreSQL Schema
-- ==========================================================================
-- Run this file to create all tables required for the initial version
-- plus the architecture for future features.
-- ==========================================================================

-- Drop in reverse dependency order (useful during development)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- --------------------------------------------------------------------------
-- users
-- --------------------------------------------------------------------------
CREATE TABLE users (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- communities
-- --------------------------------------------------------------------------
CREATE TABLE communities (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    description  TEXT NOT NULL,
    location     VARCHAR(100) NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communities_location ON communities (location);

-- --------------------------------------------------------------------------
-- community_members (join / leave)
-- --------------------------------------------------------------------------
CREATE TABLE community_members (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    community_id  INTEGER NOT NULL REFERENCES communities (id) ON DELETE CASCADE,
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, community_id)
);

CREATE INDEX idx_community_members_user    ON community_members (user_id);
CREATE INDEX idx_community_members_community ON community_members (community_id);

-- --------------------------------------------------------------------------
-- posts (architecture for future versions)
-- --------------------------------------------------------------------------
CREATE TABLE posts (
    id            SERIAL PRIMARY KEY,
    community_id  INTEGER NOT NULL REFERENCES communities (id) ON DELETE CASCADE,
    user_id       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    content       TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- comments (architecture for future versions)
-- --------------------------------------------------------------------------
CREATE TABLE comments (
    id         SERIAL PRIMARY KEY,
    post_id    INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- reports (architecture for future versions)
-- --------------------------------------------------------------------------
CREATE TABLE reports (
    id              SERIAL PRIMARY KEY,
    reporter_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reported_user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    post_id         INTEGER REFERENCES posts (id) ON DELETE CASCADE,
    reason          TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- notifications (architecture for future versions)
-- --------------------------------------------------------------------------
CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
