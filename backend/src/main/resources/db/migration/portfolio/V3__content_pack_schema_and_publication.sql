-- ============================================================================
-- Migration: V3__content_pack_schema_and_publication.sql
-- Domain: portfolio
-- Description: Supports owner-confirmed content pack from resume:
--              adds publications table, nullable issue_date/start_year,
--              status and metadata columns, and purges initial synthetic seeds.
-- ============================================================================

-- 1. Publications Table
CREATE TABLE IF NOT EXISTS portfolio.publication (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(180) NOT NULL,
    publication_year VARCHAR(32) NOT NULL,
    state VARCHAR(64),
    role VARCHAR(128),
    abstract_summary TEXT,
    doi VARCHAR(255),
    url VARCHAR(255),
    conference VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED_FROM_RESUME',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Certificate Table Adjustments
ALTER TABLE portfolio.certificate ALTER COLUMN issue_date DROP NOT NULL;
ALTER TABLE portfolio.certificate ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE portfolio.certificate ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED_FROM_RESUME';

-- 3. Education Table Adjustments
ALTER TABLE portfolio.education ALTER COLUMN start_year DROP NOT NULL;
ALTER TABLE portfolio.education ADD COLUMN IF NOT EXISTS city VARCHAR(128);
ALTER TABLE portfolio.education ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED_FROM_RESUME';

-- 4. Project Table Adjustments
ALTER TABLE portfolio.project ADD COLUMN IF NOT EXISTS bullets JSONB NOT NULL DEFAULT '[]';
ALTER TABLE portfolio.project ADD COLUMN IF NOT EXISTS kind VARCHAR(128);
ALTER TABLE portfolio.project ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED_FROM_RESUME';

-- 5. Profile Table Adjustments
ALTER TABLE portfolio.profile ADD COLUMN IF NOT EXISTS languages JSONB NOT NULL DEFAULT '[]';
ALTER TABLE portfolio.profile ADD COLUMN IF NOT EXISTS career_goal VARCHAR(255);
ALTER TABLE portfolio.profile ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED_FROM_RESUME';

-- 6. Purge synthetic baseline seeds to enforce Rule 7 (Remove all SYNTHETIC data)
DELETE FROM portfolio.experience;
DELETE FROM portfolio.certificate;
DELETE FROM portfolio.education;
DELETE FROM portfolio.project;
DELETE FROM portfolio.skill_item;
DELETE FROM portfolio.skill_category;
DELETE FROM portfolio.profile;
