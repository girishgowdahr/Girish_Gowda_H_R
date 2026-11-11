# 03 — GIRISH Project Structure

**Status:** Draft for owner review.
Companion to `02_TECHNICAL_IMPLEMENTATION.md`.

## 1. Repository strategy

**Monorepo** (single private GitHub repository) so frontend, backend, infrastructure, docs and asset metadata version together. Large binary 3D sources (`.blend`, raw textures) go in **Git LFS** or a separate private storage location; only optimised, licence-recorded GLB assets are committed or published.

Rules:
- No secrets, real personal data, real documents, or real photographs in the repo — ever.
- `.env.example` files list variable *names* only.
- Sample/seed data is clearly synthetic (labelled `SYNTHETIC`).

## 2. Top-level layout

```text
girish/
├── README.md
├── LICENSE                         # decision pending (private/all-rights-reserved vs open source)
├── .gitignore
├── .gitattributes                  # Git LFS rules for .blend/.psd/raw textures
├── .editorconfig
├── .github/
│   ├── workflows/                  # ci-frontend.yml, ci-backend.yml, security.yml, deploy.yml
│   ├── dependabot.yml
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md    # includes security + change-report checklist
├── docs/                           # all specifications and runbooks (see §6)
├── frontend/                       # React + TypeScript SPA (see §3)
├── backend/                        # Spring Boot modular monolith (see §4)
├── infrastructure/                 # Docker, IaC, backup scripts (see §5)
├── assets-source/                  # 3D/2D sources & pipeline scripts (see §7)
├── scripts/                        # dev helpers (setup, lint, verify)
└── tools/                          # custom CLIs (export validator, restore drill)
```

## 3. Frontend (`frontend/`)

```text
frontend/
├── package.json / package-lock.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js / .prettierrc
├── index.html
├── public/
│   ├── assets/
│   │   ├── avatar/v1/
│   │   ├── scenes/v1/
│   │   └── fallback/
│   └── robots.txt, security.txt
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers/
│   │   └── guards/
│   ├── core/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── registry/
│   │   ├── capabilities/
│   │   ├── config/
│   │   └── utils/
│   ├── design-system/
│   │   ├── tokens/
│   │   ├── components/
│   │   └── layouts/
│   ├── scene3d/
│   │   ├── Canvas.tsx
│   │   ├── avatar/
│   │   ├── scenes/
│   │   ├── tiers/
│   │   ├── fallback/
│   │   └── theme-schema.ts
│   ├── modules/
│   │   ├── _template/
│   │   ├── lobby/
│   │   ├── about/
│   │   ├── education/
│   │   ├── skills/
│   │   ├── projects/
│   │   ├── publications/
│   │   ├── achievements/
│   │   ├── certificates/
│   │   ├── activities/
│   │   ├── experience/
│   │   ├── fitness/
│   │   ├── study/
│   │   ├── journal/
│   │   ├── goals/
│   │   ├── media/
│   │   ├── vault/
│   │   └── admin/
│   ├── i18n/
│   └── styles/
├── tests/
│   ├── e2e/
│   ├── a11y/
│   └── visual/
└── README.md
```

## 4. Backend (`backend/`)

```text
backend/
├── pom.xml
├── mvnw / gradlew
├── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/com/girish/
│   │   │   ├── GirishApplication.java
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── security/
│   │   │   ├── registry/
│   │   │   ├── avatar/
│   │   │   ├── portfolio/
│   │   │   ├── personal/
│   │   │   ├── media/
│   │   │   ├── storage/
│   │   │   ├── vault/
│   │   │   ├── audit/
│   │   │   ├── exportbackup/
│   │   │   └── notifications/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-local.yml
│   │       ├── application-prod.yml
│   │       ├── db/migration/
│   │       ├── schemas/
│   │       └── manifests/
│   └── test/
│       └── java/com/girish/
│           ├── architecture/
│           ├── security/
│           ├── <module>/
│           └── migration/
└── README.md
```

## 5. Infrastructure (`infrastructure/`)

```text
infrastructure/
├── docker/
│   ├── docker-compose.local.yml
│   ├── docker-compose.staging.yml
│   └── nginx/
├── backup/
│   ├── backup-db.sh
│   ├── backup-objects.sh
│   ├── restore-db.sh
│   ├── restore-drill.md
│   └── retention-policy.md
├── iac/
├── monitoring/
│   └── uptime-and-alert-rules.md
└── env/
    ├── .env.example
    └── README.md
```

## 6. Documentation (`docs/`)

```text
docs/
├── 01_MASTER_PROJECT_SPECIFICATION.md
├── 02_TECHNICAL_IMPLEMENTATION.md
├── 03_PROJECT_STRUCTURE.md
├── 04_SECURITY_SPECIFICATION.md
├── 05_DEVELOPMENT_ROADMAP.md
├── adr/
├── api/
├── data/
├── operations/
├── security/
├── product/
│   ├── content-inventory.md
│   ├── module-catalogue.md
│   └── accessibility-statement.md
├── testing/
└── changes/
    └── YYYY-MM-DD-task-name.md
```

## 7. Assets (`assets-source/`)

```text
assets-source/
├── README.md
├── avatar/
├── scenes/
├── catalogue/
│   └── assets.json
├── pipeline/
└── NOT_ALLOWED.md
```

## 8. Naming and conventions

- Branches: `main` (protected), `feature/<phase>-<task>`, `fix/...`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `security:`).
- Java packages: `com.girish.<module>.<layer>`.
- DB: `snake_case`, schemas per domain, Flyway migrations `V<N>__<module>_<desc>.sql`.
- API: `/api/v1/<kebab-case>`, JSON `camelCase`.
- Frontend: `PascalCase` components, `camelCase` hooks (`useX`), `kebab-case` directories.
