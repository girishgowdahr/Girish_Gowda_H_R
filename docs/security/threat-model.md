# Threat Model (STRIDE)

Refer to `docs/04_SECURITY_SPECIFICATION.md` for the complete threat model and residual risk analysis.

## Key Threat Categories & Controls
1. **Spoofing:** Mitigated by Argon2id password hashing, mandatory TOTP/WebAuthn MFA, and session rotation.
2. **Tampering:** Mitigated by CSRF tokens, strict CSP, parameter validation, and client-side AEAD tags.
3. **Repudiation:** Mitigated by append-only audit logging for all authentication and administrative actions.
4. **Information Disclosure:** Mitigated by separate public DTOs, PostgreSQL Row-Level Security, and client-side encryption for vault items.
5. **Denial of Service:** Mitigated by rate limiting, payload size constraints, and CDN edge caching.
6. **Elevation of Privilege:** Mitigated by `@PreAuthorize`, service-layer ownership checks, and absence of public registration.
