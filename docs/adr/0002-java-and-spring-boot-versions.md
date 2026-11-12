# ADR 0002: Selection of Java 21 LTS and Spring Boot 3.4.x

- **Status:** Accepted
- **Date:** 2026-11-12
- **Author:** Antigravity (Pair Programming Assistant)
- **Deciders:** Owner

## Context

Phase 1, Task 1.2 requires verifying the environment tooling and pinning the Java LTS runtime and Spring Boot framework versions.
- Local system scan detected Java 21 LTS (Eclipse Adoptium Temurin 21.0.12).
- Java 25 LTS is not yet globally provisioned on this environment.
- Spring Boot 3.4.x (3.4.3) is the stable production-ready release line for Java 21 LTS, offering Spring Framework 6.2, Spring Security 6.4, Jackson, and full Springdoc OpenAPI 2.8.x integration.

## Decision

1. Adopt **Java 21 LTS** as the runtime baseline across the backend module.
2. Adopt **Spring Boot 3.4.3** with Spring Security, Spring Actuator, and Spring Validation.
3. Use **Springdoc OpenAPI 2.8.5** for OpenAPI 3 specifications and Swagger UI.
4. Use **ArchUnit 1.3.0** for architectural boundary enforcement.

## Consequences

### Positive
- Fully compatible with the local machine's installed OpenJDK 21 LTS runtime.
- Long-term vendor support (LTS) through 2029+.
- Seamless integration with Testcontainers and ArchUnit.

### Negative / Trade-offs
- Upgrading to Java 25 LTS will be performed in a future phase once Java 25 binaries and Spring Boot 4.0 are globally available in the deployment environment.

## Compliance & Verification
- Enforced via Maven `pom.xml` property `<java.version>21</java.version>`.
- Verified by automated unit and integration tests in Phase 1 Task 1.2 (`mvn test`).
