# ADR 0001: Adoption of Monorepo and Modular Monolith Architecture

- **Status:** Accepted (Provisional Default)
- **Date:** 2026-11-12
- **Author:** Antigravity (Pair Programming Assistant)
- **Deciders:** Owner

## Context

GIRISH requires a cohesive personal platform encompassing a public portfolio, private dashboard, secure vault, and 3D avatar experience. We need an architecture that allows adding modules over years without microservices operational overhead or multi-repo coordination friction.

## Decision

1. Use a single Git monorepo containing `frontend/`, `backend/`, `infrastructure/`, `docs/`, and `assets-source/`.
2. Implement the backend as a Spring Boot modular monolith with clear package boundaries (`com.girish.<module>`) and dedicated public vs. private DTOs, enforced via ArchUnit.
3. Implement the frontend as a React 19 + TypeScript SPA using Vite.

## Consequences

### Positive
- Single atomic commits across docs, backend, frontend, and infrastructure.
- Zero distributed system overhead (no network serialization between services, simpler transactions).
- Independent modular growth with strong compile-time and architectural boundary guarantees.

### Negative / Trade-offs
- JVM memory footprint requires appropriate hosting tiers.
- Careful dependency management needed so modules do not couple internally.

## Compliance & Verification
- Monorepo structure validated in Phase 1 Task 1.1.
- ArchUnit boundary tests will enforce inter-module decoupling starting in Phase 1 Task 1.2 / 1.6.
