import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Eye, Shield, Sparkles, Zap, Camera, Box } from 'lucide-react';

export type OutfitId = 'dev-hoodie' | 'gym' | 'formal-suit' | 'cyber-merc' | 'fitness-titan' | 'crimson-vanguard';
export type PoseId = 'ready' | 'victory' | 'guard';

interface LobbyAvatarSceneProps {
  outfit: OutfitId;
  pose: PoseId;
  onOutfitChange: (outfit: OutfitId) => void;
  onPoseChange: (pose: PoseId) => void;
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export const LobbyAvatarScene: React.FC<LobbyAvatarSceneProps> = ({
  outfit,
  pose,
  onOutfitChange,
  onPoseChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stageCardRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<'cinematic' | 'webgl3d'>('cinematic');
  const [imageTransitioning, setImageTransitioning] = useState(false);

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Resolve base path for public assets (supports both local and GitHub Pages)
  const baseUrl = useMemo(() => {
    return (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  }, []);

  // Normalize outfit IDs matching the Character Bible
  const normalizedOutfit: 'dev-hoodie' | 'formal-suit' | 'gym' = useMemo(() => {
    if (outfit === 'fitness-titan' || outfit === 'gym') return 'gym';
    if (outfit === 'crimson-vanguard' || outfit === 'formal-suit') return 'formal-suit';
    return 'dev-hoodie';
  }, [outfit]);

  const outfitConfigs = useMemo(() => ({
    'dev-hoodie': {
      name: 'Coding Operative (Dev Hoodie & Headphones)',
      badge: 'CODING OPERATIVE',
      subtitle: 'CYBERPUNK DEV LAB // ELITE OPERATIVE',
      image: `${baseUrl}/assets/avatar/coding-avatar.jpg`,
      accentHex: '#00f0ff',
      accentDim: 'rgba(0, 240, 255, 0.15)',
      accentGlow: 'rgba(0, 240, 255, 0.45)',
      lightColorNum: 0x00f0ff,
      tag: 'Black Hoodie · Tech Insignia · Glowing Headphones · Cargo Pants',
    },
    'gym': {
      name: 'Fitness Titan (Athletic Gym Core)',
      badge: 'FITNESS TITAN',
      subtitle: 'ATHLETIC CORE // IRON WARRIOR',
      image: `${baseUrl}/assets/avatar/fitness-avatar.jpg`,
      accentHex: '#10b981',
      accentDim: 'rgba(16, 185, 129, 0.15)',
      accentGlow: 'rgba(16, 185, 129, 0.45)',
      lightColorNum: 0x10b981,
      tag: 'Grey Gym T-Shirt · Defined Build · Athletic Shorts · Running Shoes',
    },
    'formal-suit': {
      name: 'Executive Vanguard (Tailored Suit)',
      badge: 'EXECUTIVE PRO',
      subtitle: 'STRATEGIC LEAD // CORPORATE COMMAND',
      image: `${baseUrl}/assets/avatar/professional-avatar.jpg`,
      accentHex: '#f59e0b',
      accentDim: 'rgba(245, 158, 11, 0.15)',
      accentGlow: 'rgba(245, 158, 11, 0.45)',
      lightColorNum: 0xf59e0b,
      tag: 'Charcoal Two-Piece Suit · Crisp Shirt · Silk Tie · Oxford Shoes',
    },
  }), [baseUrl]);

  const activeConfig = outfitConfigs[normalizedOutfit];

  // Trigger smooth crossfade effect on outfit change
  useEffect(() => {
    setImageTransitioning(true);
    const timer = setTimeout(() => {
      setImageTransitioning(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [normalizedOutfit]);

  // Handle Interactive 3D Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageCardRef.current) return;
    const rect = stageCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: x * 14, // Max tilt degrees
      y: -y * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // ---------------------------------------------------------------------------
  // Three.js Background Stage / 3D Canvas
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!checkWebGLSupport()) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 680;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080d, 0.06);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 3.4);
    camera.lookAt(0, 0.9, 0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // Dynamic Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(activeConfig.lightColorNum, 4.0, 12);
    rimLight.position.set(-2.2, 3.4, -2.0);
    scene.add(rimLight);

    const underglowLight = new THREE.PointLight(activeConfig.lightColorNum, 3.2, 5.0);
    underglowLight.position.set(0, 0.25, 0);
    scene.add(underglowLight);

    // Battle Royale Holographic Stage Pedestal
    const platformGroup = new THREE.Group();

    // Dark titanium base
    const baseGeo = new THREE.CylinderGeometry(1.65, 1.8, 0.16, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0d111a,
      roughness: 0.35,
      metalness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.08;
    baseMesh.receiveShadow = true;
    platformGroup.add(baseMesh);

    // Outer neon ring
    const rimGeo = new THREE.TorusGeometry(1.64, 0.024, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: activeConfig.lightColorNum });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.01;
    platformGroup.add(rimMesh);

    // Inner holographic rotating coordinates ring
    const ringGeo = new THREE.RingGeometry(0.75, 1.4, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: activeConfig.lightColorNum,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.02;
    platformGroup.add(ringMesh);

    scene.add(platformGroup);

    // Floating Holographic Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.3 + Math.random() * 1.35;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      velocities[i] = 0.005 + Math.random() * 0.012;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: activeConfig.lightColorNum,
      size: 0.038,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Optional 3D Model Loading (GLTF / GLB Support - Requirement 9)
    let gltfModel: THREE.Group | null = null;
    const modelPath = `${baseUrl}/assets/avatar/avatar.glb`;
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        gltfModel = gltf.scene;
        gltfModel.scale.set(1.0, 1.0, 1.0);
        gltfModel.position.set(0, 0, 0);
        gltfModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(gltfModel);
      },
      undefined,
      () => {
        // Fallback: If no GLB is uploaded, the cinematic render stage delivers photorealistic visuals
      }
    );

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock.getElapsedTime();

      // Pedestal ring rotation
      ringMesh.rotation.z += 0.007;

      // Particle floating animation
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += velocities[i];
        if (posArray[i * 3 + 1] > 2.5) {
          posArray[i * 3 + 1] = 0.05;
        }
      }
      posAttr.needsUpdate = true;

      // Rotate GLTF model if loaded
      if (gltfModel) {
        gltfModel.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 680;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      baseGeo.dispose();
      rimGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
    };
  }, [activeConfig, baseUrl]);

  return (
    <div
      ref={stageCardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={stageWrapperStyles(activeConfig.accentGlow)}
    >
      {/* Background 3D Holographic Pedestal & Energy Canvas */}
      <div
        ref={mountRef}
        style={canvasBackgroundStyles}
        aria-hidden="true"
      />

      {/* Atmospheric Background Cyber Gradient & Vignette */}
      <div style={cyberVignetteStyles(activeConfig.accentDim)} />

      {/* Main Character Presentation Viewport (Full Body Head-to-Shoes) */}
      <div style={characterViewportStyles}>
        {renderMode === 'cinematic' ? (
          <div
            style={{
              ...characterContainerStyles,
              transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: imageTransitioning
                ? 'opacity 350ms ease, transform 350ms ease, filter 350ms ease'
                : 'transform 120ms ease-out',
              opacity: imageTransitioning ? 0.35 : 1.0,
              filter: imageTransitioning
                ? `blur(4px) drop-shadow(0 0 35px ${activeConfig.accentHex})`
                : `drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 25px ${activeConfig.accentDim})`,
            }}
          >
            {/* Soft Elliptical Ground Ambient Occlusion Shadow */}
            <div style={groundContactShadowStyles} />

            {/* High-Resolution Full-Body Avatar Asset */}
            <img
              src={activeConfig.image}
              alt={`Girish Gowda H R - ${activeConfig.name}`}
              style={{
                ...avatarImageStyles,
                transform: pose === 'victory'
                  ? 'scale(1.02) translateY(-4px)'
                  : pose === 'guard'
                  ? 'scale(0.99) translateY(2px)'
                  : 'scale(1.0)',
              }}
            />
          </div>
        ) : (
          <div style={webglPlaceholderStyles}>
            <Box size={48} color={activeConfig.accentHex} />
            <h3 style={webglModeTitleStyles}>3D WEBGL ENGINE ACTIVE</h3>
            <p style={webglModeTextStyles}>
              Three.js PBR renderer ready. You can inspect 360° rotation and drop rigged .glb assets into public/assets/avatar/avatar.glb.
            </p>
          </div>
        )}
      </div>

      {/* Free Fire Style Tactical HUD Overlay */}
      <div style={hudOverlayStyles}>
        {/* Top Header Row */}
        <div style={hudTopRowStyles}>
          <div style={operatorPillStyles(activeConfig.accentHex)}>
            <div style={levelBadgeStyles(activeConfig.accentHex)}>LVL 99</div>
            <div style={operatorTextColStyles}>
              <span style={operatorNameStyles}>GIRISH GOWDA H R</span>
              <span style={operatorSubStyles(activeConfig.accentHex)}>{activeConfig.subtitle}</span>
            </div>
          </div>

          <div style={topActionsRowStyles}>
            {/* View Mode Toggle (Cinematic High-Res vs 3D WebGL) */}
            <div style={viewToggleStyles}>
              <button
                type="button"
                onClick={() => setRenderMode('cinematic')}
                style={modeToggleBtnStyles(renderMode === 'cinematic', activeConfig.accentHex)}
                title="Cinematic Photorealistic Render"
              >
                <Camera size={14} />
                <span>CINEMATIC</span>
              </button>
              <button
                type="button"
                onClick={() => setRenderMode('webgl3d')}
                style={modeToggleBtnStyles(renderMode === 'webgl3d', activeConfig.accentHex)}
                title="Three.js 3D WebGL Mesh"
              >
                <Box size={14} />
                <span>3D WEBGL</span>
              </button>
            </div>

            <div style={presetInfoStyles(activeConfig.accentHex)}>
              <Sparkles size={14} color={activeConfig.accentHex} />
              <span>{activeConfig.badge}</span>
            </div>
          </div>
        </div>

        {/* Center Drag / Parallax Hint */}
        <div style={dragHintStyles}>
          <Eye size={14} color={activeConfig.accentHex} />
          <span>MOVE CURSOR TO INSPECT 3D DEPTH · HEAD-TO-SHOES VIEW</span>
        </div>

        {/* Bottom Customization Wardrobe HUD */}
        <div style={hudBottomRowStyles}>
          {/* Outfits Selector */}
          <div style={controlGroupStyles}>
            <span style={controlLabelStyles}>
              <Shield size={14} color={activeConfig.accentHex} />
              <span>WARDROBE (CHARACTER BIBLE)</span>
            </span>
            <div style={buttonsRowStyles}>
              <button
                type="button"
                onClick={() => onOutfitChange('dev-hoodie')}
                style={outfitButtonStyles(normalizedOutfit === 'dev-hoodie', '#00f0ff')}
              >
                <span style={swatchStyles('#00f0ff')} />
                <span>CODING OPERATIVE</span>
              </button>

              <button
                type="button"
                onClick={() => onOutfitChange('gym')}
                style={outfitButtonStyles(normalizedOutfit === 'gym', '#10b981')}
              >
                <span style={swatchStyles('#10b981')} />
                <span>FITNESS TITAN</span>
              </button>

              <button
                type="button"
                onClick={() => onOutfitChange('formal-suit')}
                style={outfitButtonStyles(normalizedOutfit === 'formal-suit', '#f59e0b')}
              >
                <span style={swatchStyles('#f59e0b')} />
                <span>EXECUTIVE PRO</span>
              </button>
            </div>
            <span style={outfitTaglineStyles}>{activeConfig.tag}</span>
          </div>

          {/* Emotes / Poses Selector */}
          <div style={controlGroupStyles}>
            <span style={controlLabelStyles}>
              <Zap size={14} color="var(--accent-amber)" />
              <span>EMOTE / STANCE</span>
            </span>
            <div style={buttonsRowStyles}>
              <button
                type="button"
                onClick={() => onPoseChange('ready')}
                style={poseButtonStyles(pose === 'ready')}
              >
                HERO STANCE
              </button>
              <button
                type="button"
                onClick={() => onPoseChange('victory')}
                style={poseButtonStyles(pose === 'victory')}
              >
                VICTORY SALUTE
              </button>
              <button
                type="button"
                onClick={() => onPoseChange('guard')}
                style={poseButtonStyles(pose === 'guard')}
              >
                BATTLE READY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Premium Responsive Styles
// =============================================================================

const stageWrapperStyles = (glowColor: string): React.CSSProperties => ({
  position: 'relative',
  width: '100%',
  minHeight: '720px',
  height: '75vh',
  maxHeight: '860px',
  borderRadius: 'var(--radius-xl)',
  overflow: 'hidden',
  backgroundColor: '#06070a',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: `0 10px 40px rgba(0, 0, 0, 0.9), 0 0 35px ${glowColor}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const canvasBackgroundStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
};

const cyberVignetteStyles = (dimColor: string): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  pointerEvents: 'none',
  background: `radial-gradient(circle at 50% 45%, ${dimColor} 0%, rgba(6, 7, 10, 0.4) 50%, #06070a 95%)`,
});

const characterViewportStyles: React.CSSProperties = {
  position: 'relative',
  zIndex: 3,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '2.5rem',
  paddingBottom: '5rem',
  pointerEvents: 'none',
};

const characterContainerStyles: React.CSSProperties = {
  position: 'relative',
  height: '100%',
  maxHeight: '660px',
  width: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
};

const groundContactShadowStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '-8px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '280px',
  height: '35px',
  borderRadius: '50%',
  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 45%, transparent 75%)',
  filter: 'blur(5px)',
  zIndex: 1,
};

const avatarImageStyles: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  maxHeight: '640px',
  height: '100%',
  width: 'auto',
  objectFit: 'contain',
  userSelect: 'none',
  transition: 'transform 300ms ease',
  filter: 'contrast(1.03) brightness(1.02)',
};

const webglPlaceholderStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  textAlign: 'center',
  padding: '2rem',
  maxWidth: '440px',
  backgroundColor: 'rgba(13, 17, 26, 0.85)',
  backdropFilter: 'blur(16px)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)',
};

const webglModeTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: 'var(--text-primary)',
};

const webglModeTextStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

const hudOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 4,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '1.25rem 1.5rem',
};

const hudTopRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '1rem',
  pointerEvents: 'auto',
};

const operatorPillStyles = (accent: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: 'rgba(10, 13, 20, 0.88)',
  backdropFilter: 'blur(12px)',
  padding: '0.45rem 0.95rem',
  borderRadius: 'var(--radius-md)',
  border: `1px solid ${accent}55`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
});

const levelBadgeStyles = (accent: string): React.CSSProperties => ({
  fontSize: '0.75rem',
  fontWeight: 900,
  backgroundColor: accent,
  color: '#07080c',
  padding: '0.2rem 0.55rem',
  borderRadius: 'var(--radius-sm)',
  letterSpacing: '0.05em',
});

const operatorTextColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const operatorNameStyles: React.CSSProperties = {
  fontSize: '1.0rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: 'var(--text-primary)',
};

const operatorSubStyles = (accent: string): React.CSSProperties => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: accent,
  letterSpacing: '0.08em',
});

const topActionsRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const viewToggleStyles: React.CSSProperties = {
  display: 'flex',
  backgroundColor: 'rgba(10, 13, 20, 0.88)',
  backdropFilter: 'blur(10px)',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border-subtle)',
  padding: '0.2rem',
  gap: '0.25rem',
};

const modeToggleBtnStyles = (active: boolean, accent: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '0.3rem 0.65rem',
  borderRadius: 'var(--radius-full)',
  backgroundColor: active ? `${accent}25` : 'transparent',
  color: active ? accent : 'var(--text-muted)',
  border: active ? `1px solid ${accent}` : '1px solid transparent',
  transition: 'all 150ms ease',
  cursor: 'pointer',
});

const presetInfoStyles = (accent: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: accent,
  backgroundColor: 'rgba(10, 13, 20, 0.88)',
  backdropFilter: 'blur(10px)',
  padding: '0.45rem 1rem',
  borderRadius: 'var(--radius-full)',
  border: `1px solid ${accent}`,
  boxShadow: `0 0 15px ${accent}44`,
});

const dragHintStyles: React.CSSProperties = {
  alignSelf: 'center',
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.74rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(6, 7, 10, 0.75)',
  backdropFilter: 'blur(8px)',
  padding: '0.35rem 0.95rem',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border-subtle)',
};

const hudBottomRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
  gap: '1.25rem',
  pointerEvents: 'auto',
};

const controlGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  backgroundColor: 'rgba(10, 13, 20, 0.92)',
  backdropFilter: 'blur(16px)',
  padding: '0.85rem 1.1rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
  maxWidth: '540px',
};

const controlLabelStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.74rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
};

const buttonsRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const outfitButtonStyles = (active: boolean, accentColor: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '0.45rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? `${accentColor}25` : 'rgba(255, 255, 255, 0.04)',
  color: active ? accentColor : 'var(--text-secondary)',
  border: active ? `1px solid ${accentColor}` : '1px solid var(--border-subtle)',
  boxShadow: active ? `0 0 14px ${accentColor}44` : 'none',
  transition: 'all 200ms ease',
  cursor: 'pointer',
});

const outfitTaglineStyles: React.CSSProperties = {
  fontSize: '0.68rem',
  color: 'var(--text-muted)',
  fontStyle: 'italic',
};

const swatchStyles = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: `0 0 6px ${color}`,
});

const poseButtonStyles = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '0.45rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
  color: active ? 'var(--accent-amber)' : 'var(--text-secondary)',
  border: active ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
  boxShadow: active ? '0 0 12px rgba(245, 158, 11, 0.35)' : 'none',
  transition: 'all 200ms ease',
  cursor: 'pointer',
});
