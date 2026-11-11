# 05 — GIRISH Development Roadmap

**Status:** Approved draft roadmap.

## 1. Operating Rules Summary
- One task at a time.
- Mandatory change report saved to `docs/changes/YYYY-MM-DD-<task>.md`.
- No invented personal data (strictly `SYNTHETIC` placeholders until owner confirms).
- Zero secrets in code, config, tests, or documentation.
- Every task requires automated tests passing before completion.

---

## 2. Phases

### Phase 0 — Requirements & Design (Completed / In Progress)
- 0.1 Review spec; produce docs 02–05
- 0.2 Owner answers open decisions
- 0.3 Content inventory (`docs/product/content-inventory.md`)
- 0.4 Hosting & domain selection
- 0.5 Visual direction sign-off
- 0.6 Avatar asset sourcing plan
- 0.7 Threat model sign-off

### Phase 1 — Foundation
- 1.1 Monorepo skeleton, git configuration, base docs, PR template, CODEOWNERS
- 1.2 Backend skeleton (Spring Boot, Actuator health, problem+json error format, OpenAPI)
- 1.3 PostgreSQL + Flyway baseline migration (`core` schema), Testcontainers test
- 1.4 Frontend skeleton (Vite, React 19, TypeScript, router, accessible design tokens)
- 1.5 Local Docker Compose (Postgres, MinIO, MailHog) + setup/verify scripts
- 1.6 CI workflow (lint, test, CodeQL, dependency audit, secret scan)
- 1.7 Structured logging with redaction + correlation IDs
- 1.8 Security headers & CSP baseline

### Phase 2 — Professional Portfolio (Public)
- 2.1 Module registry foundation (`module_state` reconciliation, manifest loader)
- 2.2 Portfolio schemas & migrations (profile, education, skills, projects, experience, certificates)
- 2.3 Public read model & public API (`/api/v1/public/*`) with dedicated public DTOs
- 2.4 Public UI (Home, About, Education, Skills, Projects, Publications, Certificates)
- 2.5 Resume download & social links
- 2.6 Content management seed/import tool (owner-supplied JSON with validation)
- 2.7 Static public-content bundle export
- 2.8 SEO, metadata, sitemap, privacy notice
- 2.9 First deployment (public portfolio)

### Phase 3 — 3D Lobby & Avatar
- 3.1 3D asset pipeline & licensing registry
- 3.2 Capability probe (Tier A/B/C selector, reduced-motion)
- 3.3 Accessible 2D/static fallback renderer
- 3.4 Base avatar & lobby scene loader
- 3.5 Outfit/pose/scene theme system (JSON Schema validated)
- 3.6 Transition animations & accessibility verification
- 3.7 Performance tuning against budget

### Phase 4 — Owner Authentication & Dashboard
- 4.1 Owner bootstrap (one-time provisioning)
- 4.2 Login: Argon2id, rate limiting, lockout
- 4.3 Sessions: Secure HttpOnly cookies, CSRF, rotation, revocation
- 4.4 MFA: TOTP enrollment & offline recovery codes
- 4.5 WebAuthn passkeys
- 4.6 Step-up authentication & security alerts
- 4.7 Authorization framework: PostgreSQL RLS + IDOR test harness
- 4.8 Append-only audit log
- 4.9 Admin control center (module registry editor, publish/unpublish)
- 4.10 Content authoring forms

### Phase 5 — Personal Modules
- 5.1 Media service (private storage, signed URLs, EXIF stripping)
- 5.2 Biodata module
- 5.3 Fitness module (workouts, exercises, measurements)
- 5.4 Study & career learning log
- 5.5 Journal & goals with full-text search
- 5.6 Milestones & weekly review views
- 5.7 Full data export (JSON/CSV + originals) & deletion workflow
- 5.8 Optional public fitness trainer profile

### Phase 6 — Secure Vault (Gated by Independent Review)
- 6.1 Threat model refresh & crypto specification
- 6.2 Vault schema & ciphertext storage
- 6.3 Client-side crypto module (libsodium worker)
- 6.4 Vault setup ceremony & Recovery Key confirmation
- 6.5 Vault unlock/auto-lock
- 6.6 Encrypted item management
- 6.7 Key rotation & recovery drills
- 6.8 Vault audit events
- 6.9 Restore drill
- 6.10 Security review & pen-test verification

### Phase 7 — Owner-Provided Avatar Photographs (Consent-Gated)
### Phase 8 — Long-Term Expansion & Extensibility
