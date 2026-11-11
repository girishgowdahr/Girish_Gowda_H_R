## Task Description

<!-- State the phase and task ID (e.g., Phase 1, Task 1.1) and summary of objective -->

## Change Report Summary

- **Objective:**
- **Files Created:**
- **Files Modified:**
- **Key Decisions (and why):**
- **Commands to Run:**
- **Tests Executed & Results:**
- **Security Implications:**
- **Known Limitations:**
- **Needs Owner Review:** (yes/no + what)
- **Next Suggested Task:**

## Security Checklist

- [ ] Zero secrets (no passwords, tokens, private keys, OTPs, recovery codes) in code, config, tests, or documentation.
- [ ] No invented personal data (all placeholder records explicitly marked with `SYNTHETIC`).
- [ ] Public/Private separation respected (public endpoints read published DTOs only; no entity serialization).
- [ ] Backend enforces authorization on all private endpoints (no reliance on frontend route guards).
- [ ] Sensitive/protected paths (`security/`, `vault/`, `config/`, migrations) flagged for owner review.
- [ ] All unit, integration, and security scans passed locally.
- [ ] Change report saved to `docs/changes/YYYY-MM-DD-<task>.md`.
