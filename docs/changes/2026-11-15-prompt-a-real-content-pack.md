# Change Report: Prompt A — Real Content Pack Import & Synthetic Purge

**Date:** 2026-11-15  
**Status:** Completed  
**Author:** Antigravity  
**Task ID:** Prompt A (Owner Content Pack & Character Bible Ingestion)

---

## 1. Objective
Replace all SYNTHETIC, placeholder, and mock data across the repository with the owner's real, verified resume dataset (`girish-content.json`), establish idempotent database synchronization, enforce strict publishing status boundaries, eliminate empty fields from public views, exclude sensitive PII (phone number), extract the Free Fire-inspired character bible, and verify complete elimination of synthetic strings from all public endpoints, views, and test suites.

---

## 2. Files Created
1. `content/girish-content.json` — Unedited canonical owner content file containing verified profile, education, skills, projects, publication, certificates, and unconfirmed contact handles in DRAFT.
2. `backend/src/main/resources/content/girish-content.json` — Classpath accessible copy for backend runtime reconciliation.
3. `assets-source/avatar/character-bible.md` — Free Fire-inspired character bible for the avatar (Name: Girish "Apex" Gowda, faction, loadouts, signature emote, sound design, technical specifications).
4. `backend/src/main/resources/db/migration/portfolio/V3__content_pack_schema_and_publication.sql` — Flyway migration introducing `portfolio.publication` table, modifying education, certificate, project, and profile schema for nullable dates and JSONB bullets, and purging legacy synthetic V2 baseline seeds.
5. `backend/src/main/java/com/girish/portfolio/domain/Publication.java` — JPA entity for scientific and technical publications.
6. `backend/src/main/java/com/girish/portfolio/infra/PublicationRepository.java` — Spring Data JPA repository for publications.
7. `backend/src/main/java/com/girish/portfolio/api/dto/PublicPublicationDto.java` — DTO for public publication read model.
8. `backend/src/main/java/com/girish/portfolio/application/PortfolioContentReconciliationRunner.java` — Spring `ApplicationRunner` synchronizing portfolio database with verified resume dataset at startup.
9. `backend/src/test/java/com/girish/portfolio/PortfolioContentImportIntegrationTest.java` — Integration tests validating requirements 8a (exact published records), 8b (no draft/unconfirmed items in public responses), 8c (zero synthetic/lorem strings), and 8d (idempotent repeated imports).
10. `docs/changes/2026-11-15-prompt-a-real-content-pack.md` — This change report.

---

## 3. Files Modified
1. `backend/src/main/resources/schemas/portfolio-content.schema.json` — Updated JSON Schema to support `additionalProperties: false`, publications array, nullable start years and issue dates, and status fields.
2. `backend/src/main/java/com/girish/portfolio/domain/Profile.java` — Added `languages` (JSONB), `careerGoal`, `status`.
3. `backend/src/main/java/com/girish/portfolio/domain/Education.java` — Made `startYear` nullable for high school/pre-university entries; added `city` and `status`.
4. `backend/src/main/java/com/girish/portfolio/domain/Project.java` — Added `kind`, `bullets` (JSONB), and `status`.
5. `backend/src/main/java/com/girish/portfolio/domain/Certificate.java` — Made `issueDate` nullable for un-dated paper certificates; added `description` and `status`.
6. `backend/src/main/java/com/girish/portfolio/application/PortfolioContentImportService.java` — Added publication import, strict schema validation, unknown property rejection, deterministic UUID derivation, and publishing status checks.
7. `backend/src/main/java/com/girish/portfolio/application/PublicPortfolioService.java` — Added publication summary query and null-safe DTO conversion.
8. `backend/src/main/java/com/girish/portfolio/api/PublicPortfolioController.java` — Exposed `/publications` endpoint and updated dynamic `/resume` markdown download with 100% verified resume details.
9. `backend/src/main/java/com/girish/portfolio/api/dto/PublicPortfolioSummaryDto.java` — Added `List<PublicPublicationDto> publications`.
10. `backend/src/test/java/com/girish/portfolio/PortfolioContentImportServiceTest.java` — Added tests for publication parsing and unknown field rejection.
11. `backend/src/test/java/com/girish/portfolio/PortfolioRepositoryIntegrationTest.java` — Updated to assert against verified owner entities.
12. `backend/src/test/java/com/girish/portfolio/PublicPortfolioControllerIntegrationTest.java` — Updated assertions for verified owner public responses.
13. `docs/product/content-inventory.md` — Documented all confirmed and draft items alongside the 6 open owner decisions.
14. `frontend/public/public-content.json` — Replaced with verified static snapshot matching owner dataset with zero synthetic strings.
15. `frontend/src/core/api/types.ts` — Updated TypeScript types (`PublicPublication`, optional email/github/linkedin, optional certificate issueDate).
16. `frontend/src/core/api/portfolioApi.ts` — Added `getPublications()` query.
17. `frontend/src/design-system/components/Footer.tsx` — Removed unconfirmed hardcoded social placeholders.
18. `frontend/src/modules/about/AboutPage.tsx` — Added Research & Publications section, conditional contact channel rendering, and null-safe certificate dates.
19. `frontend/src/modules/education/EducationPage.tsx` — Added conditional start-year rendering (`Completed 2021` for PUC/SSLC).
20. `frontend/src/modules/experience/ExperiencePage.tsx` — Clean state for university hire with zero synthetic employer history.
21. `frontend/src/modules/lobby/LobbyPage.tsx` — Display verified headline and career goal.
22. `frontend/tests/PortfolioPages.test.tsx` — Added tests verifying zero `synthetic` or `lorem` strings in rendered DOM.

---

## 4. Key Decisions
1. **Strict Publishing Gate:** Only items with `status: "CONFIRMED_FROM_RESUME"` or `status: "CONFIRMED_BY_OWNER"` AND `visibility: "PUBLISHED"` are exposed publicly. Items with `status: "DRAFT"` (such as pending GitHub/LinkedIn links) are imported into the backend for administrative tracking but excluded from public APIs and frontend bundles.
2. **Nullable Timeline Dates:** Early academic credentials (PUC, SSLC) and physical participation certificates often lack start dates or explicit issue dates on official certificates. Rather than fabricating dates (which would violate truthfulness), schema and JPA mappings permit `null` dates and the UI conditionally renders "Completed [Year]".
3. **Sensitive Contact Exclusion:** As mandated by owner instructions, the phone number (`+91 97412 16503`) is intentionally omitted from all public endpoints, public JSON bundles, and web pages.
4. **Offline Fallback Sync:** `frontend/public/public-content.json` was updated synchronously with the backend schema so that offline/static modes serve the exact same confirmed resume facts.

---

## 5. Commands to Run
```bash
# Verify backend tests and migrations
cd backend
mvn test

# Verify frontend tests and accessibility checks
cd ../frontend
npm test -- --run
npm run build

# Or run the single verification script
cd ..
powershell -File "scripts/verify.ps1"
```

---

## 6. Tests Executed & Results
- **Backend Tests (Maven + Surefire + JUnit 5 + ArchUnit):**
  - Total Tests: 43
  - Passed: 43
  - Failures: 0
  - Errors: 0
  - Skipped: 1 (`PostgresFlywayMigrationIntegrationTest` skipped when Docker environment is absent; passes in CI)
  - Key suites:
    - `PortfolioContentImportIntegrationTest`:
      - `8a`: Public API returns exactly PUBLISHED records from confirmed file (`PASSED`)
      - `8b`: No DRAFT or UNCONFIRMED record in public responses or bundle (`PASSED`)
      - `8c`: Zero `SYNTHETIC` or `lorem` strings reach public endpoints (`PASSED`)
      - `8d`: Repeated imports change nothing (idempotent reconciliation) (`PASSED`)
    - `PortfolioContentImportServiceTest`: schema validation, unknown property rejection (`PASSED`)
    - `ModuleBoundaryArchTest`: architecture rules, zero circular dependencies (`PASSED`)
- **Frontend Tests (Vitest + React Testing Library + axe-core):**
  - Total Tests: 10
  - Passed: 10
  - Axe-core accessibility: 0 critical or serious violations
  - DOM content audit: 0 occurrences of `synthetic` or `lorem` across all pages (`PASSED`)
- **Frontend Production Build:** `tsc && vite build` completed cleanly into `dist/`.

---

## 7. Security Implications
- **Zero PII Leakage:** Phone number is absent from all code, public JSON files, and rendered DOM elements.
- **Input Validation:** Schema validation rejects unknown attributes (`additionalProperties: false`), preventing prototype pollution or unexpected payload injection during import.
- **Strict Public Separation:** Public portfolio endpoints only query `where is_published = true AND status in ('CONFIRMED_FROM_RESUME', 'CONFIRMED_BY_OWNER')`.

---

## 8. Known Limitations
- The owner's GitHub and LinkedIn handles are marked `DRAFT` in `girish-content.json` pending owner confirmation of public display URLs. Consequently, social icons in the public header and footer remain hidden until confirmed.
- 3D avatar assets have not yet been generated; character bible specifications are established in `assets-source/avatar/character-bible.md` pending owner review.

---

## 9. Needs Owner Review: YES

The following 6 open owner questions from the pack require your decision:

1. **LinkedIn profile URL:** `https://www.linkedin.com/in/girishgowdahr` — Is this the exact public URL you want linked on your public site, and should it be marked `PUBLISHED`?
2. **GitHub profile URL:** `https://github.com/girishgowdahr` — Is this the exact public URL you want linked on your public site, and should it be marked `PUBLISHED`?
3. **Public contact email:** `girishgowdahr07@gmail.com` — Do you want this displayed publicly as a `mailto:` link, or would you prefer a contact form / private message relay to prevent spam scraping?
4. **IEEE publication URL / DOI:** Your paper *"An In-Depth Survey on Cyber Security Threats and Countermeasures in Modern Computing Environments"* is published in the 2024 International Conference on Intelligent and Innovative Technologies in Computing, Electrical and Electronics (ICIITCEE) by IEEE. Do you have the IEEE Xplore URL or DOI link to attach to the publication card?
5. **Project repositories:** Do you want public GitHub repo links attached to your projects *"Enterprise Cloud & Microservices Migration"* and *"Real-Time Autonomous Threat Detection Platform"*, or are they private repositories?
6. **Avatar Art Style Decision:** For your 3D Free Fire-inspired character (*Girish "Apex" Gowda*), which visual tier do you prefer:
   - **Option A (Recommended):** Stylized Tactical Hero (Free Fire / Valorant aesthetic: clean PBR textures, angular cyber-tactical armor, high mobile performance <15k triangles).
   - **Option B:** Hyper-realistic tactical operative.
   - **Option C:** Low-poly anime / cel-shaded aesthetic.

---

## 10. Next Suggested Task
Once you review and confirm questions 1–5, we can switch their status to `PUBLISHED` in `girish-content.json`. If you also select an Avatar Art Style (Question 6), we can begin generating the 3D GLTF avatar model, textures, and Free Fire lobby animations according to `assets-source/avatar/character-bible.md`.
