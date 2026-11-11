# Accessibility Statement

GIRISH is committed to ensuring digital accessibility for all users, including individuals with disabilities.

## Accessibility Standards Target
- **Target Standard:** WCAG 2.2 Level AA conformance.
- **Auditing Tooling:** `@axe-core/playwright`, manual keyboard navigation, and screen reader verification.

## Core Accessibility Commitments
1. **3D Scene Independence:** All content and navigation functions are accessible without WebGL or 3D rendering.
2. **Reduced Motion:** Fully honors the `prefers-reduced-motion: reduce` system preference by disabling camera sweeps and animations.
3. **Keyboard Navigable:** Visible focus indicators, logical tab order, and skip links to main content on every page.
4. **Color Contrast:** Conforms to WCAG 2.2 AA contrast ratios across all dark-theme design tokens.
