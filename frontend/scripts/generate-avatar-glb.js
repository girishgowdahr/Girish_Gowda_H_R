// scripts/generate-avatar-glb.js
// Generates an anatomically-proportioned, PBR-shaded, realistic 3D human character
// matching the Character Bible and exports a standard GLTF 2.0 binary file (avatar.glb).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node.js FileReader Polyfill for GLTFExporter
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
      if (this.onloadend) this.onloadend();
    });
  }
};

export function buildCharacterGroup() {
  const root = new THREE.Group();
  root.name = 'Girish_Avatar_Model';

  // ---------------------------------------------------------------------------
  // Materials (PBR MeshStandardMaterial)
  // ---------------------------------------------------------------------------
  // Skin tone (Natural warm Indian skin tone)
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68a62,
    roughness: 0.65,
    metalness: 0.05,
    name: 'M_Skin',
  });

  // Dark curly hair
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x181311,
    roughness: 0.85,
    metalness: 0.1,
    name: 'M_Hair',
  });

  // Beard / Goatee
  const facialHairMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1513,
    roughness: 0.9,
    metalness: 0.05,
    name: 'M_Beard',
  });

  // Dark hoodie fabric
  const hoodieMaterial = new THREE.MeshStandardMaterial({
    color: 0x16181f,
    roughness: 0.75,
    metalness: 0.15,
    name: 'M_HoodieFabric',
  });

  // Glowing Cyber Insignia (</>) & accents
  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00d4e6,
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.8,
    name: 'M_CyanInsignia',
  });

  // Tactical cargo joggers fabric
  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.8,
    metalness: 0.1,
    name: 'M_CargoPants',
  });

  // Headphone metallic hardware
  const techHardwareMaterial = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.3,
    metalness: 0.85,
    name: 'M_TechHardware',
  });

  // Glasses frame
  const glassesFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f1117,
    roughness: 0.25,
    metalness: 0.9,
    name: 'M_GlassesFrame',
  });

  // Glasses transparent lenses
  const glassesLensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    name: 'M_GlassesLens',
  });

  // Sneaker white sole rubber
  const sneakerWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.5,
    metalness: 0.05,
    name: 'M_SneakerWhite',
  });

  // Sneaker blue accent
  const sneakerAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.4,
    metalness: 0.2,
    name: 'M_SneakerBlue',
  });

  // ---------------------------------------------------------------------------
  // 1. Head & Face Details (Height ~1.55m to 1.80m)
  // ---------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.set(0, 1.58, 0);

  // Skull / Face base
  const faceGeo = new THREE.CylinderGeometry(0.095, 0.08, 0.19, 16);
  const faceMesh = new THREE.Mesh(faceGeo, skinMaterial);
  faceMesh.position.y = 0.04;
  headGroup.add(faceMesh);

  // Chin / Jawline definition
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

  // Stylish Curly Hair Volume on Top
  const hairGroup = new THREE.Group();
  hairGroup.name = 'CurlyHair';

  const hairTopGeo = new THREE.SphereGeometry(0.108, 16, 12);
  hairTopGeo.scale(1.05, 0.95, 1.1);
  const hairTopMesh = new THREE.Mesh(hairTopGeo, hairMaterial);
  hairTopMesh.position.set(0, 0.115, -0.01);
  hairGroup.add(hairTopMesh);

  // Organic curls / texture clusters
  const curlCount = 28;
  const curlGeo = new THREE.SphereGeometry(0.032, 8, 8);
  for (let i = 0; i < curlCount; i++) {
    const angle = (i / curlCount) * Math.PI * 2;
    const r = 0.065 + (i % 3) * 0.015;
    const yOff = 0.11 + Math.sin(i * 1.5) * 0.025;
    const curl = new THREE.Mesh(curlGeo, hairMaterial);
    curl.position.set(Math.cos(angle) * r, yOff, Math.sin(angle) * r * 0.85);
    curl.scale.set(0.9 + Math.random() * 0.3, 0.9 + Math.random() * 0.3, 0.9 + Math.random() * 0.3);
    hairGroup.add(curl);
  }
  headGroup.add(hairGroup);

  // Neatly trimmed Goatee & Beard
  const beardGeo = new THREE.SphereGeometry(0.055, 12, 8);
  beardGeo.scale(0.9, 0.8, 0.7);
  const beardMesh = new THREE.Mesh(beardGeo, facialHairMaterial);
  beardMesh.position.set(0, -0.025, 0.065);
  headGroup.add(beardMesh);

  // Sleek Rectangular Glasses Frame
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'RectangularGlasses';

  // Left frame rim
  const rimGeo = new THREE.BoxGeometry(0.048, 0.028, 0.008);
  const leftRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  leftRim.position.set(0.042, 0.052, 0.102);
  glassesGroup.add(leftRim);

  const leftLens = new THREE.Mesh(new THREE.PlaneGeometry(0.044, 0.024), glassesLensMaterial);
  leftLens.position.set(0.042, 0.052, 0.106);
  glassesGroup.add(leftLens);

  // Right frame rim
  const rightRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  rightRim.position.set(-0.042, 0.052, 0.102);
  glassesGroup.add(rightRim);

  const rightLens = leftLens.clone();
  rightLens.position.set(-0.042, 0.052, 0.106);
  glassesGroup.add(rightLens);

  // Bridge
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.006), glassesFrameMaterial);
  bridge.position.set(0, 0.054, 0.103);
  glassesGroup.add(bridge);

  // Temples (arms of glasses)
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
  // 2. Neck & High-Tech Glowing Neck Headphones
  // ---------------------------------------------------------------------------
  const neckGeo = new THREE.CylinderGeometry(0.052, 0.064, 0.11, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
  neckMesh.position.set(0, 1.46, -0.005);
  root.add(neckMesh);

  // Headphones resting around neck
  const headphonesGroup = new THREE.Group();
  headphonesGroup.name = 'NeckHeadphones';
  headphonesGroup.position.set(0, 1.44, 0.01);

  // Headband curve around neck
  const bandGeo = new THREE.TorusGeometry(0.092, 0.016, 12, 28, Math.PI * 1.35);
  const bandMesh = new THREE.Mesh(bandGeo, techHardwareMaterial);
  bandMesh.rotation.x = Math.PI / 1.7;
  bandMesh.rotation.z = -Math.PI * 0.675;
  headphonesGroup.add(bandMesh);

  // Left earcup with glowing cyan ring
  const cupGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.028, 16);
  const leftCup = new THREE.Mesh(cupGeo, techHardwareMaterial);
  leftCup.rotation.z = Math.PI / 2.3;
  leftCup.position.set(0.096, -0.01, 0.045);
  headphonesGroup.add(leftCup);

  const leftRing = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.005, 8, 20), cyanGlowMaterial);
  leftRing.rotation.x = Math.PI / 2;
  leftRing.position.set(0.097, -0.01, 0.058);
  headphonesGroup.add(leftRing);

  // Right earcup with glowing cyan ring
  const rightCup = leftCup.clone();
  rightCup.rotation.z = -Math.PI / 2.3;
  rightCup.position.set(-0.096, -0.01, 0.045);
  headphonesGroup.add(rightCup);

  const rightRing = leftRing.clone();
  rightRing.position.set(-0.097, -0.01, 0.058);
  headphonesGroup.add(rightRing);

  root.add(headphonesGroup);

  // ---------------------------------------------------------------------------
  // 3. Torso (Black Hoodie with Glowing Insignia)
  // ---------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'TorsoGroup';

  // Main chest & upper torso
  const chestGeo = new THREE.CylinderGeometry(0.20, 0.175, 0.32, 16);
  chestGeo.scale(1.15, 1.0, 0.72);
  const chestMesh = new THREE.Mesh(chestGeo, hoodieMaterial);
  chestMesh.position.set(0, 1.25, 0);
  torsoGroup.add(chestMesh);

  // Abdomen / waist
  const waistGeo = new THREE.CylinderGeometry(0.175, 0.18, 0.22, 16);
  waistGeo.scale(1.12, 1.0, 0.7);
  const waistMesh = new THREE.Mesh(waistGeo, hoodieMaterial);
  waistMesh.position.set(0, 1.0, 0);
  torsoGroup.add(waistMesh);

  // Hoodie bottom ribbed waistband
  const waistbandGeo = new THREE.CylinderGeometry(0.182, 0.185, 0.07, 16);
  waistbandGeo.scale(1.13, 1.0, 0.72);
  const waistbandMesh = new THREE.Mesh(waistbandGeo, hoodieMaterial);
  waistbandMesh.position.set(0, 0.88, 0);
  torsoGroup.add(waistbandMesh);

  // Hoodie Kangaroo front pocket
  const pocketGeo = new THREE.BoxGeometry(0.18, 0.11, 0.035);
  const pocketMesh = new THREE.Mesh(pocketGeo, hoodieMaterial);
  pocketMesh.position.set(0, 0.98, 0.125);
  torsoGroup.add(pocketMesh);

  // Folded Hood on Back of Shoulders
  const hoodBackGeo = new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
  hoodBackGeo.scale(1.1, 0.8, 0.85);
  const hoodBackMesh = new THREE.Mesh(hoodBackGeo, hoodieMaterial);
  hoodBackMesh.position.set(0, 1.34, -0.09);
  hoodBackMesh.rotation.x = -Math.PI / 4;
  torsoGroup.add(hoodBackMesh);

  // Glowing Cyber Insignia (</>) on Left Chest
  const logoGroup = new THREE.Group();
  logoGroup.name = 'GlowingCodeInsignia';
  logoGroup.position.set(0.075, 1.28, 0.128);

  const barGeo = new THREE.BoxGeometry(0.007, 0.026, 0.004);

  // Left bracket (<)
  const leftAngleTop = new THREE.Mesh(barGeo, cyanGlowMaterial);
  leftAngleTop.rotation.z = -Math.PI / 3;
  leftAngleTop.position.set(-0.015, 0.008, 0);
  logoGroup.add(leftAngleTop);

  const leftAngleBot = new THREE.Mesh(barGeo, cyanGlowMaterial);
  leftAngleBot.rotation.z = Math.PI / 3;
  leftAngleBot.position.set(-0.015, -0.008, 0);
  logoGroup.add(leftAngleBot);

  // Center slash (/)
  const slash = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.032, 0.004), cyanGlowMaterial);
  slash.rotation.z = -Math.PI / 6;
  slash.position.set(0, 0, 0);
  logoGroup.add(slash);

  // Right bracket (>)
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
  // 4. Arms & Hands (Ready Stance with Smartwatch & Bracelet)
  // ---------------------------------------------------------------------------
  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'LeftArm';
  leftArmGroup.position.set(0.24, 1.34, 0);

  // Shoulder deltoid
  const shoulderGeo = new THREE.SphereGeometry(0.072, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, hoodieMaterial);
  leftArmGroup.add(leftShoulder);

  // Upper arm
  const upperArmGeo = new THREE.CylinderGeometry(0.062, 0.055, 0.26, 12);
  const leftUpperArm = new THREE.Mesh(upperArmGeo, hoodieMaterial);
  leftUpperArm.position.set(0.03, -0.13, 0.02);
  leftUpperArm.rotation.z = -0.12;
  leftArmGroup.add(leftUpperArm);

  // Forearm with cuff
  const forearmGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.25, 12);
  const leftForearm = new THREE.Mesh(forearmGeo, hoodieMaterial);
  leftForearm.position.set(0.055, -0.34, 0.07);
  leftForearm.rotation.x = 0.28;
  leftForearm.rotation.z = -0.15;
  leftArmGroup.add(leftForearm);

  // Smartwatch on left wrist
  const watchGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.024, 12);
  const leftWatch = new THREE.Mesh(watchGeo, techHardwareMaterial);
  leftWatch.position.set(0.072, -0.45, 0.11);
  leftWatch.rotation.x = 0.28;
  leftArmGroup.add(leftWatch);

  const watchScreen = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.026), cyanGlowMaterial);
  watchScreen.position.set(0.075, -0.44, 0.145);
  leftArmGroup.add(watchScreen);

  // Left hand
  const handGeo = new THREE.BoxGeometry(0.045, 0.07, 0.035);
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

  // Bracelet on right wrist
  const braceletGeo = new THREE.TorusGeometry(0.044, 0.007, 8, 16);
  const rightBracelet = new THREE.Mesh(braceletGeo, techHardwareMaterial);
  rightBracelet.position.set(-0.072, -0.45, 0.11);
  rightBracelet.rotation.x = Math.PI / 2.3;
  rightArmGroup.add(rightBracelet);

  // Right hand
  const rightHand = leftHand.clone();
  rightHand.position.set(-0.076, -0.49, 0.125);
  rightArmGroup.add(rightHand);

  root.add(rightArmGroup);

  // ---------------------------------------------------------------------------
  // 5. Legs (Tactical Multi-Pocket Cargo Joggers)
  // ---------------------------------------------------------------------------
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.16, 16);
  pelvisGeo.scale(1.1, 1.0, 0.72);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMaterial);
  pelvisMesh.position.set(0, 0.80, 0);
  root.add(pelvisMesh);

  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.name = 'LeftLeg';
  leftLegGroup.position.set(0.105, 0.74, 0);

  // Thigh
  const thighGeo = new THREE.CylinderGeometry(0.088, 0.072, 0.38, 14);
  const leftThigh = new THREE.Mesh(thighGeo, pantsMaterial);
  leftThigh.position.set(0.015, -0.17, 0);
  leftThigh.rotation.z = -0.04;
  leftLegGroup.add(leftThigh);

  // Cargo pocket on left thigh outer side
  const cargoPocketGeo = new THREE.BoxGeometry(0.038, 0.12, 0.085);
  const leftPocket = new THREE.Mesh(cargoPocketGeo, pantsMaterial);
  leftPocket.position.set(0.09, -0.17, 0.01);
  leftLegGroup.add(leftPocket);

  // Knee flex joint
  const kneeGeo = new THREE.SphereGeometry(0.068, 12, 10);
  const leftKnee = new THREE.Mesh(kneeGeo, pantsMaterial);
  leftKnee.position.set(0.02, -0.36, 0.015);
  leftLegGroup.add(leftKnee);

  // Calf / shin
  const calfGeo = new THREE.CylinderGeometry(0.068, 0.054, 0.36, 14);
  const leftCalf = new THREE.Mesh(calfGeo, pantsMaterial);
  leftCalf.position.set(0.02, -0.54, 0.01);
  leftLegGroup.add(leftCalf);

  // Ankle jogger cuff
  const cuffGeo = new THREE.CylinderGeometry(0.056, 0.052, 0.05, 12);
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
  // 6. High-Top Sneakers (Chunky soles, detailed styling)
  // ---------------------------------------------------------------------------
  const createSneaker = (isLeft) => {
    const sneaker = new THREE.Group();
    sneaker.name = isLeft ? 'LeftSneaker' : 'RightSneaker';

    // Sole (white thick midsole)
    const soleGeo = new THREE.BoxGeometry(0.105, 0.045, 0.24);
    const soleMesh = new THREE.Mesh(soleGeo, sneakerWhiteMaterial);
    soleMesh.position.set(0, 0.0225, 0.035);
    sneaker.add(soleMesh);

    // Dark sneaker upper body
    const upperGeo = new THREE.BoxGeometry(0.098, 0.075, 0.21);
    const upperMesh = new THREE.Mesh(upperGeo, hoodieMaterial);
    upperMesh.position.set(0, 0.075, 0.025);
    sneaker.add(upperMesh);

    // Front toe cap
    const toeGeo = new THREE.SphereGeometry(0.048, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    toeGeo.scale(1.0, 0.7, 1.2);
    const toeMesh = new THREE.Mesh(toeGeo, sneakerWhiteMaterial);
    toeMesh.position.set(0, 0.045, 0.12);
    sneaker.add(toeMesh);

    // Blue accent stripe
    const stripeGeo = new THREE.BoxGeometry(0.102, 0.02, 0.14);
    const stripeMesh = new THREE.Mesh(stripeGeo, sneakerAccentMaterial);
    stripeMesh.position.set(0, 0.065, 0.015);
    sneaker.add(stripeMesh);

    // High-top collar
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
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return root;
}

// ---------------------------------------------------------------------------
// Main Generator Execution: Export avatar.glb
// ---------------------------------------------------------------------------
async function main() {
  console.log('Generating realistic 3D human character avatar...');
  const scene = new THREE.Scene();
  const character = buildCharacterGroup();
  scene.add(character);

  const outputPath = path.join(__dirname, '..', 'public', 'assets', 'avatar', 'avatar.glb');

  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (glb) => {
      fs.writeFileSync(outputPath, Buffer.from(glb));
      const stats = fs.statSync(outputPath);
      console.log(`SUCCESS! Generated real 3D model: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
    },
    (err) => {
      console.error('Failed to export GLB:', err);
      process.exit(1);
    },
    { binary: true }
  );
}

main();
