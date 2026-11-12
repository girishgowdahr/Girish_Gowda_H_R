-- ============================================================================
-- Migration: V1__core_baseline_schema.sql
-- Domain: core
-- Description: Baseline schema for user identity, sessions, credentials,
--              3D avatar themes, and module registry state.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS core;

-- ----------------------------------------------------------------------------
-- Table: core.app_user
-- Platform owner / single-tenant user identity record
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.app_user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OWNER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: core.auth_credential
-- Multi-credential storage (Argon2id password hashes, encrypted TOTP secrets, WebAuthn)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.auth_credential (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES core.app_user(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL,
    identifier VARCHAR(255),
    secret_hash VARCHAR(512) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_credential_user_id ON core.auth_credential(user_id);

-- ----------------------------------------------------------------------------
-- Table: core.session
-- Revocable server sessions with cryptographic SHA-256 token hashing
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.session (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES core.app_user(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_session_token_hash ON core.session(token_hash);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON core.session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON core.session(expires_at);

-- ----------------------------------------------------------------------------
-- Table: core.avatar_theme
-- Visual stage configurations for 3D character lobby & Free Fire aesthetic
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.avatar_theme (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    outfit_id VARCHAR(64) NOT NULL,
    pose_id VARCHAR(64) NOT NULL,
    scene_id VARCHAR(64) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: core.module_state
-- Runtime extensible module registry state
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.module_state (
    module_id VARCHAR(64) PRIMARY KEY,
    display_name VARCHAR(128) NOT NULL,
    icon VARCHAR(64),
    nav_group VARCHAR(64) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
    visibility VARCHAR(32) NOT NULL DEFAULT 'PRIVATE',
    avatar_theme_id VARCHAR(64) REFERENCES core.avatar_theme(id) ON DELETE SET NULL,
    feature_flags JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Avatar Themes
-- ----------------------------------------------------------------------------
INSERT INTO core.avatar_theme (id, name, outfit_id, pose_id, scene_id, config, is_default)
VALUES 
    ('theme-cyber-neon', 'Cyber Neon Operative', 'cyber-neon', 'combat-ready', 'neon-grid', '{"primaryColor": "#00ffcc", "accentColor": "#3b82f6", "particleCount": 150}', TRUE),
    ('theme-tactical-ghost', 'Tactical Ghost Recon', 'tactical-ghost', 'guard-defense', 'shadow-hangar', '{"primaryColor": "#94a3b8", "accentColor": "#64748b", "particleCount": 100}', FALSE),
    ('theme-crimson-blaze', 'Crimson Blaze Vanguard', 'crimson-blaze', 'combat-ready', 'ember-forge', '{"primaryColor": "#ef4444", "accentColor": "#f59e0b", "particleCount": 200}', FALSE),
    ('theme-void-walker', 'Void Walker Specter', 'void-walker', 'victory-salute', 'abyss-realm', '{"primaryColor": "#8b5cf6", "accentColor": "#ec4899", "particleCount": 180}', FALSE);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Core Module Registry
-- ----------------------------------------------------------------------------
INSERT INTO core.module_state (module_id, display_name, icon, nav_group, sort_order, status, visibility, avatar_theme_id)
VALUES
    ('lobby', 'Command Center Lobby', 'Crosshair', 'primary', 10, 'ENABLED', 'PUBLIC', 'theme-cyber-neon'),
    ('portfolio', 'Engineering Portfolio', 'Briefcase', 'primary', 20, 'ENABLED', 'PUBLIC', 'theme-cyber-neon'),
    ('personal-fitness', 'Tactical Fitness Tracker', 'Activity', 'personal', 30, 'ENABLED', 'PRIVATE', 'theme-tactical-ghost'),
    ('personal-study', 'Learning & Study Matrix', 'BookOpen', 'personal', 40, 'ENABLED', 'PRIVATE', 'theme-cyber-neon'),
    ('personal-journal', 'Logbook & Journal', 'FileText', 'personal', 50, 'ENABLED', 'PRIVATE', 'theme-void-walker'),
    ('vault', 'Secure Zero-Knowledge Vault', 'ShieldCheck', 'security', 60, 'ENABLED', 'OWNER_ONLY', 'theme-tactical-ghost');
