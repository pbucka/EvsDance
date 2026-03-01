-- Ev's Dance — initial schema
-- Run once: psql -d evsdance -f schema.sql

CREATE TABLE IF NOT EXISTS prompts (
    id         BIGSERIAL    PRIMARY KEY,
    prompt     TEXT         NOT NULL,
    model      VARCHAR      NOT NULL,
    response   TEXT,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts (created_at DESC);
