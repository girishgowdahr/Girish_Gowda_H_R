-- ============================================================================
-- Migration: V2__portfolio_schema.sql
-- Domain: portfolio
-- Description: Schema and baseline seed records for public professional portfolio:
--              profile, skill categories, skill items, projects, experience,
--              education, and certifications.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS portfolio;

-- ----------------------------------------------------------------------------
-- Table: portfolio.profile
-- Single-tenant public professional profile and bio
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.profile (
    id UUID PRIMARY KEY,
    full_name VARCHAR(128) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    location VARCHAR(128),
    email VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    resume_url VARCHAR(255),
    avatar_image_url VARCHAR(255),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: portfolio.skill_category
-- High-level skill grouping (e.g., Languages, Backend, Frontend, Cloud)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.skill_category (
    id UUID PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: portfolio.skill_item
-- Specific technical competencies and tools
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.skill_item (
    id UUID PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES portfolio.skill_category(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    proficiency VARCHAR(32),
    years_of_experience NUMERIC(3, 1),
    icon VARCHAR(64),
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_skill_item_category_id ON portfolio.skill_item(category_id);

-- ----------------------------------------------------------------------------
-- Table: portfolio.project
-- Software engineering projects, architectures, and open-source systems
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.project (
    id UUID PRIMARY KEY,
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    technologies JSONB NOT NULL DEFAULT '[]',
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    demo_url VARCHAR(255),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_slug ON portfolio.project(slug);
CREATE INDEX IF NOT EXISTS idx_project_featured ON portfolio.project(featured);

-- ----------------------------------------------------------------------------
-- Table: portfolio.experience
-- Professional roles, internships, and engineering positions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.experience (
    id UUID PRIMARY KEY,
    role_title VARCHAR(128) NOT NULL,
    company_name VARCHAR(128) NOT NULL,
    employment_type VARCHAR(64),
    location VARCHAR(128),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    highlights JSONB NOT NULL DEFAULT '[]',
    technologies JSONB NOT NULL DEFAULT '[]',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: portfolio.education
-- Academic history and degrees
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.education (
    id UUID PRIMARY KEY,
    institution VARCHAR(180) NOT NULL,
    degree VARCHAR(128) NOT NULL,
    field_of_study VARCHAR(128) NOT NULL,
    start_year INT NOT NULL,
    end_year INT,
    grade_or_gpa VARCHAR(32),
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: portfolio.certificate
-- Professional certifications and licensures
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio.certificate (
    id UUID PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    issuing_organization VARCHAR(180) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    credential_id VARCHAR(128),
    credential_url VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Profile
-- Note: Confirmed owner info populated; placeholders marked per roadmap rule.
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.profile (
    id, full_name, headline, bio, location, email, github_url, linkedin_url, resume_url, avatar_image_url, is_published
) VALUES (
    '018d9f10-7000-7000-8000-000000000001',
    'Girish Gowda H R',
    'Full-Stack Software Engineer & Distributed Systems Developer',
    'Passionate engineer specializing in modern enterprise architectures, cloud platforms, robust Spring Boot services, interactive React/Three.js interfaces, and secure zero-knowledge systems.',
    'Bengaluru, India',
    'girishgowda0428@gmail.com',
    'https://github.com/girishgowdahr',
    'https://linkedin.com/in/girishgowdahr',
    '/api/v1/public/portfolio/resume',
    '/avatar-profile.png',
    TRUE
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Skill Categories & Skill Items
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.skill_category (id, name, sort_order) VALUES
    ('018d9f10-7000-7000-8000-000000000010', 'Languages & Core Runtimes', 10),
    ('018d9f10-7000-7000-8000-000000000020', 'Backend & Cloud Architecture', 20),
    ('018d9f10-7000-7000-8000-000000000030', 'Frontend, WebGL & 3D Interactive', 30),
    ('018d9f10-7000-7000-8000-000000000040', 'Databases, Security & DevOps', 40);

INSERT INTO portfolio.skill_item (id, category_id, name, proficiency, years_of_experience, icon, sort_order, is_featured) VALUES
    ('018d9f10-7000-7000-8000-000000000101', '018d9f10-7000-7000-8000-000000000010', 'Java 21 LTS', 'Advanced', 3.0, 'Code2', 10, TRUE),
    ('018d9f10-7000-7000-8000-000000000102', '018d9f10-7000-7000-8000-000000000010', 'TypeScript', 'Advanced', 3.0, 'FileCode2', 20, TRUE),
    ('018d9f10-7000-7000-8000-000000000103', '018d9f10-7000-7000-8000-000000000010', 'Python', 'Proficient', 2.0, 'Terminal', 30, FALSE),
    ('018d9f10-7000-7000-8000-000000000104', '018d9f10-7000-7000-8000-000000000010', 'SQL', 'Advanced', 3.0, 'Database', 40, TRUE),

    ('018d9f10-7000-7000-8000-000000000105', '018d9f10-7000-7000-8000-000000000020', 'Spring Boot 3', 'Advanced', 3.0, 'Server', 10, TRUE),
    ('018d9f10-7000-7000-8000-000000000106', '018d9f10-7000-7000-8000-000000000020', 'Spring Security & OAuth2', 'Advanced', 2.5, 'ShieldCheck', 20, TRUE),
    ('018d9f10-7000-7000-8000-000000000107', '018d9f10-7000-7000-8000-000000000020', 'RESTful Microservices & OpenAPI', 'Advanced', 3.0, 'Network', 30, FALSE),

    ('018d9f10-7000-7000-8000-000000000108', '018d9f10-7000-7000-8000-000000000030', 'React 19 & Next.js', 'Advanced', 3.0, 'Atom', 10, TRUE),
    ('018d9f10-7000-7000-8000-000000000109', '018d9f10-7000-7000-8000-000000000030', 'Three.js & WebGL Shaders', 'Proficient', 2.0, 'Boxes', 20, TRUE),
    ('018d9f10-7000-7000-8000-000000000110', '018d9f10-7000-7000-8000-000000000030', 'Tailwind CSS & CSS Tokens', 'Advanced', 3.0, 'Palette', 30, FALSE),

    ('018d9f10-7000-7000-8000-000000000111', '018d9f10-7000-7000-8000-000000000040', 'PostgreSQL & Flyway', 'Advanced', 3.0, 'Database', 10, TRUE),
    ('018d9f10-7000-7000-8000-000000000112', '018d9f10-7000-7000-8000-000000000040', 'Docker & Containerization', 'Proficient', 2.5, 'Container', 20, TRUE),
    ('018d9f10-7000-7000-8000-000000000113', '018d9f10-7000-7000-8000-000000000040', 'GitHub Actions CI/CD', 'Advanced', 2.5, 'Workflow', 30, FALSE);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Projects
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.project (
    id, slug, title, tagline, description, category, technologies, github_url, live_url, featured, sort_order, is_published
) VALUES (
    '018d9f10-7000-7000-8000-000000000201',
    'girish-identity-platform',
    'GIRISH Identity & Quantified-Self Platform',
    'Personal Identity Platform, Public Portfolio, and 3D Articulated Avatar Lobby.',
    'A high-performance monolithic platform engineered with Spring Boot 3, Java 21, React 19, Three.js 3D character engine, PostgreSQL, and zero-knowledge encrypted vault.',
    'Full-Stack',
    '["Java 21", "Spring Boot 3", "React 19", "Three.js", "PostgreSQL", "Docker", "Tailwind CSS"]',
    'https://github.com/girishgowdahr/Girish_Gowda_H_R',
    'http://localhost:5173',
    TRUE,
    10,
    TRUE
), (
    '018d9f10-7000-7000-8000-000000000202',
    'free-fire-avatar-engine',
    'Tactical 3D Free Fire Character Lobby',
    'Interactive 360-degree humanoid tactical character lobby with holographic stages and emote switcher.',
    'Browser-based WebGL/Three.js procedural avatar with real-time lighting, particle emitters, customizable neon armor skins, and accessible reduced-motion fallbacks.',
    '3D & Interactive',
    '["Three.js", "WebGL", "TypeScript", "React 19", "GLSL Shaders"]',
    'https://github.com/girishgowdahr/Girish_Gowda_H_R',
    'http://localhost:5173',
    TRUE,
    20,
    TRUE
), (
    '018d9f10-7000-7000-8000-000000000203',
    'zero-knowledge-secure-vault',
    'Zero-Knowledge Client Encrypted Vault',
    'End-to-end client-side encryption subsystem with XChaCha20-Poly1305 and Argon2id key derivation.',
    'Cryptographic storage module ensuring zero server-side exposure of plaintext secrets, credentials, or personal documents.',
    'Cloud & Security',
    '["Cryptography", "Libsodium", "Argon2id", "Spring Boot", "TypeScript"]',
    'https://github.com/girishgowdahr/Girish_Gowda_H_R',
    NULL,
    TRUE,
    30,
    TRUE
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Experience
-- Note: Synthetic placeholder records marked per operating rules
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.experience (
    id, role_title, company_name, employment_type, location, start_date, end_date, is_current, description, highlights, technologies, sort_order, is_published
) VALUES (
    '018d9f10-7000-7000-8000-000000000301',
    'Software Engineer',
    'Enterprise Cloud Systems [SYNTHETIC PLACEHOLDER - Owner to confirm organization]',
    'Full-time',
    'Bengaluru, India',
    '2023-01-01',
    NULL,
    TRUE,
    'Architecting and developing mission-critical distributed backend services, high-throughput microservices, and interactive web client portals.',
    '["Designed and deployed resilient Spring Boot microservices serving high-concurrency workloads", "Engineered responsive modern web client interfaces with React, TypeScript, and state synchronization", "Established comprehensive CI/CD pipelines, automated testing, and security scanning with GitHub Actions"]',
    '["Java", "Spring Boot", "PostgreSQL", "Docker", "TypeScript", "React"]',
    10,
    TRUE
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Education
-- Note: Synthetic placeholder records marked per operating rules
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.education (
    id, institution, degree, field_of_study, start_year, end_year, grade_or_gpa, description, sort_order, is_published
) VALUES (
    '018d9f10-7000-7000-8000-000000000401',
    'Visvesvaraya Technological University [SYNTHETIC PLACEHOLDER - Owner to confirm institution]',
    'Bachelor of Engineering (B.E.)',
    'Computer Science and Engineering',
    2019,
    2023,
    'First Class with Distinction',
    'Specialized in Software Engineering, Data Structures & Algorithms, Distributed Systems, Database Management Systems, and Cloud Architectures.',
    10,
    TRUE
);

-- ----------------------------------------------------------------------------
-- Baseline Seed Data: Certifications
-- ----------------------------------------------------------------------------
INSERT INTO portfolio.certificate (
    id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, sort_order, is_published
) VALUES (
    '018d9f10-7000-7000-8000-000000000501',
    'Oracle Certified Professional: Java SE Developer',
    'Oracle [SYNTHETIC PLACEHOLDER - Owner to confirm certificate]',
    '2023-08-15',
    NULL,
    'OCP-JAVA-21-SYNTHETIC',
    'https://catalog-education.oracle.com',
    10,
    TRUE
);
