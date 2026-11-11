# GIRISH

> A modular, privacy-first personal identity platform, public portfolio, owner dashboard, and secure vault with an optional 3D avatar experience.

## Overview

GIRISH is structured as a monorepo containing:
- **Public Portfolio:** Recruiter- and visitor-facing view showing only explicitly published achievements, projects, skills, education, and credentials.
- **Private Dashboard:** Owner-only tracking for fitness, study sessions, journal entries, goals, and weekly reviews.
- **Secure Vault:** Dedicated boundary with client-side encryption (libsodium/WebCrypto) for confidential records and documents.
- **3D Identity Experience:** WebGL/Three.js/React Three Fiber avatar with theme-driven outfits and scenes; strictly optional with full 2D/accessible fallbacks.

## Monorepo Layout

```text
girish/
├── .github/          # CI/CD workflows, CODEOWNERS, PR templates, Dependabot
├── assets-source/    # 3D/2D source files, Blender pipelines, license records
├── backend/          # Spring Boot modular monolith (Java 21/25 LTS)
├── docs/             # Master architecture, security spec, ADRs, runbooks
├── frontend/         # React 19 + TypeScript + Vite SPA
├── infrastructure/   # Docker local stack, backup scripts, env templates
├── scripts/          # Developer tooling (setup, verify, lint)
└── tools/            # CLI utilities (export validation, restore drills)
```

## Quick Start (Pre-requisites)

- **Java:** JDK 21 LTS or 25 LTS
- **Node.js:** v20+ (Node v24 supported)
- **Git:** Git 2.40+ (Git LFS recommended for 3D assets)
- **Docker:** Optional for local development stack (PostgreSQL, MinIO, MailHog)

See `docs/03_PROJECT_STRUCTURE.md` and `docs/05_DEVELOPMENT_ROADMAP.md` for architecture and roadmap details.

## License

Decision pending (refer to `LICENSE` file). All original rights reserved by default.
