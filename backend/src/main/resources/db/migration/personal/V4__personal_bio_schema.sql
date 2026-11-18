-- ============================================================================
-- Migration: V4__personal_bio_schema.sql
-- Domain: personal
-- Description: Schema for private personal bio records with structured categories,
--              custom fields, and owner-only access.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS personal;

-- ----------------------------------------------------------------------------
-- Table: personal.personal_bio
-- Stores category-organized personal bio entries with custom field support
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personal.personal_bio (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES core.app_user(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    field_key VARCHAR(128) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_value TEXT,
    field_type VARCHAR(64) NOT NULL DEFAULT 'text',
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_personal_bio_user_field UNIQUE (user_id, category, field_key)
);

CREATE INDEX IF NOT EXISTS idx_personal_bio_user_cat ON personal.personal_bio(user_id, category);
CREATE INDEX IF NOT EXISTS idx_personal_bio_user_id ON personal.personal_bio(user_id);
