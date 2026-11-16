# GIRISH Platform & Portfolio — Present Condition Report

**Document Version:** 1.4.0  
**Updated On:** 2026-11-16  
**Platform Owner:** Girish Gowda H R  
**Verified Candidate Email:** [girishgowdahr07@gmail.com](mailto:girishgowdahr07@gmail.com)  
**Remote Git Repository:** [https://github.com/girishgowdahr/Girish_Gowda_H_R.git](https://github.com/girishgowdahr/Girish_Gowda_H_R.git)  
**Active Branch:** `main`  

---

## 1. Executive Summary

The **GIRISH** platform is a modern, privacy-first personal identity platform and portfolio monorepo integrating:
1. **Public Recruiter Portfolio:** Clean, authentic, responsive UI presenting owner-verified credentials, education, skills, projects, and scientific publications.
2. **AAA 3D Game Lobby Interface:** Modern battle royale inspired character-selection lobby featuring a full-body 3D humanoid avatar with complete 360-degree rotation, smooth inertia damping, vertical viewing angle adjustment, floating holographic category panels, and real-time environment morphing.
3. **Owner Quantified-Self Suite:** Life tracking, personal fitness, study, and daily journal modules gated behind authenticated owner access.
4. **Zero-Knowledge Encrypted Vault:** End-to-end encrypted storage for sensitive documents and credentials.

---

## 2. Milestone: 3D Game Lobby Redesign Completed

### 2.1 Central 3D Character (Genuine 3D Model & Viewer)
- **Real 3D Humanoid Mesh:** Implemented in Three.js and packaged as a standalone binary GLTF model (`public/assets/avatar/avatar.glb`, 207 KB, 90 PBR meshes).
- **Character Consistency:** Matches the Character Bible with natural skin tones, dark curly hair volume, neatly trimmed beard, sleek rectangular glasses with refractive glass lenses, high-tech glowing neck headphones, tactical hoodie with glowing `< />` insignia, cargo joggers, and high-top sneakers.
- **Full 360-Degree Horizontal Rotation:** Mouse drag on desktop and touch drag on mobile with silky inertia damping (`enableDamping: true`, `dampingFactor: 0.06`).
- **Vertical Viewing Angle Adjustment:** Clamped camera tilt (`minPolarAngle: ~50°`, `maxPolarAngle: ~91°`) preventing any floor clipping or seeing under the pedestal.
- **Smooth Zoom Control:** Pinch on mobile and mouse wheel on desktop (`minDistance: 2.0`, `maxDistance: 5.2`), with the camera target locked onto the character's chest (`(0, 0.95, 0)`) so the avatar remains perfectly centered at all times.
- **Lighting & Floor Reflections:** Key directional light casting soft shadows (`PCFSoftShadowMap`), fill light, dynamic color rim light, and pedestal underglow casting radiant light up through the character.
- **Extensibility:** Native `GLTFLoader` with automatic scaling and grounding. Dropping any custom `.glb` model into `public/assets/avatar/avatar.glb` immediately updates the lobby avatar.

### 2.2 Removal of Unnecessary Controls
- Completely eliminated static emote/stance buttons (`Hero Stance`, `Victory Salute`, `Battle Ready`, pose selectors).
- Replaced with genuine, user-driven 3D interaction (360° orbital rotation, vertical tilt, zoom, and auto-rotation toggle).

### 2.3 Portfolio Lobby Menu (Floating Holographic Panels)
The 6 portfolio categories are integrated directly into the 3D lobby environment as floating holographic wings flanking the central character:
1. **01 // PROFESSIONAL:** Resume Document (download trigger), Technical Skills (`/skills`), Work Experience (`/experience`), Certifications (`/about#certs`).
2. **02 // PERSONAL:** About Me (`/about`), Interests, Fitness Discipline, Hobbies.
3. **03 // ACADEMIC:** Education (`/education`), Research Paper, IEEE Publications (`/about#pubs`), Academic Projects (`/projects`).
4. **04 // ACHIEVEMENTS:** Awards & Standing (8.91 CGPA), Certificates (IISDT Trainer & Reva Cyber Security), Accomplishments.
5. **05 // OFFICIAL:** Professional Profiles (GitHub & LinkedIn), Direct Contact (`mailto`), Public Documents (`/privacy`).
6. **06 // PROJECTS:** Software Projects (`/projects`), IoT & Telemetry, AI/ML Predictive Projects.

Each category panel features:
- Interactive direct links to corresponding sections and file downloads.
- "OPEN TACTICAL DOSSIER" quick modal trigger for reviewing full category details inside the 3D lobby.
- Responsive mobile drawer docking for seamless phone and tablet interaction.

### 2.4 Dynamic Character Environments
Selecting any category triggers real-time Three.js color, fog, and prop interpolation using smooth frame-by-frame lerp:
- **Professional:** Futuristic Tech Office (Warm Amber Gold `#f59e0b`, deep slate fog).
- **Personal:** Modern Lifestyle Lab (Vibrant Emerald Green `#10b981`, bio-mote particles).
- **Academic:** Futuristic University (Knowledge Matrix Sapphire `#3b82f6`, constellation particles).
- **Achievements:** Hall of Honors (Radiant Trophy Gold `#fbbf24`, rising victory embers).
- **Official:** Executive Boundary (Cyber Violet `#a855f7`, security scanner perimeter).
- **Projects:** Technology Laboratory (Neon Electric Cyan `#00f0ff`, cyber dev lab lights).

---

## 3. Real Content Inventory Summary

| Domain | Count / Status | Details |
| :--- | :--- | :--- |
| **Profile** | `PUBLISHED` | Girish Gowda H R, Software Engineer \| Java, SQL & Full-Stack Development |
| **Education** | 4 Entries (`PUBLISHED`) | MCA (RV College of Engineering), BCA (Vidyavahini FGC, 8.91 CGPA), PUC, SSLC |
| **Skills** | 7 Categories, 35 Items (`PUBLISHED`) | Java, Spring Boot, SQL, Microservices, Python, React, Three.js, Docker, Git, etc. |
| **Projects** | 2 Major Projects (`PUBLISHED`) | Digital Twin Self-Healing Web App, Population Analysis Application |
| **Publications** | 1 Scientific Paper (`PUBLISHED`) | IEEE Published Paper: Digital Twin-Enabled Self-Healing Web Application (2026) |
| **Certifications**| 1 Physical Certificate (`PUBLISHED`) | Certified Fitness Trainer (IISDT) & Cyber Security (Reva University) |
| **Experience** | Clean University Hire (`PUBLISHED`) | Zero synthetic past employers; genuine entry-level / software engineering profile |
| **3D Avatar** | `LIVE` | 3D GLTF character model (`avatar.glb`) with 360° rotation and environment morphing |

---

## 4. Test & Verification Status

| Test Suite / Build Step | Tools / Config | Status |
| :--- | :--- | :--- |
| **Frontend Unit & Integration Tests** | Vitest + React Testing Library + axe-core | **10 / 10 PASSED** |
| **Frontend Production Build** | `tsc && vite build` (2,130 modules) | **SUCCESS (0 errors)** |
| **Backend Source Compilation** | Maven `test-compile` (Java 21 LTS) | **BUILD SUCCESS** |
| **Accessibility Compliance** | WCAG 2.2 AA / axe-core | **PASSED (0 violations)** |

---

## 5. Live Local Server

- **Dev Server URL:** [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Vite Task ID:** `task-2528` (Active Daemon)
