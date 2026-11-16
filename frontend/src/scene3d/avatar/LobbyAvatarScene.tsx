// frontend/src/scene3d/avatar/LobbyAvatarScene.tsx
// AAA Battle Royale 3D Game Lobby Experience
// Central 3D Character (360° rotation, tilt, zoom, PBR lighting & shadows)
// Floating Holographic Portfolio Category Panels with Real-time 3D Environment Morphing

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Play,
  Pause,
  ExternalLink,
  Download,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';
import { loadAvatarModel, AvatarLoadResult } from './CharacterModel';

// =============================================================================
// Category & Environment Configuration Types
// =============================================================================

export type LobbyCategory =
  | 'professional'
  | 'personal'
  | 'academic'
  | 'achievements'
  | 'official'
  | 'projects';

export interface CategoryItem {
  name: string;
  targetUrl: string;
  isDownload?: boolean;
  downloadFilename?: string;
  isExternal?: boolean;
  description: string;
  highlight?: string;
}

export interface CategoryConfig {
  id: LobbyCategory;
  code: string;
  title: string;
  subtitle: string;
  environmentName: string;
  themeColor: string;
  themeColorNum: number;
  secondaryColorNum: number;
  fogColorNum: number;
  tagline: string;
  items: CategoryItem[];
}

export const LOBBY_CATEGORIES: CategoryConfig[] = [
  {
    id: 'professional',
    code: '01',
    title: 'PROFESSIONAL',
    subtitle: 'CAREER & ENTERPRISE ARCHITECTURE',
    environmentName: 'FUTURISTIC TECH OFFICE // CORPORATE COMMAND',
    themeColor: '#f59e0b',
    themeColorNum: 0xf59e0b,
    secondaryColorNum: 0xd97706,
    fogColorNum: 0x0a0d17,
    tagline: 'Enterprise Systems, Production Microservices & Verified Track Record',
    items: [
      {
        name: 'Resume Document',
        targetUrl: '/api/v1/public/portfolio/resume',
        isDownload: true,
        downloadFilename: 'Girish_Gowda_H_R_Resume.md',
        description: 'Official recruiter resume markdown document',
        highlight: 'DOWNLOAD',
      },
      {
        name: 'Technical Skills',
        targetUrl: '/skills',
        description: 'Java 21, Spring Boot, SQL, PostgreSQL, React, Three.js',
        highlight: '35 CAPABILITIES',
      },
      {
        name: 'Work Experience',
        targetUrl: '/experience',
        description: 'University Hire Software Engineer candidate & track record',
        highlight: 'VERIFIED',
      },
      {
        name: 'Certifications',
        targetUrl: '/about#certs',
        description: 'Certified Fitness Trainer (IISDT) & Cyber Security (Reva)',
        highlight: 'CREDENTIALS',
      },
    ],
  },
  {
    id: 'personal',
    code: '02',
    title: 'PERSONAL',
    subtitle: 'LIFESTYLE & QUANTIFIED SELF',
    environmentName: 'MODERN LIFESTYLE LAB // ATHLETIC DISCIPLINE',
    themeColor: '#10b981',
    themeColorNum: 0x10b981,
    secondaryColorNum: 0x059669,
    fogColorNum: 0x06120d,
    tagline: 'Quantified Self, Health Discipline, Personal Philosophy & Goals',
    items: [
      {
        name: 'About Me',
        targetUrl: '/about',
        description: 'Operator biography, background philosophy, and journey',
        highlight: 'BIOGRAPHY',
      },
      {
        name: 'Interests',
        targetUrl: '/about',
        description: 'Distributed persistence, 3D WebGL scenes, self-healing apps',
        highlight: 'SYSTEMS',
      },
      {
        name: 'Fitness Discipline',
        targetUrl: '/about',
        description: 'Consistent strength training, athletic conditioning & nutrition',
        highlight: 'IISDT TRAINER',
      },
      {
        name: 'Hobbies',
        targetUrl: '/about',
        description: 'High-performance computing, fitness conditioning & coding',
        highlight: 'PASSION',
      },
    ],
  },
  {
    id: 'academic',
    code: '03',
    title: 'ACADEMIC',
    subtitle: 'RESEARCH & HIGHER EDUCATION',
    environmentName: 'FUTURISTIC UNIVERSITY // KNOWLEDGE MATRIX',
    themeColor: '#3b82f6',
    themeColorNum: 0x3b82f6,
    secondaryColorNum: 0x1d4ed8,
    fogColorNum: 0x060d1d,
    tagline: 'Top-Tier MCA at RVCE, 8.91 CGPA BCA & Peer-Reviewed Research',
    items: [
      {
        name: 'Education',
        targetUrl: '/education',
        description: 'Master of Computer Applications at RV College of Engineering',
        highlight: 'RVCE (2025-27)',
      },
      {
        name: 'Research Paper',
        targetUrl: '/about#pubs',
        description: 'Digital Twin-Enabled Self-Healing Web Application research',
        highlight: 'PEER REVIEWED',
      },
      {
        name: 'Publications',
        targetUrl: '/about#pubs',
        description: 'IEEE Approved & Published scientific co-authored paper (2026)',
        highlight: 'IEEE 2026',
      },
      {
        name: 'Academic Projects',
        targetUrl: '/projects',
        description: 'Population Analysis in C & Digital Twin web application',
        highlight: 'FOUNDATIONAL',
      },
    ],
  },
  {
    id: 'achievements',
    code: '04',
    title: 'ACHIEVEMENTS',
    subtitle: 'AWARDS & DISTINCTIONS',
    environmentName: 'HALL OF HONORS // TROPHY & AWARDS VAULT',
    themeColor: '#fbbf24',
    themeColorNum: 0xfbbf24,
    secondaryColorNum: 0xd97706,
    fogColorNum: 0x120e06,
    tagline: 'Academic Honors, Published Research & Certified Fitness Milestone',
    items: [
      {
        name: 'Awards & Standing',
        targetUrl: '/about',
        description: 'Graduated BCA with 8.91 CGPA and top ranking',
        highlight: '8.91 CGPA',
      },
      {
        name: 'Certificates',
        targetUrl: '/about#certs',
        description: 'IISDT Fitness Trainer & Reva University Cyber Security',
        highlight: 'DUAL CREDENTIAL',
      },
      {
        name: 'Accomplishments',
        targetUrl: '/about#pubs',
        description: 'Published IEEE author, multi-tiered full-stack architecture',
        highlight: 'AUTHOR',
      },
    ],
  },
  {
    id: 'official',
    code: '05',
    title: 'OFFICIAL',
    subtitle: 'COMMAND TERMINAL & PROFILES',
    environmentName: 'EXECUTIVE BOUNDARY // VERIFIED CHANNELS',
    themeColor: '#a855f7',
    themeColorNum: 0xa855f7,
    secondaryColorNum: 0x7e22ce,
    fogColorNum: 0x0e0819,
    tagline: 'Direct Professional Profiles, Contact Gateways & Public Trust',
    items: [
      {
        name: 'Professional Profiles',
        targetUrl: 'https://github.com/girishgowdahr',
        isExternal: true,
        description: 'Verified GitHub & LinkedIn engineering profiles',
        highlight: 'GITHUB / LINKEDIN',
      },
      {
        name: 'Direct Contact',
        targetUrl: 'mailto:girishgowdahr07@gmail.com',
        isExternal: true,
        description: 'Direct inquiry for University Hire & Software Engineer roles',
        highlight: 'GMAIL',
      },
      {
        name: 'Public Documents',
        targetUrl: '/privacy',
        description: 'Zero-knowledge client-side encryption & privacy notice',
        highlight: 'PRIVACY NOTICE',
      },
    ],
  },
  {
    id: 'projects',
    code: '06',
    title: 'PROJECTS',
    subtitle: 'SYSTEMS & CODE REPOSITORIES',
    environmentName: 'TECHNOLOGY LABORATORY // HIGH-THROUGHPUT DEV LAB',
    themeColor: '#00f0ff',
    themeColorNum: 0x00f0ff,
    secondaryColorNum: 0x0891b2,
    fogColorNum: 0x040b18,
    tagline: 'Self-Healing Digital Twins, Microservices, 3D Engines & C Runtimes',
    items: [
      {
        name: 'Software Projects',
        targetUrl: '/projects',
        description: 'Spring Boot REST APIs, reactive React SPA, modular monolith',
        highlight: 'FULL STACK',
      },
      {
        name: 'IoT & Telemetry',
        targetUrl: '/projects',
        description: 'Digital Twin simulated sensor nodes & self-recovery loops',
        highlight: 'DIGITAL TWIN',
      },
      {
        name: 'AI/ML Projects',
        targetUrl: '/projects',
        description: 'Automated anomaly detection, predictive health monitoring',
        highlight: 'PREDICTIVE AI',
      },
    ],
  },
];

interface LobbyAvatarSceneProps {
  initialCategory?: LobbyCategory;
  onNavigate?: (url: string) => void;
}

export const LobbyAvatarScene: React.FC<LobbyAvatarSceneProps> = ({
  initialCategory = 'projects',
  onNavigate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Active Category & Environment State
  const [activeCategory, setActiveCategory] = useState<LobbyCategory>(initialCategory);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [selectedDossier, setSelectedDossier] = useState<CategoryConfig | null>(null);

  // Dynamic Base URL Resolution
  const baseUrl = useMemo(() => {
    return (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  }, []);

  const activeConfig = useMemo(() => {
    return LOBBY_CATEGORIES.find((c) => c.id === activeCategory) || LOBBY_CATEGORIES[5];
  }, [activeCategory]);

  // Handle Navigation
  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: CategoryItem) => {
      if (item.isDownload) {
        // Allow default anchor download behavior
        return;
      }
      if (item.isExternal) {
        // Open external links
        window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (onNavigate) {
        onNavigate(item.targetUrl);
      } else {
        window.location.href = item.targetUrl;
      }
    },
    [onNavigate]
  );

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    controls.reset();
    controls.target.set(0, 0.95, 0);
  }, []);

  // Toggle Auto-Rotation
  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => {
      const next = !prev;
      if (controlsRef.current) {
        controlsRef.current.autoRotate = next;
      }
      return next;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Three.js 3D Lobby Engine & Interactive Orbit Stage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Renderer Setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.replaceChildren(renderer.domElement);

    // Scene & Fog Setup
    const scene = new THREE.Scene();
    const initialFogColor = new THREE.Color(activeConfig.fogColorNum);
    scene.fog = new THREE.FogExp2(initialFogColor, 0.05);
    renderer.setClearColor(initialFogColor, 1.0);

    // Camera Setup (Full Body Framing)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 3.4);

    // OrbitControls Setup (Requirement 1: 360° rotation, vertical angle, zoom, inertia)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false; // Keep character centered at all times
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.8;
    controls.minDistance = 2.0; // Zoom in limit
    controls.maxDistance = 5.2; // Zoom out limit
    controls.minPolarAngle = Math.PI * 0.28; // ~50° (view from slightly above)
    controls.maxPolarAngle = Math.PI * 0.51; // ~91° (at ground level, prevents floor clipping)
    controls.target.set(0, 0.95, 0); // Aim at character center of mass
    controls.saveState();
    controlsRef.current = controls;

    // Pause auto-rotation when user interacts with mouse or touch
    let userInteracting = false;
    let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

    const onPointerDown = () => {
      userInteracting = true;
      controls.autoRotate = false;
      clearTimeout(resumeTimeout);
    };

    const onPointerUp = () => {
      userInteracting = false;
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        if (!userInteracting && isAutoRotating) {
          controls.autoRotate = true;
        }
      }, 3500);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // -------------------------------------------------------------------------
    // Cinematic 3D Lighting Setup (Requirement 5)
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    keyLight.position.set(2.8, 4.8, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    fillLight.position.set(-3.2, 2.5, 2.0);
    scene.add(fillLight);

    // Rim Silhouette Light (Dynamically morphs with environment)
    const rimLight = new THREE.PointLight(activeConfig.themeColorNum, 6.0, 14);
    rimLight.position.set(-2.4, 3.2, -2.4);
    scene.add(rimLight);

    // Pedestal Underglow Light (Dynamically morphs with environment)
    const underglowLight = new THREE.PointLight(activeConfig.themeColorNum, 4.2, 5.0);
    underglowLight.position.set(0, 0.22, 0);
    scene.add(underglowLight);

    // -------------------------------------------------------------------------
    // 3D Battle Royale Holographic Pedestal (Requirement 1 & 5)
    // -------------------------------------------------------------------------
    const stageGroup = new THREE.Group();
    stageGroup.name = 'PedestalStage';

    // Dark brushed titanium pedestal base
    const baseGeo = new THREE.CylinderGeometry(1.65, 1.85, 0.18, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f17,
      roughness: 0.35,
      metalness: 0.9,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.09;
    baseMesh.receiveShadow = true;
    stageGroup.add(baseMesh);

    // Floor shadow receiver disc
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.55 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0.001;
    floorMesh.receiveShadow = true;
    stageGroup.add(floorMesh);

    // Outer neon energy torus ring
    const rimGeo = new THREE.TorusGeometry(1.66, 0.024, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: activeConfig.themeColorNum });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.01;
    stageGroup.add(rimMesh);

    // Inner rotating holographic compass/radar ring
    const ringGeo = new THREE.RingGeometry(0.75, 1.45, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: activeConfig.themeColorNum,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.02;
    stageGroup.add(ringMesh);

    // Concentric holographic ground runes
    const innerRingGeo = new THREE.RingGeometry(0.2, 0.65, 32);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: activeConfig.themeColorNum,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = 0.025;
    stageGroup.add(innerRingMesh);

    scene.add(stageGroup);

    // -------------------------------------------------------------------------
    // Background Environment Architecture (Requirement 4 & 5)
    // -------------------------------------------------------------------------
    const columnsGroup = new THREE.Group();
    columnsGroup.name = 'EnvironmentColumns';

    const colGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.0, 16);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.3,
      metalness: 0.85,
    });
    const stripGeo = new THREE.BoxGeometry(0.04, 5.5, 0.08);
    const stripMat = new THREE.MeshBasicMaterial({ color: activeConfig.themeColorNum });

    const columnPositions = [
      { x: -3.6, z: -2.8 },
      { x: 3.6, z: -2.8 },
      { x: -4.8, z: -4.4 },
      { x: 4.8, z: -4.4 },
    ];

    columnPositions.forEach((pos) => {
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(pos.x, 2.8, pos.z);

      const stripMesh = new THREE.Mesh(stripGeo, stripMat);
      stripMesh.position.set(pos.x, 2.8, pos.z + 0.11);

      columnsGroup.add(colMesh);
      columnsGroup.add(stripMesh);
    });

    scene.add(columnsGroup);

    // -------------------------------------------------------------------------
    // Floating Holographic Dust & Cyber Embers (Requirement 5)
    // -------------------------------------------------------------------------
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3.0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      velocities[i] = 0.004 + Math.random() * 0.012;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: activeConfig.themeColorNum,
      size: 0.042,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // -------------------------------------------------------------------------
    // Load Central 3D Human Avatar Character (Requirement 1)
    // -------------------------------------------------------------------------
    let avatarResult: AvatarLoadResult | null = null;
    let characterGroup: THREE.Group | null = null;

    loadAvatarModel(baseUrl, activeConfig.themeColorNum, (pct) => setLoadPercent(pct)).then(
      (result) => {
        avatarResult = result;
        characterGroup = result.group;
        scene.add(characterGroup);
        setModelLoaded(true);
      }
    );

    // -------------------------------------------------------------------------
    // Animation Loop with Real-Time Environment Lerping (Requirement 4)
    // -------------------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Target colors for environment interpolation
    const targetThemeColor = new THREE.Color(activeConfig.themeColorNum);
    const targetFogColor = new THREE.Color(activeConfig.fogColorNum);
    const currentThemeColor = new THREE.Color(activeConfig.themeColorNum);
    const currentFogColor = new THREE.Color(activeConfig.fogColorNum);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Smooth Environment Color Lerp
      currentThemeColor.lerp(targetThemeColor, 0.05);
      currentFogColor.lerp(targetFogColor, 0.05);

      rimLight.color.copy(currentThemeColor);
      underglowLight.color.copy(currentThemeColor);
      rimMat.color.copy(currentThemeColor);
      ringMat.color.copy(currentThemeColor);
      innerRingMat.color.copy(currentThemeColor);
      stripMat.color.copy(currentThemeColor);
      particleMat.color.copy(currentThemeColor);
      if (scene.fog) {
        scene.fog.color.copy(currentFogColor);
      }
      renderer.setClearColor(currentFogColor, 1.0);

      // Rotating Pedestal Rings
      ringMesh.rotation.z += 0.007;
      innerRingMesh.rotation.z -= 0.009;

      // Floating particles motion
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += velocities[i];
        if (posArray[i * 3 + 1] > 3.0) {
          posArray[i * 3 + 1] = 0.04;
        }
      }
      posAttr.needsUpdate = true;

      // Subtle breathing idle animation on character
      if (characterGroup) {
        const breath = Math.sin(elapsedTime * 2.2) * 0.006;
        characterGroup.position.y = breath;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 750;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store target color updates for category changes
    (mountRef.current as any).__updateEnvironment = (newCategory: CategoryConfig) => {
      targetThemeColor.set(newCategory.themeColorNum);
      targetFogColor.set(newCategory.fogColorNum);
    };

    // Clean Up
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resumeTimeout);

      if (avatarResult) {
        avatarResult.cleanUp();
      }

      renderer.dispose();
      baseGeo.dispose();
      rimGeo.dispose();
      ringGeo.dispose();
      innerRingGeo.dispose();
      colGeo.dispose();
      stripGeo.dispose();
      particleGeo.dispose();
    };
  }, [baseUrl, isAutoRotating]);

  // Trigger 3D Environment update when category changes
  useEffect(() => {
    if (mountRef.current && (mountRef.current as any).__updateEnvironment) {
      (mountRef.current as any).__updateEnvironment(activeConfig);
    }
  }, [activeConfig]);

  // Left & Right Flanking Category Panels
  const leftWingCategories = LOBBY_CATEGORIES.slice(0, 3);
  const rightWingCategories = LOBBY_CATEGORIES.slice(3, 6);

  return (
    <div style={lobbyViewportWrapperStyles(activeConfig.themeColor)}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        style={threeCanvasContainerStyles}
        role="region"
        aria-label="Interactive 3D Game Lobby Character Stage"
      />

      {/* Atmospheric Vignette & Subtle Scanlines */}
      <div style={cyberVignetteOverlayStyles} aria-hidden="true" />

      {/* Top Tactical HUD Header */}
      <header style={topHudHeaderStyles}>
        {/* Operator Profile Tag */}
        <div style={operatorIdentityCardStyles(activeConfig.themeColor)}>
          <div style={operatorLevelBadgeStyles(activeConfig.themeColor)}>LVL 99</div>
          <div style={operatorMetaColumnStyles}>
            <div style={operatorNameRowStyles}>
              <span style={operatorTitleStyles}>GIRISH GOWDA H R</span>
              <span style={verifiedPillStyles}>PRO OPERATIVE</span>
            </div>
            <div style={environmentIndicatorRowStyles}>
              <span style={activeDotStyles(activeConfig.themeColor)} />
              <span style={environmentNameTextStyles(activeConfig.themeColor)}>
                {activeConfig.environmentName}
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Controls & Quick Toggles */}
        <div style={topActionsRowStyles}>
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            style={tacticalIconButtonStyles(isAutoRotating, activeConfig.themeColor)}
            title={isAutoRotating ? 'Pause 360° Auto-Rotation' : 'Resume 360° Auto-Rotation'}
            aria-label="Toggle auto rotation"
          >
            {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
            <span style={btnLabelSpanStyles}>{isAutoRotating ? 'AUTO-SPIN: ON' : 'AUTO-SPIN: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            style={tacticalIconButtonStyles(false, activeConfig.themeColor)}
            title="Reset Camera to Front View"
            aria-label="Reset camera"
          >
            <RotateCcw size={14} />
            <span style={btnLabelSpanStyles}>RESET VIEW</span>
          </button>
        </div>
      </header>

      {/* Center 3D Interaction Prompt Bar */}
      <div style={centerInteractionHintStyles(activeConfig.themeColor)}>
        <Compass size={14} color={activeConfig.themeColor} />
        <span>DRAG TO ROTATE 360° · SCROLL TO ZOOM · CLICK CATEGORIES TO MORPH ENVIRONMENT</span>
      </div>

      {/* Desktop Floating Holographic Category Wings (Requirement 3) */}
      <nav style={floatingWingsContainerStyles} aria-label="Portfolio Lobby Categories">
        {/* Left Wing (01 Professional, 02 Personal, 03 Academic) */}
        <div style={leftWingColumnStyles}>
          {leftWingCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={holographicPanelStyles(isActive, cat.themeColor, 'left')}
                role="region"
                aria-label={`Category ${cat.title}`}
              >
                {/* Panel Header */}
                <div style={panelHeaderRowStyles}>
                  <div style={panelCodePillStyles(cat.themeColor)}>
                    <span>{cat.code}</span>
                  </div>
                  <div style={panelTitleColStyles}>
                    <h2 style={panelTitleTextStyles(cat.themeColor)}>{cat.title}</h2>
                    <span style={panelSubtitleTextStyles}>{cat.subtitle}</span>
                  </div>
                  {isActive && (
                    <span style={activeStatusPillStyles(cat.themeColor)}>
                      <Sparkles size={11} /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Sub-Items List */}
                <div style={subItemsListStyles}>
                  {cat.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.targetUrl}
                      download={item.isDownload ? item.downloadFilename : undefined}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleItemClick(e, item)}
                      style={subItemLinkStyles(isActive, cat.themeColor)}
                      title={item.description}
                    >
                      <span style={itemBulletStyles(cat.themeColor)}>›</span>
                      <span style={itemNameSpanStyles}>{item.name}</span>
                      {item.isDownload ? (
                        <Download size={12} color={cat.themeColor} />
                      ) : item.isExternal ? (
                        <ExternalLink size={12} color={cat.themeColor} />
                      ) : (
                        <ChevronRight size={12} color="var(--text-muted)" />
                      )}
                    </a>
                  ))}
                </div>

                {/* Dossier Quick View Trigger */}
                <div style={panelFooterActionStyles}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCategory(cat.id);
                      setSelectedDossier(cat);
                    }}
                    style={dossierTriggerBtnStyles(cat.themeColor)}
                  >
                    <span>OPEN TACTICAL DOSSIER</span>
                    <Maximize2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Wing (04 Achievements, 05 Official, 06 Projects) */}
        <div style={rightWingColumnStyles}>
          {rightWingCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={holographicPanelStyles(isActive, cat.themeColor, 'right')}
                role="region"
                aria-label={`Category ${cat.title}`}
              >
                {/* Panel Header */}
                <div style={panelHeaderRowStyles}>
                  <div style={panelCodePillStyles(cat.themeColor)}>
                    <span>{cat.code}</span>
                  </div>
                  <div style={panelTitleColStyles}>
                    <h2 style={panelTitleTextStyles(cat.themeColor)}>{cat.title}</h2>
                    <span style={panelSubtitleTextStyles}>{cat.subtitle}</span>
                  </div>
                  {isActive && (
                    <span style={activeStatusPillStyles(cat.themeColor)}>
                      <Sparkles size={11} /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Sub-Items List */}
                <div style={subItemsListStyles}>
                  {cat.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.targetUrl}
                      download={item.isDownload ? item.downloadFilename : undefined}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleItemClick(e, item)}
                      style={subItemLinkStyles(isActive, cat.themeColor)}
                      title={item.description}
                    >
                      <span style={itemBulletStyles(cat.themeColor)}>›</span>
                      <span style={itemNameSpanStyles}>{item.name}</span>
                      {item.isDownload ? (
                        <Download size={12} color={cat.themeColor} />
                      ) : item.isExternal ? (
                        <ExternalLink size={12} color={cat.themeColor} />
                      ) : (
                        <ChevronRight size={12} color="var(--text-muted)" />
                      )}
                    </a>
                  ))}
                </div>

                {/* Dossier Quick View Trigger */}
                <div style={panelFooterActionStyles}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCategory(cat.id);
                      setSelectedDossier(cat);
                    }}
                    style={dossierTriggerBtnStyles(cat.themeColor)}
                  >
                    <span>OPEN TACTICAL DOSSIER</span>
                    <Maximize2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Swipeable Category Dock (Requirement 6) */}
      <div style={mobileCategoryDockStyles}>
        {LOBBY_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedDossier(cat);
              }}
              style={mobileCategoryTabStyles(isActive, cat.themeColor)}
            >
              <span style={mobileTabCodeStyles}>{cat.code}</span>
              <span style={mobileTabTitleStyles}>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tactical Dossier Modal Dialog */}
      {selectedDossier && (
        <div style={modalBackdropStyles} onClick={() => setSelectedDossier(null)}>
          <div
            style={modalContentCardStyles(selectedDossier.themeColor)}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-title"
          >
            <div style={modalHeaderRowStyles}>
              <div style={modalHeaderMetaStyles}>
                <span style={panelCodePillStyles(selectedDossier.themeColor)}>
                  {selectedDossier.code}
                </span>
                <div>
                  <h3 id="dossier-title" style={panelTitleTextStyles(selectedDossier.themeColor)}>
                    {selectedDossier.title} // TACTICAL DOSSIER
                  </h3>
                  <p style={panelSubtitleTextStyles}>{selectedDossier.environmentName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                style={modalCloseBtnStyles}
                aria-label="Close dossier"
              >
                <X size={18} />
              </button>
            </div>

            <p style={dossierTaglineStyles}>{selectedDossier.tagline}</p>

            <div style={dossierItemsGridStyles}>
              {selectedDossier.items.map((item) => (
                <div key={item.name} style={dossierItemCardStyles}>
                  <div style={dossierItemHeaderStyles}>
                    <h4 style={dossierItemNameStyles}>{item.name}</h4>
                    {item.highlight && (
                      <span style={dossierItemBadgeStyles(selectedDossier.themeColor)}>
                        {item.highlight}
                      </span>
                    )}
                  </div>
                  <p style={dossierItemDescStyles}>{item.description}</p>
                  <a
                    href={item.targetUrl}
                    download={item.isDownload ? item.downloadFilename : undefined}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!item.isDownload && !item.isExternal) {
                        e.preventDefault();
                        setSelectedDossier(null);
                        if (onNavigate) onNavigate(item.targetUrl);
                        else window.location.href = item.targetUrl;
                      }
                    }}
                    style={dossierActionBtnStyles(selectedDossier.themeColor)}
                  >
                    <span>{item.isDownload ? 'Download File' : 'Open Section'}</span>
                    {item.isDownload ? <Download size={13} /> : <ExternalLink size={13} />}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Model Loading Indicator */}
      {!modelLoaded && (
        <div style={loaderOverlayStyles}>
          <div style={loaderSpinnerStyles(activeConfig.themeColor)} />
          <span style={loaderTextStyles}>INITIALIZING 3D ENGINE // {loadPercent}%</span>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Premium Responsive Styles
// =============================================================================

const lobbyViewportWrapperStyles = (glowColor: string): React.CSSProperties => ({
  position: 'relative',
  width: '100%',
  minHeight: '780px',
  height: '84vh',
  maxHeight: '940px',
  borderRadius: 'var(--radius-xl)',
  overflow: 'hidden',
  backgroundColor: '#05070c',
  border: `1px solid ${glowColor}33`,
  boxShadow: `0 12px 50px rgba(0, 0, 0, 0.95), 0 0 35px ${glowColor}25`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  userSelect: 'none',
});

const threeCanvasContainerStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  cursor: 'grab',
};

const cyberVignetteOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  pointerEvents: 'none',
  background:
    'radial-gradient(circle at 50% 50%, transparent 45%, rgba(5, 7, 12, 0.55) 75%, #05070c 100%)',
};

const topHudHeaderStyles: React.CSSProperties = {
  position: 'relative',
  zIndex: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.25rem 1.5rem',
  pointerEvents: 'none',
  flexWrap: 'wrap',
  gap: '1rem',
};

const operatorIdentityCardStyles = (themeColor: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  padding: '0.55rem 1.1rem',
  backgroundColor: 'rgba(8, 12, 22, 0.85)',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${themeColor}44`,
  borderRadius: 'var(--radius-lg)',
  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 16px ${themeColor}22`,
  pointerEvents: 'auto',
});

const operatorLevelBadgeStyles = (themeColor: string): React.CSSProperties => ({
  fontSize: '0.75rem',
  fontWeight: 900,
  letterSpacing: '0.08em',
  color: '#05070c',
  backgroundColor: themeColor,
  padding: '0.35rem 0.6rem',
  borderRadius: 'var(--radius-sm)',
  boxShadow: `0 0 12px ${themeColor}66`,
});

const operatorMetaColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
};

const operatorNameRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
};

const operatorTitleStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-primary)',
};

const verifiedPillStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#00f0ff',
  backgroundColor: 'rgba(0, 240, 255, 0.12)',
  padding: '0.15rem 0.45rem',
  borderRadius: '3px',
  border: '1px solid rgba(0, 240, 255, 0.3)',
};

const environmentIndicatorRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};

const activeDotStyles = (color: string): React.CSSProperties => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: `0 0 8px ${color}`,
});

const environmentNameTextStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.07em',
  color: color,
});

const topActionsRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  pointerEvents: 'auto',
};

const tacticalIconButtonStyles = (active: boolean, themeColor: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.74rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  padding: '0.5rem 0.85rem',
  borderRadius: 'var(--radius-md)',
  backgroundColor: active ? `${themeColor}22` : 'rgba(10, 14, 24, 0.85)',
  backdropFilter: 'blur(16px)',
  color: active ? themeColor : 'var(--text-secondary)',
  border: active ? `1px solid ${themeColor}` : '1px solid var(--border-subtle)',
  boxShadow: active ? `0 0 14px ${themeColor}44` : 'none',
  cursor: 'pointer',
  transition: 'all 200ms ease',
});

const btnLabelSpanStyles: React.CSSProperties = {
  display: 'inline-block',
};

const centerInteractionHintStyles = (themeColor: string): React.CSSProperties => ({
  position: 'absolute',
  bottom: '1.25rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(8, 12, 22, 0.85)',
  backdropFilter: 'blur(16px)',
  padding: '0.45rem 1.25rem',
  borderRadius: '999px',
  border: `1px solid ${themeColor}33`,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
});

const floatingWingsContainerStyles: React.CSSProperties = {
  position: 'absolute',
  inset: '5.5rem 1.5rem 3.5rem',
  zIndex: 3,
  display: 'flex',
  justifyContent: 'space-between',
  pointerEvents: 'none',
};

const leftWingColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  width: '320px',
  pointerEvents: 'none',
};

const rightWingColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  width: '320px',
  alignItems: 'flex-end',
  pointerEvents: 'none',
};

const holographicPanelStyles = (
  active: boolean,
  color: string,
  wing: 'left' | 'right'
): React.CSSProperties => ({
  width: '100%',
  maxWidth: '320px',
  backgroundColor: active ? 'rgba(12, 17, 30, 0.92)' : 'rgba(9, 13, 22, 0.72)',
  backdropFilter: 'blur(16px)',
  borderRadius: 'var(--radius-lg)',
  border: active ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.09)',
  boxShadow: active
    ? `0 10px 35px rgba(0, 0, 0, 0.8), 0 0 25px ${color}35`
    : '0 6px 20px rgba(0, 0, 0, 0.6)',
  padding: '0.85rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem',
  pointerEvents: 'auto',
  cursor: 'pointer',
  transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
  transform: active
    ? 'scale(1.02)'
    : wing === 'left'
    ? 'perspective(900px) rotateY(3deg)'
    : 'perspective(900px) rotateY(-3deg)',
});

const panelHeaderRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
};

const panelCodePillStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.72rem',
  fontWeight: 900,
  letterSpacing: '0.08em',
  color: '#05070c',
  backgroundColor: color,
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
});

const panelTitleColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const panelTitleTextStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.88rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: color,
  margin: 0,
});

const panelSubtitleTextStyles: React.CSSProperties = {
  fontSize: '0.66rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  letterSpacing: '0.04em',
};

const activeStatusPillStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.62rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: color,
  backgroundColor: `${color}18`,
  border: `1px solid ${color}44`,
  padding: '0.2rem 0.45rem',
  borderRadius: '3px',
});

const subItemsListStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const subItemLinkStyles = (active: boolean, color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
  backgroundColor: active ? `${color}10` : 'rgba(255, 255, 255, 0.02)',
  border: active ? `1px solid ${color}33` : '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.35rem 0.65rem',
  textDecoration: 'none',
  transition: 'all 180ms ease',
});

const itemBulletStyles = (color: string): React.CSSProperties => ({
  color: color,
  fontWeight: 900,
});

const itemNameSpanStyles: React.CSSProperties = {
  flex: 1,
};

const panelFooterActionStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '0.2rem',
};

const dossierTriggerBtnStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.64rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: color,
  backgroundColor: 'transparent',
  border: 'none',
  padding: '0.2rem 0.4rem',
  cursor: 'pointer',
});

// Mobile Category Dock (Requirement 6)
const mobileCategoryDockStyles: React.CSSProperties = {
  display: 'none',
  position: 'absolute',
  bottom: '1rem',
  left: '1rem',
  right: '1rem',
  zIndex: 4,
  overflowX: 'auto',
  gap: '0.5rem',
  padding: '0.5rem',
  backgroundColor: 'rgba(8, 12, 22, 0.92)',
  backdropFilter: 'blur(16px)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const mobileCategoryTabStyles = (active: boolean, color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 800,
  padding: '0.45rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? `${color}25` : 'rgba(255, 255, 255, 0.04)',
  color: active ? color : 'var(--text-secondary)',
  border: active ? `1px solid ${color}` : '1px solid var(--border-subtle)',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
});

const mobileTabCodeStyles: React.CSSProperties = {
  opacity: 0.65,
};

const mobileTabTitleStyles: React.CSSProperties = {
  fontWeight: 800,
};

// Tactical Dossier Modal Dialog
const modalBackdropStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  backgroundColor: 'rgba(4, 6, 12, 0.85)',
  backdropFilter: 'blur(18px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
};

const modalContentCardStyles = (color: string): React.CSSProperties => ({
  width: '100%',
  maxWidth: '680px',
  backgroundColor: '#0a0f1d',
  borderRadius: 'var(--radius-xl)',
  border: `1px solid ${color}`,
  boxShadow: `0 16px 60px rgba(0, 0, 0, 0.9), 0 0 35px ${color}33`,
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  maxHeight: '90vh',
  overflowY: 'auto',
});

const modalHeaderRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
};

const modalHeaderMetaStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
};

const modalCloseBtnStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  padding: '0.35rem',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
};

const dossierTaglineStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  margin: 0,
};

const dossierItemsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
};

const dossierItemCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  justifyContent: 'space-between',
};

const dossierItemHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '0.5rem',
};

const dossierItemNameStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  margin: 0,
};

const dossierItemBadgeStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.65rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: color,
  backgroundColor: `${color}18`,
  border: `1px solid ${color}44`,
  padding: '0.15rem 0.45rem',
  borderRadius: '3px',
  whiteSpace: 'nowrap',
});

const dossierItemDescStyles: React.CSSProperties = {
  fontSize: '0.78rem',
  color: 'var(--text-muted)',
  lineHeight: 1.45,
  margin: 0,
};

const dossierActionBtnStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.45rem',
  fontSize: '0.76rem',
  fontWeight: 700,
  color: '#05070c',
  backgroundColor: color,
  border: 'none',
  padding: '0.45rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  marginTop: '0.4rem',
  cursor: 'pointer',
  transition: 'transform 150ms ease',
});

const loaderOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '3rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'rgba(8, 12, 22, 0.92)',
  backdropFilter: 'blur(16px)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '999px',
};

const loaderSpinnerStyles = (color: string): React.CSSProperties => ({
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: `2px solid ${color}33`,
  borderTopColor: color,
  animation: 'spin 0.8s linear infinite',
});

const loaderTextStyles: React.CSSProperties = {
  fontSize: '0.74rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
};
