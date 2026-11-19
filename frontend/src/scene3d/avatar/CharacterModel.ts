// frontend/src/scene3d/avatar/CharacterModel.ts
// Realistic 3D Human Avatar Model Builder & GLTF Ingest for Three.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface AvatarLoadResult {
  group: THREE.Group;
  isGLTF: boolean;
  cleanUp: () => void;
}

/**
 * Builds a realistic, anatomically proportioned 3D stylized human character matching the Character Bible.
 * Height: ~1.80m. PBR materials, stylish glasses, curly hair, hoodie, cargo pants, and sneakers.
 */
export function createProceduralAvatar(themeColorNum: number = 0x00f0ff): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Procedural_Girish_Avatar';

  // ---------------------------------------------------------------------------
  // PBR Materials
  // ---------------------------------------------------------------------------
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68a62,
    roughness: 0.65,
    metalness: 0.05,
    name: 'M_Skin',
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x181311,
    roughness: 0.85,
    metalness: 0.1,
    name: 'M_Hair',
  });

  const facialHairMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1513,
    roughness: 0.9,
    metalness: 0.05,
    name: 'M_Beard',
  });

  const hoodieMaterial = new THREE.MeshStandardMaterial({
    color: 0x16181f,
    roughness: 0.75,
    metalness: 0.15,
    name: 'M_HoodieFabric',
  });

  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: themeColorNum,
    emissive: themeColorNum,
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.8,
    name: 'M_CyberInsignia',
  });

  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.8,
    metalness: 0.1,
    name: 'M_CargoPants',
  });

  const techHardwareMaterial = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.3,
    metalness: 0.85,
    name: 'M_TechHardware',
  });

  const glassesFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f1117,
    roughness: 0.25,
    metalness: 0.9,
    name: 'M_GlassesFrame',
  });

  const glassesLensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    name: 'M_GlassesLens',
  });

  const sneakerWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.5,
    metalness: 0.05,
    name: 'M_SneakerWhite',
  });

  const sneakerAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.4,
    metalness: 0.2,
    name: 'M_SneakerBlue',
  });

  // ---------------------------------------------------------------------------
  // 1. Head & Face (Height ~1.55m to 1.80m)
  // ---------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.set(0, 1.58, 0);

  // Skull / Face
  const faceGeo = new THREE.CylinderGeometry(0.095, 0.08, 0.19, 16);
  const faceMesh = new THREE.Mesh(faceGeo, skinMaterial);
  faceMesh.position.y = 0.04;
  headGroup.add(faceMesh);

  // Jawline
  const jawGeo = new THREE.SphereGeometry(0.082, 16, 12);
  jawGeo.scale(1.0, 1.15, 1.05);
  const jawMesh = new THREE.Mesh(jawGeo, skinMaterial);
  jawMesh.position.set(0, 0.04, 0.02);
  headGroup.add(jawMesh);

  // Nose
  const noseGeo = new THREE.ConeGeometry(0.016, 0.05, 8);
  const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
  noseMesh.rotation.x = Math.PI / 2.2;
  noseMesh.position.set(0, 0.038, 0.108);
  headGroup.add(noseMesh);

  // Ears
  const earGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.042, 8);
  const leftEar = new THREE.Mesh(earGeo, skinMaterial);
  leftEar.position.set(0.095, 0.035, 0);
  leftEar.rotation.z = 0.2;
  headGroup.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.set(-0.095, 0.035, 0);
  rightEar.rotation.z = -0.2;
  headGroup.add(rightEar);

  // Curly Hair Volume
  const hairGroup = new THREE.Group();
  hairGroup.name = 'CurlyHair';

  const hairTopGeo = new THREE.SphereGeometry(0.108, 16, 12);
  hairTopGeo.scale(1.05, 0.95, 1.1);
  const hairTopMesh = new THREE.Mesh(hairTopGeo, hairMaterial);
  hairTopMesh.position.set(0, 0.115, -0.01);
  hairGroup.add(hairTopMesh);

  // Organic curls
  const curlCount = 28;
  const curlGeo = new THREE.SphereGeometry(0.032, 8, 8);
  for (let i = 0; i < curlCount; i++) {
    const angle = (i / curlCount) * Math.PI * 2;
    const r = 0.065 + (i % 3) * 0.015;
    const yOff = 0.11 + Math.sin(i * 1.5) * 0.025;
    const curl = new THREE.Mesh(curlGeo, hairMaterial);
    curl.position.set(Math.cos(angle) * r, yOff, Math.sin(angle) * r * 0.85);
    curl.scale.set(0.95, 0.95, 0.95);
    hairGroup.add(curl);
  }
  headGroup.add(hairGroup);

  // Beard / Goatee
  const beardGeo = new THREE.SphereGeometry(0.055, 12, 8);
  beardGeo.scale(0.9, 0.8, 0.7);
  const beardMesh = new THREE.Mesh(beardGeo, facialHairMaterial);
  beardMesh.position.set(0, -0.025, 0.065);
  headGroup.add(beardMesh);

  // Sleek Rectangular Glasses
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'Glasses';

  const rimGeo = new THREE.BoxGeometry(0.048, 0.028, 0.008);
  const leftRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  leftRim.position.set(0.042, 0.052, 0.102);
  glassesGroup.add(leftRim);

  const leftLens = new THREE.Mesh(new THREE.PlaneGeometry(0.044, 0.024), glassesLensMaterial);
  leftLens.position.set(0.042, 0.052, 0.106);
  glassesGroup.add(leftLens);

  const rightRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  rightRim.position.set(-0.042, 0.052, 0.102);
  glassesGroup.add(rightRim);

  const rightLens = leftLens.clone();
  rightLens.position.set(-0.042, 0.052, 0.106);
  glassesGroup.add(rightLens);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.006), glassesFrameMaterial);
  bridge.position.set(0, 0.054, 0.103);
  glassesGroup.add(bridge);

  const templeArmGeo = new THREE.BoxGeometry(0.006, 0.006, 0.11);
  const leftArm = new THREE.Mesh(templeArmGeo, glassesFrameMaterial);
  leftArm.position.set(0.066, 0.052, 0.048);
  glassesGroup.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.set(-0.066, 0.052, 0.048);
  glassesGroup.add(rightArm);

  headGroup.add(glassesGroup);
  root.add(headGroup);

  // ---------------------------------------------------------------------------
  // 2. Neck & Glowing Neck Headphones
  // ---------------------------------------------------------------------------
  const neckGeo = new THREE.CylinderGeometry(0.052, 0.064, 0.11, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
  neckMesh.position.set(0, 1.46, -0.005);
  root.add(neckMesh);

  const headphonesGroup = new THREE.Group();
  headphonesGroup.name = 'Headphones';
  headphonesGroup.position.set(0, 1.44, 0.01);

  const bandGeo = new THREE.TorusGeometry(0.092, 0.016, 12, 28, Math.PI * 1.35);
  const bandMesh = new THREE.Mesh(bandGeo, techHardwareMaterial);
  bandMesh.rotation.x = Math.PI / 1.7;
  bandMesh.rotation.z = -Math.PI * 0.675;
  headphonesGroup.add(bandMesh);

  const cupGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.028, 16);
  const leftCup = new THREE.Mesh(cupGeo, techHardwareMaterial);
  leftCup.rotation.z = Math.PI / 2.3;
  leftCup.position.set(0.096, -0.01, 0.045);
  headphonesGroup.add(leftCup);

  const leftRing = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.005, 8, 20), cyanGlowMaterial);
  leftRing.rotation.x = Math.PI / 2;
  leftRing.position.set(0.097, -0.01, 0.058);
  headphonesGroup.add(leftRing);

  const rightCup = leftCup.clone();
  rightCup.rotation.z = -Math.PI / 2.3;
  rightCup.position.set(-0.096, -0.01, 0.045);
  headphonesGroup.add(rightCup);

  const rightRing = leftRing.clone();
  rightRing.position.set(-0.097, -0.01, 0.058);
  headphonesGroup.add(rightRing);

  root.add(headphonesGroup);

  // ---------------------------------------------------------------------------
  // 3. Torso (Black Tactical Hoodie with Glowing Insignia)
  // ---------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'Torso';

  const chestGeo = new THREE.CylinderGeometry(0.20, 0.175, 0.32, 16);
  chestGeo.scale(1.15, 1.0, 0.72);
  const chestMesh = new THREE.Mesh(chestGeo, hoodieMaterial);
  chestMesh.position.set(0, 1.25, 0);
  torsoGroup.add(chestMesh);

  const waistGeo = new THREE.CylinderGeometry(0.175, 0.18, 0.22, 16);
  waistGeo.scale(1.12, 1.0, 0.7);
  const waistMesh = new THREE.Mesh(waistGeo, hoodieMaterial);
  waistMesh.position.set(0, 1.0, 0);
  torsoGroup.add(waistMesh);

  const waistbandGeo = new THREE.CylinderGeometry(0.182, 0.185, 0.07, 16);
  waistbandGeo.scale(1.13, 1.0, 0.72);
  const waistbandMesh = new THREE.Mesh(waistbandGeo, hoodieMaterial);
  waistbandMesh.position.set(0, 0.88, 0);
  torsoGroup.add(waistbandMesh);

  const pocketGeo = new THREE.BoxGeometry(0.18, 0.11, 0.035);
  const pocketMesh = new THREE.Mesh(pocketGeo, hoodieMaterial);
  pocketMesh.position.set(0, 0.98, 0.125);
  torsoGroup.add(pocketMesh);

  const hoodBackGeo = new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
  hoodBackGeo.scale(1.1, 0.8, 0.85);
  const hoodBackMesh = new THREE.Mesh(hoodBackGeo, hoodieMaterial);
  hoodBackMesh.position.set(0, 1.34, -0.09);
  hoodBackMesh.rotation.x = -Math.PI / 4;
  torsoGroup.add(hoodBackMesh);

  // Glowing Cyber Insignia (</>) on Left Chest
  const logoGroup = new THREE.Group();
  logoGroup.name = 'LogoInsignia';
  logoGroup.position.set(0.075, 1.28, 0.128);

  const barGeo = new THREE.BoxGeometry(0.007, 0.026, 0.004);

  const leftAngleTop = new THREE.Mesh(barGeo, cyanGlowMaterial);
  leftAngleTop.rotation.z = -Math.PI / 3;
  leftAngleTop.position.set(-0.015, 0.008, 0);
  logoGroup.add(leftAngleTop);

  const leftAngleBot = new THREE.Mesh(barGeo, cyanGlowMaterial);
  leftAngleBot.rotation.z = Math.PI / 3;
  leftAngleBot.position.set(-0.015, -0.008, 0);
  logoGroup.add(leftAngleBot);

  const slash = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.032, 0.004), cyanGlowMaterial);
  slash.rotation.z = -Math.PI / 6;
  slash.position.set(0, 0, 0);
  logoGroup.add(slash);

  const rightAngleTop = new THREE.Mesh(barGeo, cyanGlowMaterial);
  rightAngleTop.rotation.z = Math.PI / 3;
  rightAngleTop.position.set(0.015, 0.008, 0);
  logoGroup.add(rightAngleTop);

  const rightAngleBot = new THREE.Mesh(barGeo, cyanGlowMaterial);
  rightAngleBot.rotation.z = -Math.PI / 3;
  rightAngleBot.position.set(0.015, -0.008, 0);
  logoGroup.add(rightAngleBot);

  torsoGroup.add(logoGroup);
  root.add(torsoGroup);

  // ---------------------------------------------------------------------------
  // 4. Arms & Hands
  // ---------------------------------------------------------------------------
  const shoulderGeo = new THREE.SphereGeometry(0.072, 12, 12);
  const upperArmGeo = new THREE.CylinderGeometry(0.062, 0.055, 0.26, 12);
  const forearmGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.25, 12);
  const handGeo = new THREE.BoxGeometry(0.045, 0.07, 0.035);

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'LeftArm';
  leftArmGroup.position.set(0.24, 1.34, 0);

  const leftShoulder = new THREE.Mesh(shoulderGeo, hoodieMaterial);
  leftArmGroup.add(leftShoulder);

  const leftUpperArm = new THREE.Mesh(upperArmGeo, hoodieMaterial);
  leftUpperArm.position.set(0.03, -0.13, 0.02);
  leftUpperArm.rotation.z = -0.12;
  leftArmGroup.add(leftUpperArm);

  const leftForearm = new THREE.Mesh(forearmGeo, hoodieMaterial);
  leftForearm.position.set(0.055, -0.34, 0.07);
  leftForearm.rotation.x = 0.28;
  leftForearm.rotation.z = -0.15;
  leftArmGroup.add(leftForearm);

  const leftWatch = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.024, 12), techHardwareMaterial);
  leftWatch.position.set(0.072, -0.45, 0.11);
  leftWatch.rotation.x = 0.28;
  leftArmGroup.add(leftWatch);

  const watchScreen = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.026), cyanGlowMaterial);
  watchScreen.position.set(0.075, -0.44, 0.145);
  leftArmGroup.add(watchScreen);

  const leftHand = new THREE.Mesh(handGeo, skinMaterial);
  leftHand.position.set(0.076, -0.49, 0.125);
  leftHand.rotation.x = 0.3;
  leftArmGroup.add(leftHand);

  root.add(leftArmGroup);

  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'RightArm';
  rightArmGroup.position.set(-0.24, 1.34, 0);

  const rightShoulder = new THREE.Mesh(shoulderGeo, hoodieMaterial);
  rightArmGroup.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, hoodieMaterial);
  rightUpperArm.position.set(-0.03, -0.13, 0.02);
  rightUpperArm.rotation.z = 0.12;
  rightArmGroup.add(rightUpperArm);

  const rightForearm = new THREE.Mesh(forearmGeo, hoodieMaterial);
  rightForearm.position.set(-0.055, -0.34, 0.07);
  rightForearm.rotation.x = 0.28;
  rightForearm.rotation.z = 0.15;
  rightArmGroup.add(rightForearm);

  const rightBracelet = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.007, 8, 16), techHardwareMaterial);
  rightBracelet.position.set(-0.072, -0.45, 0.11);
  rightBracelet.rotation.x = Math.PI / 2.3;
  rightArmGroup.add(rightBracelet);

  const rightHand = leftHand.clone();
  rightHand.position.set(-0.076, -0.49, 0.125);
  rightArmGroup.add(rightHand);

  root.add(rightArmGroup);

  // ---------------------------------------------------------------------------
  // 5. Legs & Cargo Pants
  // ---------------------------------------------------------------------------
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.16, 16);
  pelvisGeo.scale(1.1, 1.0, 0.72);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMaterial);
  pelvisMesh.position.set(0, 0.80, 0);
  root.add(pelvisMesh);

  const thighGeo = new THREE.CylinderGeometry(0.088, 0.072, 0.38, 14);
  const cargoPocketGeo = new THREE.BoxGeometry(0.038, 0.12, 0.085);
  const kneeGeo = new THREE.SphereGeometry(0.068, 12, 10);
  const calfGeo = new THREE.CylinderGeometry(0.068, 0.054, 0.36, 14);
  const cuffGeo = new THREE.CylinderGeometry(0.056, 0.052, 0.05, 12);

  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.name = 'LeftLeg';
  leftLegGroup.position.set(0.105, 0.74, 0);

  const leftThigh = new THREE.Mesh(thighGeo, pantsMaterial);
  leftThigh.position.set(0.015, -0.17, 0);
  leftThigh.rotation.z = -0.04;
  leftLegGroup.add(leftThigh);

  const leftPocket = new THREE.Mesh(cargoPocketGeo, pantsMaterial);
  leftPocket.position.set(0.09, -0.17, 0.01);
  leftLegGroup.add(leftPocket);

  const leftKnee = new THREE.Mesh(kneeGeo, pantsMaterial);
  leftKnee.position.set(0.02, -0.36, 0.015);
  leftLegGroup.add(leftKnee);

  const leftCalf = new THREE.Mesh(calfGeo, pantsMaterial);
  leftCalf.position.set(0.02, -0.54, 0.01);
  leftLegGroup.add(leftCalf);

  const leftCuff = new THREE.Mesh(cuffGeo, pantsMaterial);
  leftCuff.position.set(0.02, -0.71, 0.01);
  leftLegGroup.add(leftCuff);

  root.add(leftLegGroup);

  // Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.name = 'RightLeg';
  rightLegGroup.position.set(-0.105, 0.74, 0);

  const rightThigh = new THREE.Mesh(thighGeo, pantsMaterial);
  rightThigh.position.set(-0.015, -0.17, 0);
  rightThigh.rotation.z = 0.04;
  rightLegGroup.add(rightThigh);

  const rightPocket = new THREE.Mesh(cargoPocketGeo, pantsMaterial);
  rightPocket.position.set(-0.09, -0.17, 0.01);
  rightLegGroup.add(rightPocket);

  const rightKnee = new THREE.Mesh(kneeGeo, pantsMaterial);
  rightKnee.position.set(-0.02, -0.36, 0.015);
  rightLegGroup.add(rightKnee);

  const rightCalf = new THREE.Mesh(calfGeo, pantsMaterial);
  rightCalf.position.set(-0.02, -0.54, 0.01);
  rightLegGroup.add(rightCalf);

  const rightCuff = new THREE.Mesh(cuffGeo, pantsMaterial);
  rightCuff.position.set(-0.02, -0.71, 0.01);
  rightLegGroup.add(rightCuff);

  root.add(rightLegGroup);

  // ---------------------------------------------------------------------------
  // 6. High-Top Sneakers
  // ---------------------------------------------------------------------------
  const createSneaker = (isLeft: boolean) => {
    const sneaker = new THREE.Group();
    sneaker.name = isLeft ? 'LeftSneaker' : 'RightSneaker';

    const soleGeo = new THREE.BoxGeometry(0.105, 0.045, 0.24);
    const soleMesh = new THREE.Mesh(soleGeo, sneakerWhiteMaterial);
    soleMesh.position.set(0, 0.0225, 0.035);
    sneaker.add(soleMesh);

    const upperGeo = new THREE.BoxGeometry(0.098, 0.075, 0.21);
    const upperMesh = new THREE.Mesh(upperGeo, hoodieMaterial);
    upperMesh.position.set(0, 0.075, 0.025);
    sneaker.add(upperMesh);

    const toeGeo = new THREE.SphereGeometry(0.048, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    toeGeo.scale(1.0, 0.7, 1.2);
    const toeMesh = new THREE.Mesh(toeGeo, sneakerWhiteMaterial);
    toeMesh.position.set(0, 0.045, 0.12);
    sneaker.add(toeMesh);

    const stripeGeo = new THREE.BoxGeometry(0.102, 0.02, 0.14);
    const stripeMesh = new THREE.Mesh(stripeGeo, sneakerAccentMaterial);
    stripeMesh.position.set(0, 0.065, 0.015);
    sneaker.add(stripeMesh);

    const collarGeo = new THREE.CylinderGeometry(0.054, 0.054, 0.065, 12);
    const collarMesh = new THREE.Mesh(collarGeo, hoodieMaterial);
    collarMesh.position.set(0, 0.13, -0.01);
    sneaker.add(collarMesh);

    return sneaker;
  };

  const leftSneaker = createSneaker(true);
  leftSneaker.position.set(0.125, 0, 0);
  root.add(leftSneaker);

  const rightSneaker = createSneaker(false);
  rightSneaker.position.set(-0.125, 0, 0);
  root.add(rightSneaker);

  // Enable shadow casting and receiving for all meshes
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return root;
}

/**
 * Loads the avatar 3D model:
 * Tries to fetch `avatar.glb` from `public/assets/avatar/avatar.glb`.
 * If successful, centers and normalizes the loaded 3D scene.
 * If not found or fails, falls back gracefully to `createProceduralAvatar()`.
 */
export async function loadAvatarModel(
  baseUrl: string,
  themeColorNum: number = 0x00f0ff,
  onProgress?: (percent: number) => void
): Promise<AvatarLoadResult> {
  const modelUrl = `${baseUrl}/assets/avatar/avatar.glb`;
  const loader = new GLTFLoader();

  try {
    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(
        modelUrl,
        resolve,
        (xhr) => {
          if (xhr.total && xhr.total > 0 && onProgress) {
            onProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        reject
      );
    });

    const group = gltf.scene as THREE.Group;
    group.name = 'GLTF_Avatar_Model';

    // Normalize scale and position
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Standard human height is ~1.8m
    if (size.y > 0.1) {
      const targetHeight = 1.8;
      const scaleFactor = targetHeight / size.y;
      group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Re-center on pedestal ground
    const updatedBox = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    updatedBox.getCenter(center);
    group.position.x = -center.x;
    group.position.y = -updatedBox.min.y; // Ensure shoes touch ground (y=0)
    group.position.z = -center.z;

    // Enable shadows on all child meshes
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return {
      group,
      isGLTF: true,
      cleanUp: () => {
        group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      },
    };
  } catch (error) {
    // Graceful fallback to procedural 3D model
    const proceduralGroup = createProceduralAvatar(themeColorNum);
    return {
      group: proceduralGroup,
      isGLTF: false,
      cleanUp: () => {
        proceduralGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
          }
        });
      },
    };
  }
}
