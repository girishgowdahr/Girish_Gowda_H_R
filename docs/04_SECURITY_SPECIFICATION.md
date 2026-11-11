# 04 — GIRISH Security Specification

**Status:** Draft for owner review. The vault cryptography **must be reviewed by a qualified security professional before real confidential documents are stored.** This document describes realistic protections and their limits. It does **not** promise perfect or "1000%" security.

---

## 1. Security objectives and non-goals

**Objectives**
1. Anonymous visitors can see only explicitly published content.
2. Only the authenticated owner can reach private data.
3. Vault contents stay confidential even if the database, object storage or a backup is stolen.
4. The owner can change credentials, revoke sessions/devices and recover access through a documented process.
5. Security-relevant actions are auditable and alert the owner.
6. The system is recoverable (tested backups) and portable.

**Non-goals / honest limits**
- Cannot protect vault data from a **compromised owner device** (malware, keylogger) or a **malicious script served to the browser** (see R3).
- Cannot guarantee availability on free hosting.
- Cannot make a forgotten Master Key + lost Recovery Key recoverable — by design.
- Not a substitute for an independent audit/penetration test.

---

## 2. Assets and classification

| Class | Examples | Protection |
|-------|----------|------------|
| **C0 Public** | Published profile, projects, selected certificates, resume | Integrity (no tampering), availability |
| **C1 Private** | Fitness logs, study/career trackers, journal, goals, private media | AuthN/Z, TLS, encryption at rest (provider), RLS, audit |
| **C2 Vault** | ID documents, confidential records, private photos/notes chosen by owner | **Client-side encryption**, step-up auth, separate bucket, audit |
| **C3 Secrets** | Passwords, Master Key, Recovery Key, TOTP secrets, session tokens, server keys | Never stored in plaintext; hashed/wrapped; never logged |

---

## 3. Trust boundaries

- Internet ↔ Edge (TLS, rate limits, headers).
- Browser ↔ API (cookie sessions, CSRF protection, strict authorization).
- API ↔ Data (Postgres RLS, least privilege DB roles).
- **Vault plaintext boundary**: The server never receives or handles vault plaintext or Master Key.
- Primary ↔ Backup: Encrypted backups stored in separate accounts.

---

## 4. Threat model (STRIDE-oriented summary)

- Mitigation for credential stuffing: Argon2id, progressive delays, lockout, rate limiting, mandatory MFA.
- Mitigation for session hijacking: `HttpOnly`, `Secure`, `SameSite=Strict` cookies, short idle timeout, session rotation, CSRF synchronizer tokens.
- Mitigation for XSS: Strict CSP, output encoding, sanitized Markdown, isolated crypto Web Worker for vault.
- Mitigation for IDOR/BOLA: Three-layer ownership checks (service, repository filter, PostgreSQL Row-Level Security).
- Mitigation for data leaks: Dedicated public DTOs that project published data only; no entity serialization.

---

## 5. Authentication and session design

- Single owner account provisioned once via one-time bootstrap token.
- Password hashing using **Argon2id** (tuned parameters, memory-hard).
- Mandatory second factor: TOTP (RFC 6238) and/or WebAuthn passkeys. TOTP secrets encrypted at rest.
- Account recovery codes (10 single-use, offline) for account login recovery only — **cannot** decrypt vault.
- Opaque random session tokens in cookies (`__Host-` prefixed, `HttpOnly`, `Secure`, `SameSite=Strict`).
- Step-up authentication required for high-risk actions (password changes, vault unlock, exporting, MFA management).

---

## 6. Master Key and vault cryptography

- **Master Key** is known only to the owner; never transmitted to the server.
- Key Derivation: Argon2id derives Key Encryption Key (KEK) from Master Key.
- Key Wrapping: KEK wraps the random 256-bit Vault Key (VK).
- Content Encryption: XChaCha20-Poly1305 (or AES-256-GCM) with unique random DEKs per file.
- Recovery Key: Separate offline random 256-bit key wrapping the VK as a break-glass mechanism.
- Loss of both Master Key and Recovery Key results in permanent, unrecoverable vault loss.

---

## 7. Application hardening & security headers

- Strict Content-Security-Policy (CSP) denying unsafe-inline and third-party scripts.
- HSTS (`max-age=63072000; includeSubDomains; preload`).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- MIME magic-byte validation, EXIF metadata stripping (GPS) for uploaded media.
- Append-only audit logging for security events (logins, MFA, vault unlock, export, delete).
