# ADR 0003: PostgreSQL Schema Isolation and Flyway Migration Strategy

- **Status:** Accepted
- **Date:** 2026-11-12
- **Author:** Antigravity (Pair Programming Assistant)
- **Deciders:** Owner

## Context

Phase 1, Task 1.3 requires establishing the database foundation for the GIRISH platform. The architecture mandates:
1. Strict modular domain boundaries across `core`, `portfolio`, `personal`, `media`, `vault`, and `audit`.
2. Schema-based isolation in PostgreSQL rather than separate database instances to minimize hosting costs while ensuring strong authorization (RLS) and backup portability.
3. Version-controlled, reproducible migrations with zero manual schema mutations.
4. Support for both containerized integration testing (Testcontainers with PostgreSQL 16) and environments where Docker may be unavailable (such as local lightweight developer setups).

## Decision

1. **PostgreSQL 16+ as Primary Database:** Use PostgreSQL with time-ordered UUIDv7/UUID primary keys, UTC `timestamptz`, and JSONB data types.
2. **PostgreSQL Schema Isolation:** Separate tables into dedicated database schemas (`core`, `portfolio`, `personal`, `media`, `vault`, `audit`). Baseline Task 1.3 establishes `core` schema containing:
   - `core.app_user`: Platform owner identity.
   - `core.auth_credential`: Multi-factor credentials (Argon2id, TOTP, WebAuthn).
   - `core.session`: Revocable server sessions with SHA-256 token hashing.
   - `core.avatar_theme`: 3D lobby stage visual configurations and Free Fire character aesthetic profiles.
   - `core.module_state`: Runtime extensible module registry state.
3. **Flyway Migration Strategy:**
   - Migrations are structured under `classpath:db/migration/<module>/` (starting with `core/V1__core_baseline_schema.sql`).
   - Default migration schema set to `core`.
   - Seed data for default avatar themes and foundational module states is versioned and reproducible.
4. **Dual-Tier Testing Harness:**
   - Standard integration test suite uses Spring Boot Data JPA + Flyway against in-memory PostgreSQL-compatible database to ensure fast, deterministic tests without requiring external daemons.
   - Testcontainers integration test (`PostgresFlywayMigrationIntegrationTest`) runs against official `postgres:16-alpine` container, automatically guarded by `@EnabledIf("isDockerAvailable")` when Docker is present in CI or local environments.

## Consequences

### Positive
- Strict separation of concerns at the database layer.
- Fast, non-flaky automated testing on any development machine.
- Seamless compatibility with containerized CI pipelines.
- Zero secrets hardcoded in migration scripts or configuration files.

### Negative / Trade-offs
- Cross-schema foreign keys must be explicitly documented and managed.
- JSON/JSONB columns mapped to JPA entities require Hibernate 6 `@JdbcTypeCode(SqlTypes.JSON)` annotations.

## Compliance & Verification
- Flyway migrations validated via `FlywayCoreMigrationTest` (`mvn test`).
- JPA entity mappings validated via Hibernate `ddl-auto: validate`.
- Architectural module boundaries validated via `ModuleBoundaryArchTest`.
