# Testing Strategy

## Test Pyramid & Tooling

| Level | Scope | Framework | Target Coverage / Gate |
|---|---|---|---|
| **Unit Tests** | Domain models, utilities, DTO mappers | JUnit 5 / Vitest | Business invariant checks |
| **Component Tests** | UI components, forms, validation | React Testing Library + Vitest | Accessible interactions |
| **Integration Tests** | Controllers, services, repositories | Spring Boot Test + Testcontainers | Real PostgreSQL DB queries |
| **Architecture Tests** | Module boundaries, public DTO isolation | ArchUnit | Fail build if boundaries breached |
| **Accessibility Tests** | Automated a11y scans | `@axe-core/playwright` | Zero WCAG AA violations |
| **End-to-End Tests** | Auth flows, publishing, fallbacks | Playwright | Desktop & mobile viewports |
| **Security Tests** | IDOR, rate limits, secret detection | Custom test suite + Gitleaks | Automated security gate |
