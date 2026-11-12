import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Shield, Sparkles, Zap, Cpu } from 'lucide-react';

export type OutfitId = 'cyber-merc' | 'crimson-vanguard' | 'fitness-titan';
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
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const outfitThemes = {
    'cyber-merc': {
      name: 'Cyberpunk Mercenary',
      primary: 0x121722,
      secondary: 0x232d42,
      glow: 0x00f0ff,
      lightColor: 0x00f0ff,
      accentHex: '#00f0ff',
    },
    'crimson-vanguard': {
      name: 'Crimson Vanguard',
      primary: 0x1f0e12,
      secondary: 0x3d171d,
      glow: 0xff3b5c,
      lightColor: 0xff3b5c,
      accentHex: '#ff3b5c',
    },
    'fitness-titan': {
      name: 'Iron Titan (Gym Core)',
      primary: 0x111614,
      secondary: 0x1f2e26,
      glow: 0x10b981,
      lightColor: 0x10b981,
      accentHex: '#10b981',
    },
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!checkWebGLSupport()) {
      setWebglSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.08);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 4.0);
    camera.lookAt(0, 0.9, 0);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);

    // 2. Lighting Setup (Game Lobby Battle-Royale Style)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const theme = outfitThemes[outfit];
    const rimLight = new THREE.PointLight(theme.lightColor, 3.5, 10);
    rimLight.position.set(-2.5, 3.5, -2);
    scene.add(rimLight);

    const underglowLight = new THREE.PointLight(theme.lightColor, 2.5, 4);
    underglowLight.position.set(0, 0.2, 0);
    scene.add(underglowLight);

    // 3. Game Lobby Circular Pedestal Platform
    const platformGroup = new THREE.Group();

    // Main base disc
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.2, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f131d,
      roughness: 0.4,
      metalness: 0.8,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.1;
    baseMesh.receiveShadow = true;
    platformGroup.add(baseMesh);

    // Glowing rim ring
    const rimGeo = new THREE.TorusGeometry(1.58, 0.03, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: theme.glow });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.01;
    platformGroup.add(rimMesh);

    // Inner holographic rotating ring
    const ringGeo = new THREE.RingGeometry(0.7, 1.25, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: theme.glow,
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

    // 4. Floating Holographic Cyber Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.2 + Math.random() * 1.3;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      velocities[i] = 0.005 + Math.random() * 0.012;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: theme.glow,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Stylized Humanoid Avatar Character (Articulated Mesh)
    const charGroup = new THREE.Group();
    characterGroupRef.current = charGroup;

    const armorPrimaryMat = new THREE.MeshStandardMaterial({
      color: theme.primary,
      roughness: 0.3,
      metalness: 0.85,
    });
    const armorSecondaryMat = new THREE.MeshStandardMaterial({
      color: theme.secondary,
      roughness: 0.5,
      metalness: 0.5,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: theme.glow });

    // Torso / Tactical Chestplate
    const torsoGeo = new THREE.BoxGeometry(0.48, 0.65, 0.28);
    const torso = new THREE.Mesh(torsoGeo, armorPrimaryMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    charGroup.add(torso);

    // Emissive Chest Core
    const chestCoreGeo = new THREE.BoxGeometry(0.18, 0.22, 0.04);
    const chestCore = new THREE.Mesh(chestCoreGeo, glowMat);
    chestCore.position.set(0, 1.2, 0.15);
    charGroup.add(chestCore);

    // Belt
    const beltGeo = new THREE.BoxGeometry(0.46, 0.1, 0.3);
    const belt = new THREE.Mesh(beltGeo, armorSecondaryMat);
    belt.position.y = 0.8;
    charGroup.add(belt);

    // Head / Cyber Combat Visor Helmet
    const headGeo = new THREE.BoxGeometry(0.24, 0.28, 0.26);
    const head = new THREE.Mesh(headGeo, armorPrimaryMat);
    head.position.y = 1.65;
    head.castShadow = true;
    charGroup.add(head);

    // Visor Glass with Neon Glow
    const visorGeo = new THREE.BoxGeometry(0.2, 0.08, 0.05);
    const visor = new THREE.Mesh(visorGeo, glowMat);
    visor.position.set(0, 1.66, 0.13);
    charGroup.add(visor);

    // Pauldrons
    const pauldronGeo = new THREE.BoxGeometry(0.18, 0.16, 0.22);
    const leftPauldron = new THREE.Mesh(pauldronGeo, armorSecondaryMat);
    leftPauldron.position.set(-0.35, 1.38, 0);
    leftPauldron.rotation.z = 0.15;
    charGroup.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, armorSecondaryMat);
    rightPauldron.position.set(0.35, 1.38, 0);
    rightPauldron.rotation.z = -0.15;
    charGroup.add(rightPauldron);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.5, 16);

    const leftArm = new THREE.Mesh(armGeo, armorPrimaryMat);
    leftArm.position.set(-0.34, 1.05, 0);
    leftArm.castShadow = true;
    charGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armorPrimaryMat);
    rightArm.position.set(0.34, 1.05, 0);
    rightArm.castShadow = true;
    charGroup.add(rightArm);

    // Gauntlets
    const gauntletGeo = new THREE.BoxGeometry(0.12, 0.25, 0.12);
    const leftGauntlet = new THREE.Mesh(gauntletGeo, glowMat);
    leftGauntlet.position.set(-0.34, 0.88, 0.05);
    charGroup.add(leftGauntlet);

    const rightGauntlet = new THREE.Mesh(gauntletGeo, glowMat);
    rightGauntlet.position.set(0.34, 0.88, 0.05);
    charGroup.add(rightGauntlet);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.7, 16);

    const leftLeg = new THREE.Mesh(legGeo, armorPrimaryMat);
    leftLeg.position.set(-0.16, 0.42, 0);
    leftLeg.castShadow = true;
    charGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorPrimaryMat);
    rightLeg.position.set(0.16, 0.42, 0);
    rightLeg.castShadow = true;
    charGroup.add(rightLeg);

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.16, 0.14, 0.28);
    const leftBoot = new THREE.Mesh(bootGeo, armorSecondaryMat);
    leftBoot.position.set(-0.16, 0.07, 0.04);
    leftBoot.castShadow = true;
    charGroup.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, armorSecondaryMat);
    rightBoot.position.set(0.16, 0.07, 0.04);
    rightBoot.castShadow = true;
    charGroup.add(rightBoot);

    // Apply Pose adjustments
    if (pose === 'victory') {
      leftArm.position.set(-0.38, 1.35, 0);
      leftArm.rotation.z = 2.4;
      rightArm.position.set(0.38, 1.35, 0);
      rightArm.rotation.z = -2.4;
      leftGauntlet.position.set(-0.48, 1.55, 0);
      rightGauntlet.position.set(0.48, 1.55, 0);
    } else if (pose === 'guard') {
      leftArm.rotation.x = 0.8;
      leftArm.rotation.z = -0.4;
      rightArm.rotation.x = 0.8;
      rightArm.rotation.z = 0.4;
      leftGauntlet.position.set(-0.2, 1.05, 0.3);
      rightGauntlet.position.set(0.2, 1.05, 0.3);
    }

    scene.add(charGroup);

    // 6. Interactive Drag to Rotate Logic
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      targetRotationY += deltaX * 0.012;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damp rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      charGroup.rotation.y = currentRotationY;

      // Platform ring rotation
      ringMesh.rotation.z += 0.008;

      // Idle breathing simulation
      const breath = Math.sin(elapsedTime * 2.5) * 0.02;
      torso.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
      head.position.y = 1.65 + breath * 0.4;
      visor.position.y = 1.66 + breath * 0.4;

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

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 560;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      baseGeo.dispose();
      rimGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
      torsoGeo.dispose();
      headGeo.dispose();
    };
  }, [outfit, pose]);

  const activeTheme = outfitThemes[outfit];

  return (
    <div style={stageWrapperStyles}>
      {webglSupported ? (
        <div
          ref={mountRef}
          style={canvasContainerStyles}
          tabIndex={0}
          aria-label="3D Avatar Viewport. Drag to rotate character 360 degrees."
        />
      ) : (
        <div style={fallbackStageStyles}>
          <div style={fallbackAvatarCircleStyles}>
            <Cpu size={56} color="var(--accent-cyan)" />
          </div>
          <h2 style={fallbackAvatarTitleStyles}>OPERATOR // GIRISH</h2>
          <p style={fallbackAvatarTextStyles}>
            3D WebGL acceleration is unavailable in this environment. Showing high-performance 2D lobby mode.
          </p>
        </div>
      )}

      {/* Free Fire Style Lobby HUD Overlay */}
      <div style={hudOverlayStyles}>
        {/* Top Operator Banner */}
        <div style={hudTopRowStyles}>
          <div style={operatorPillStyles}>
            <div style={levelBadgeStyles}>LVL 99</div>
            <div style={operatorTextColStyles}>
              <span style={operatorNameStyles}>OPERATOR // GIRISH</span>
              <span style={operatorSubStyles}>BATTLE ROYALE LOBBY // ELITE TACTICAL</span>
            </div>
          </div>

          <div style={presetInfoStyles(activeTheme.accentHex)}>
            <Sparkles size={14} color={activeTheme.accentHex} />
            <span>{activeTheme.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Floating 360 Drag Hint */}
        <div style={dragHintStyles}>
          <Eye size={14} color="var(--accent-cyan)" />
          <span>DRAG MOUSE OR TOUCH TO ROTATE 360°</span>
        </div>

        {/* Bottom Customization Controls (Free Fire style Locker/Skin Selector) */}
        <div style={hudBottomRowStyles}>
          {/* Outfits Selector */}
          <div style={controlGroupStyles}>
            <span style={controlLabelStyles}>
              <Shield size={14} color="var(--accent-cyan)" />
              <span>TACTICAL ARMOR SKIN</span>
            </span>
            <div style={buttonsRowStyles}>
              <button
                type="button"
                onClick={() => onOutfitChange('cyber-merc')}
                style={outfitButtonStyles(outfit === 'cyber-merc', '#00f0ff')}
              >
                <span style={swatchStyles('#00f0ff')} />
                <span>CYBER MERC</span>
              </button>

              <button
                type="button"
                onClick={() => onOutfitChange('crimson-vanguard')}
                style={outfitButtonStyles(outfit === 'crimson-vanguard', '#ff3b5c')}
              >
                <span style={swatchStyles('#ff3b5c')} />
                <span>CRIMSON VANGUARD</span>
              </button>

              <button
                type="button"
                onClick={() => onOutfitChange('fitness-titan')}
                style={outfitButtonStyles(outfit === 'fitness-titan', '#10b981')}
              >
                <span style={swatchStyles('#10b981')} />
                <span>IRON TITAN</span>
              </button>
            </div>
          </div>

          {/* Emotes / Poses Selector */}
          <div style={controlGroupStyles}>
            <span style={controlLabelStyles}>
              <Zap size={14} color="var(--accent-amber)" />
              <span>EMOTE / POSE</span>
            </span>
            <div style={buttonsRowStyles}>
              <button
                type="button"
                onClick={() => onPoseChange('ready')}
                style={poseButtonStyles(pose === 'ready')}
              >
                COMBAT READY
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
                GUARD DEFENSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const stageWrapperStyles: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '560px',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  backgroundColor: '#07080c',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  boxShadow: '0 0 35px rgba(0, 240, 255, 0.12), inset 0 0 40px rgba(0, 0, 0, 0.8)',
};

const canvasContainerStyles: React.CSSProperties = {
  width: '100%',
  height: '560px',
  cursor: 'grab',
  outline: 'none',
};

const fallbackStageStyles: React.CSSProperties = {
  width: '100%',
  height: '560px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#07080c',
};

const fallbackAvatarCircleStyles: React.CSSProperties = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid var(--accent-cyan)',
  boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)',
};

const fallbackAvatarTitleStyles: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
};

const fallbackAvatarTextStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  maxWidth: '450px',
  lineHeight: 1.5,
};

const hudOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
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

const operatorPillStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: 'rgba(18, 22, 34, 0.85)',
  backdropFilter: 'blur(10px)',
  padding: '0.4rem 0.85rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
};

const levelBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 900,
  backgroundColor: 'var(--accent-cyan)',
  color: '#07080c',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  letterSpacing: '0.04em',
};

const operatorTextColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const operatorNameStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: 'var(--text-primary)',
};

const operatorSubStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--accent-cyan)',
  letterSpacing: '0.08em',
};

const presetInfoStyles = (accent: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: accent,
  backgroundColor: 'rgba(18, 22, 34, 0.85)',
  backdropFilter: 'blur(10px)',
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius-full)',
  border: `1px solid ${accent}`,
  boxShadow: `0 0 15px ${accent}33`,
});

const dragHintStyles: React.CSSProperties = {
  alignSelf: 'center',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(9, 10, 15, 0.7)',
  padding: '0.35rem 0.85rem',
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
  gap: '0.5rem',
  backgroundColor: 'rgba(18, 22, 34, 0.9)',
  backdropFilter: 'blur(12px)',
  padding: '0.85rem 1rem',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)',
};

const controlLabelStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
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
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '0.45rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? `${accentColor}22` : 'rgba(255, 255, 255, 0.04)',
  color: active ? accentColor : 'var(--text-secondary)',
  border: active ? `1px solid ${accentColor}` : '1px solid var(--border-subtle)',
  boxShadow: active ? `0 0 10px ${accentColor}44` : 'none',
  transition: 'all var(--transition-fast)',
});

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
  padding: '0.45rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
  color: active ? 'var(--accent-amber)' : 'var(--text-secondary)',
  border: active ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
  boxShadow: active ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
  transition: 'all var(--transition-fast)',
});
