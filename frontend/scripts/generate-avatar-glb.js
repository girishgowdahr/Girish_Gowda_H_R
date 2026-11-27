// scripts/generate-avatar-glb.js
// Generates an anatomically sculpted, realistic 3D human character matching Girish Gowda H R
// with photographic face, styled curly hair, glasses, neck headphones, cyber hoodie,
// cargo pants, and sneakers. Exports binary GLTF 2.0 (avatar.glb).

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

/**
 * Creates an anatomically contoured face mesh with normalized [0, 1] UV coordinates.
 */
export function createSculptedFaceGeometry() {
  const cols = 28;
  const rows = 32;
  const positions = [];
  const uvs = [];
  const indices = [];

  const width = 0.165;
  const height = 0.205;

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y = (v - 0.5) * height;

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = (u - 0.5) * width;

      const distFromCenter = Math.abs(u - 0.5) * 2.0;

      // Base anatomical face curvature (elliptical cylinder)
      let z = Math.sqrt(Math.max(0, 1.0 - Math.pow(distFromCenter * 0.95, 2))) * 0.048;

      // Forehead curvature (curves back near top)
      if (v > 0.75) {
        const topT = (v - 0.75) / 0.25;
        z -= topT * topT * 0.018;
      }

      // Brow ridge protrusion (v ~ 0.65 to 0.74)
      if (v >= 0.64 && v <= 0.74 && distFromCenter < 0.75) {
        const browT = Math.sin(((v - 0.64) / 0.10) * Math.PI);
        z += browT * 0.008;
      }

      // Eye sockets indentation (v ~ 0.57 to 0.66, dist ~ 0.22 to 0.68)
      if (v >= 0.57 && v <= 0.66 && distFromCenter >= 0.20 && distFromCenter <= 0.70) {
        const eyeT = Math.sin(((v - 0.57) / 0.09) * Math.PI) * Math.sin(((distFromCenter - 0.20) / 0.50) * Math.PI);
        z -= eyeT * 0.008;
      }

      // Nose bridge and tip protrusion (v ~ 0.34 to 0.62, dist < 0.24)
      if (v >= 0.34 && v <= 0.62 && distFromCenter <= 0.24) {
        const noseT = Math.sin(((v - 0.34) / 0.28) * Math.PI) * (1.0 - distFromCenter / 0.24);
        const tipBonus = (v >= 0.38 && v <= 0.46) ? 0.016 : 0.0;
        z += (noseT * 0.026 + tipBonus * (1.0 - distFromCenter / 0.24));
      }

      // Nostrils flare (v ~ 0.36 to 0.43, dist ~ 0.12 to 0.32)
      if (v >= 0.36 && v <= 0.43 && distFromCenter >= 0.12 && distFromCenter <= 0.32) {
        const nostrilT = Math.sin(((v - 0.36) / 0.07) * Math.PI) * Math.sin(((distFromCenter - 0.12) / 0.20) * Math.PI);
        z += nostrilT * 0.007;
      }

      // Upper lip & Philtrum (v ~ 0.26 to 0.34)
      if (v >= 0.26 && v <= 0.34 && distFromCenter <= 0.42) {
        const lipT = Math.sin(((v - 0.26) / 0.08) * Math.PI) * (1.0 - distFromCenter / 0.42);
        z += lipT * 0.008;
      }

      // Mouth crease (v ~ 0.22 to 0.26)
      if (v >= 0.22 && v <= 0.26 && distFromCenter <= 0.38) {
        z -= 0.004 * (1.0 - distFromCenter / 0.38);
      }

      // Lower lip (v ~ 0.16 to 0.23)
      if (v >= 0.16 && v <= 0.23 && distFromCenter <= 0.38) {
        const lowerLipT = Math.sin(((v - 0.16) / 0.07) * Math.PI) * (1.0 - distFromCenter / 0.38);
        z += lowerLipT * 0.009;
      }

      // Chin prominence (v ~ 0.03 to 0.15)
      if (v >= 0.03 && v <= 0.15 && distFromCenter <= 0.48) {
        const chinT = Math.sin(((v - 0.03) / 0.12) * Math.PI) * (1.0 - distFromCenter / 0.48);
        z += chinT * 0.015;
      }

      // Jawline taper
      let finalX = x;
      if (v < 0.25) {
        const jawTaper = 1.0 - (1.0 - v / 0.25) * 0.25;
        finalX *= jawTaper;
      }

      positions.push(finalX, y, z);
      uvs.push(u, v);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const d = (r + 1) * (cols + 1) + (c + 1);
      const e = r * (cols + 1) + (c + 1);

      indices.push(a, b, d);
      indices.push(a, d, e);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates contoured front torso panel with normalized [0, 1] UV coordinates.
 */
export function createSculptedTorsoGeometry() {
  const cols = 22;
  const rows = 26;
  const positions = [];
  const uvs = [];
  const indices = [];

  const width = 0.38;
  const height = 0.52;

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y = (v - 0.5) * height;

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = (u - 0.5) * width;

      const distFromCenter = Math.abs(u - 0.5) * 2.0;
      let z = Math.sqrt(Math.max(0, 1.0 - Math.pow(distFromCenter * 0.92, 2))) * 0.125;

      if (v >= 0.52 && v <= 0.88 && distFromCenter < 0.85) {
        const chestT = Math.sin(((v - 0.52) / 0.36) * Math.PI) * (1.0 - distFromCenter / 0.85);
        z += chestT * 0.022;
      }

      let finalX = x;
      if (v <= 0.45) {
        const waistFactor = 1.0 - Math.sin((v / 0.45) * Math.PI * 0.5) * 0.08;
        finalX *= waistFactor;
      }

      positions.push(finalX, y, z);
      uvs.push(u, v);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const d = (r + 1) * (cols + 1) + (c + 1);
      const e = r * (cols + 1) + (c + 1);

      indices.push(a, b, d);
      indices.push(a, d, e);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates contoured front legs panel with normalized [0, 1] UV coordinates.
 */
export function createSculptedLegsGeometry() {
  const cols = 24;
  const rows = 28;
  const positions = [];
  const uvs = [];
  const indices = [];

  const width = 0.36;
  const height = 0.72;

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y = (v - 0.5) * height;

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = (u - 0.5) * width;

      const isRightLeg = u < 0.48;
      const isLeftLeg = u > 0.52;
      const isCrotchGap = !isRightLeg && !isLeftLeg;

      let legCenterDist = 0;
      if (isRightLeg) {
        legCenterDist = Math.abs((u - 0.24) / 0.24);
      } else if (isLeftLeg) {
        legCenterDist = Math.abs((u - 0.76) / 0.24);
      } else {
        legCenterDist = 1.0;
      }

      let z = Math.sqrt(Math.max(0, 1.0 - Math.pow(Math.min(1.0, legCenterDist * 0.95), 2))) * 0.082;

      if (isCrotchGap && v < 0.85) {
        z -= 0.04;
      }

      if (v >= 0.38 && v <= 0.52 && legCenterDist < 0.6) {
        const kneeT = Math.sin(((v - 0.38) / 0.14) * Math.PI) * (1.0 - legCenterDist / 0.6);
        z += kneeT * 0.015;
      }

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const d = (r + 1) * (cols + 1) + (c + 1);
      const e = r * (cols + 1) + (c + 1);

      indices.push(a, b, d);
      indices.push(a, d, e);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildCharacterGroup(themeColorNum = 0x00f0ff) {
  const root = new THREE.Group();
  root.name = 'Realistic_Girish_Avatar';

  // ---------------------------------------------------------------------------
  // Materials
  // ---------------------------------------------------------------------------
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xc4875f,
    roughness: 0.62,
    metalness: 0.04,
    name: 'M_SkinBase',
  });

  const faceTexturedMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.60,
    metalness: 0.05,
    name: 'M_FacePhoto',
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x14100e,
    roughness: 0.88,
    metalness: 0.08,
    name: 'M_CurlyHair',
  });

  const hoodieMaterial = new THREE.MeshStandardMaterial({
    color: 0x16181f,
    roughness: 0.78,
    metalness: 0.12,
    name: 'M_HoodieFabric',
  });

  const torsoTexturedMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.75,
    metalness: 0.10,
    name: 'M_TorsoPhoto',
  });

  const legsTexturedMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.80,
    metalness: 0.08,
    name: 'M_LegsPhoto',
  });

  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: themeColorNum,
    emissive: themeColorNum,
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.8,
    name: 'M_CyanInsignia',
  });

  const techHardwareMaterial = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.32,
    metalness: 0.88,
    name: 'M_TechHardware',
  });

  const glassesFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d0e12,
    roughness: 0.25,
    metalness: 0.92,
    name: 'M_GlassesFrame',
  });

  const glassesLensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.40,
    roughness: 0.08,
    transmission: 0.92,
    ior: 1.52,
    name: 'M_GlassesLens',
  });

  const sneakerWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.45,
    metalness: 0.05,
    name: 'M_SneakerWhite',
  });

  const sneakerAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.40,
    metalness: 0.25,
    name: 'M_SneakerBlue',
  });

  // ---------------------------------------------------------------------------
  // 1. Head & Face Assembly (y ~ 1.52 to 1.78m)
  // ---------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.set(0, 1.62, 0);

  // Anatomical Sculpted Face Mesh (Front)
  const faceGeo = createSculptedFaceGeometry();
  const faceMesh = new THREE.Mesh(faceGeo, faceTexturedMaterial);
  faceMesh.name = 'Mesh_FacePhoto';
  faceMesh.position.set(0, 0, 0.022);
  headGroup.add(faceMesh);

  // Cranium / Rear & Side Skull (positioned behind face mesh so it never covers the face)
  const craniumGeo = new THREE.SphereGeometry(0.096, 24, 20);
  craniumGeo.scale(0.96, 1.10, 0.80);
  const craniumMesh = new THREE.Mesh(craniumGeo, skinMaterial);
  craniumMesh.name = 'Mesh_Cranium';
  craniumMesh.position.set(0, 0.015, -0.045);
  headGroup.add(craniumMesh);

  // Sculpted 3D Ears
  const createEar = (isLeft) => {
    const earGroup = new THREE.Group();
    const earGeo = new THREE.CylinderGeometry(0.016, 0.019, 0.046, 12);
    earGeo.scale(0.5, 1.0, 0.9);
    const earMesh = new THREE.Mesh(earGeo, skinMaterial);
    earGroup.add(earMesh);

    const innerGeo = new THREE.CylinderGeometry(0.010, 0.012, 0.032, 10);
    innerGeo.scale(0.4, 1.0, 0.8);
    const innerMesh = new THREE.Mesh(innerGeo, hairMaterial);
    innerMesh.position.set(isLeft ? 0.003 : -0.003, 0.002, 0.002);
    earGroup.add(innerMesh);

    earGroup.position.set(isLeft ? 0.090 : -0.090, 0.012, -0.012);
    earGroup.rotation.z = isLeft ? 0.18 : -0.18;
    earGroup.rotation.y = isLeft ? 0.15 : -0.15;
    return earGroup;
  };

  headGroup.add(createEar(true));
  headGroup.add(createEar(false));

  // Voluminous 3D Curly Hair Volume on Top & Crown
  const hairGroup = new THREE.Group();
  hairGroup.name = 'CurlyHairVolume';

  const hairCapGeo = new THREE.SphereGeometry(0.104, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
  hairCapGeo.scale(1.02, 0.98, 1.05);
  const hairCapMesh = new THREE.Mesh(hairCapGeo, hairMaterial);
  hairCapMesh.position.set(0, 0.055, -0.025);
  hairGroup.add(hairCapMesh);

  const curlCount = 64;
  const curlGeo = new THREE.SphereGeometry(0.026, 8, 8);
  for (let i = 0; i < curlCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0) * 0.48;

    const rx = 0.094 * Math.sin(phi) * Math.cos(theta);
    const ry = 0.088 * Math.cos(phi) + 0.048;
    const rz = 0.094 * Math.sin(phi) * Math.sin(theta) - 0.018;

    const curl = new THREE.Mesh(curlGeo, hairMaterial);
    curl.position.set(rx, ry, rz);
    const s = 0.8 + Math.random() * 0.45;
    curl.scale.set(s, s * 0.9, s * 1.1);
    hairGroup.add(curl);
  }
  headGroup.add(hairGroup);

  // 3D Sleek Rectangular Glasses Frame & Lenses
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'RectangularGlasses';

  const rimGeo = new THREE.BoxGeometry(0.048, 0.026, 0.007);
  const leftRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  leftRim.position.set(0.042, 0.026, 0.078);
  glassesGroup.add(leftRim);

  const leftLens = new THREE.Mesh(new THREE.PlaneGeometry(0.044, 0.023), glassesLensMaterial);
  leftLens.position.set(0.042, 0.026, 0.082);
  glassesGroup.add(leftLens);

  const rightRim = new THREE.Mesh(rimGeo, glassesFrameMaterial);
  rightRim.position.set(-0.042, 0.026, 0.078);
  glassesGroup.add(rightRim);

  const rightLens = leftLens.clone();
  rightLens.position.set(-0.042, 0.026, 0.082);
  glassesGroup.add(rightLens);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.004, 0.006), glassesFrameMaterial);
  bridge.position.set(0, 0.028, 0.080);
  glassesGroup.add(bridge);

  const templeGeo = new THREE.BoxGeometry(0.005, 0.005, 0.115);
  const leftTemple = new THREE.Mesh(templeGeo, glassesFrameMaterial);
  leftTemple.position.set(0.066, 0.026, 0.025);
  glassesGroup.add(leftTemple);

  const rightTemple = leftTemple.clone();
  rightTemple.position.set(-0.066, 0.026, 0.025);
  glassesGroup.add(rightTemple);

  headGroup.add(glassesGroup);
  root.add(headGroup);

  // ---------------------------------------------------------------------------
  // 2. Neck & Cyber Over-Ear Headphones (y ~ 1.45 to 1.54m)
  // ---------------------------------------------------------------------------
  const neckGeo = new THREE.CylinderGeometry(0.052, 0.066, 0.12, 16);
  const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
  neckMesh.name = 'Mesh_Neck';
  neckMesh.position.set(0, 1.49, -0.012);
  root.add(neckMesh);

  const headphonesGroup = new THREE.Group();
  headphonesGroup.name = 'NeckHeadphones';
  headphonesGroup.position.set(0, 1.47, 0.008);

  const bandGeo = new THREE.TorusGeometry(0.094, 0.016, 12, 32, Math.PI * 1.35);
  const bandMesh = new THREE.Mesh(bandGeo, techHardwareMaterial);
  bandMesh.rotation.x = Math.PI / 1.72;
  bandMesh.rotation.z = -Math.PI * 0.675;
  headphonesGroup.add(bandMesh);

  const createEarcup = (isLeft) => {
    const cupGroup = new THREE.Group();
    const cupGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.026, 16);
    const cupMesh = new THREE.Mesh(cupGeo, techHardwareMaterial);
    cupMesh.rotation.z = isLeft ? Math.PI / 2.3 : -Math.PI / 2.3;
    cupGroup.add(cupMesh);

    const ringGeo = new THREE.TorusGeometry(0.035, 0.005, 8, 20);
    const ringMesh = new THREE.Mesh(ringGeo, cyanGlowMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, 0, isLeft ? 0.014 : -0.014);
    cupGroup.add(ringMesh);

    cupGroup.position.set(isLeft ? 0.098 : -0.098, -0.01, 0.048);
    return cupGroup;
  };

  headphonesGroup.add(createEarcup(true));
  headphonesGroup.add(createEarcup(false));
  root.add(headphonesGroup);

  // ---------------------------------------------------------------------------
  // 3. Torso & Black Cyber Hoodie (y ~ 0.90 to 1.42m)
  // ---------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'TorsoGroup';

  const torsoFrontGeo = createSculptedTorsoGeometry();
  const torsoFrontMesh = new THREE.Mesh(torsoFrontGeo, torsoTexturedMaterial);
  torsoFrontMesh.name = 'Mesh_TorsoPhoto';
  torsoFrontMesh.position.set(0, 1.16, 0.018);
  torsoGroup.add(torsoFrontMesh);

  const torsoBackGeo = new THREE.CylinderGeometry(0.180, 0.165, 0.50, 20);
  torsoBackGeo.scale(1.10, 1.0, 0.70);
  const torsoBackMesh = new THREE.Mesh(torsoBackGeo, hoodieMaterial);
  torsoBackMesh.position.set(0, 1.15, -0.035);
  torsoGroup.add(torsoBackMesh);

  const hoodGeo = new THREE.SphereGeometry(0.15, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
  hoodGeo.scale(1.15, 0.85, 0.88);
  const hoodMesh = new THREE.Mesh(hoodGeo, hoodieMaterial);
  hoodMesh.position.set(0, 1.36, -0.10);
  hoodMesh.rotation.x = -Math.PI / 4.2;
  torsoGroup.add(hoodMesh);

  const pocketGeo = new THREE.BoxGeometry(0.19, 0.115, 0.035);
  const pocketMesh = new THREE.Mesh(pocketGeo, hoodieMaterial);
  pocketMesh.position.set(0, 1.00, 0.128);
  torsoGroup.add(pocketMesh);

  const logoGroup = new THREE.Group();
  logoGroup.name = 'GlowingCodeInsignia';
  logoGroup.position.set(0.076, 1.28, 0.136);

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
  // 4. Arms & Hands (Ready Stance with Smartwatch & Bracelet)
  // ---------------------------------------------------------------------------
  const createArm = (isLeft) => {
    const armGroup = new THREE.Group();
    armGroup.name = isLeft ? 'LeftArm' : 'RightArm';
    armGroup.position.set(isLeft ? 0.24 : -0.24, 1.34, 0);

    const shoulderGeo = new THREE.SphereGeometry(0.074, 14, 12);
    const shoulder = new THREE.Mesh(shoulderGeo, hoodieMaterial);
    armGroup.add(shoulder);

    const upperGeo = new THREE.CylinderGeometry(0.062, 0.054, 0.27, 12);
    const upper = new THREE.Mesh(upperGeo, hoodieMaterial);
    upper.position.set(isLeft ? 0.03 : -0.03, -0.13, 0.02);
    upper.rotation.z = isLeft ? -0.12 : 0.12;
    armGroup.add(upper);

    const foreGeo = new THREE.CylinderGeometry(0.052, 0.045, 0.26, 12);
    const forearm = new THREE.Mesh(foreGeo, hoodieMaterial);
    forearm.position.set(isLeft ? 0.056 : -0.056, -0.34, 0.07);
    forearm.rotation.x = 0.28;
    forearm.rotation.z = isLeft ? -0.15 : 0.15;
    armGroup.add(forearm);

    if (isLeft) {
      const watchGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.025, 14);
      const watch = new THREE.Mesh(watchGeo, techHardwareMaterial);
      watch.position.set(0.074, -0.45, 0.11);
      watch.rotation.x = 0.28;
      armGroup.add(watch);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.005, 0.026), cyanGlowMaterial);
      screen.position.set(0.076, -0.44, 0.145);
      armGroup.add(screen);
    } else {
      const braceletGeo = new THREE.TorusGeometry(0.044, 0.007, 8, 16);
      const bracelet = new THREE.Mesh(braceletGeo, techHardwareMaterial);
      bracelet.position.set(-0.074, -0.45, 0.11);
      bracelet.rotation.x = Math.PI / 2.3;
      armGroup.add(bracelet);
    }

    const handGroup = new THREE.Group();
    const palmGeo = new THREE.BoxGeometry(0.042, 0.065, 0.030);
    const palm = new THREE.Mesh(palmGeo, skinMaterial);
    handGroup.add(palm);

    const thumbGeo = new THREE.BoxGeometry(0.014, 0.032, 0.016);
    const thumb = new THREE.Mesh(thumbGeo, skinMaterial);
    thumb.position.set(isLeft ? -0.022 : 0.022, 0.01, 0.015);
    thumb.rotation.z = isLeft ? 0.35 : -0.35;
    handGroup.add(thumb);

    handGroup.position.set(isLeft ? 0.076 : -0.076, -0.49, 0.125);
    handGroup.rotation.x = 0.3;
    armGroup.add(handGroup);

    return armGroup;
  };

  root.add(createArm(true));
  root.add(createArm(false));

  // ---------------------------------------------------------------------------
  // 5. Tactical Cargo Joggers (y ~ 0.18 to 0.88m)
  // ---------------------------------------------------------------------------
  const legsGroup = new THREE.Group();
  legsGroup.name = 'TacticalPantsGroup';

  const legsFrontGeo = createSculptedLegsGeometry();
  const legsFrontMesh = new THREE.Mesh(legsFrontGeo, legsTexturedMaterial);
  legsFrontMesh.name = 'Mesh_LegsPhoto';
  legsFrontMesh.position.set(0, 0.52, 0.015);
  legsGroup.add(legsFrontMesh);

  const pelvisGeo = new THREE.CylinderGeometry(0.180, 0.165, 0.20, 16);
  pelvisGeo.scale(1.10, 1.0, 0.70);
  const pelvis = new THREE.Mesh(pelvisGeo, hoodieMaterial);
  pelvis.position.set(0, 0.80, -0.035);
  legsGroup.add(pelvis);

  const cargoPocketGeo = new THREE.BoxGeometry(0.040, 0.13, 0.09);
  const leftPocket = new THREE.Mesh(cargoPocketGeo, hoodieMaterial);
  leftPocket.position.set(0.19, 0.58, 0.01);
  legsGroup.add(leftPocket);

  const rightPocket = new THREE.Mesh(cargoPocketGeo, hoodieMaterial);
  rightPocket.position.set(-0.19, 0.58, 0.01);
  legsGroup.add(rightPocket);

  root.add(legsGroup);

  // ---------------------------------------------------------------------------
  // 6. High-Top Sneakers (y ~ 0.0 to 0.18m)
  // ---------------------------------------------------------------------------
  const createSneaker = (isLeft) => {
    const sneaker = new THREE.Group();
    sneaker.name = isLeft ? 'LeftSneaker' : 'RightSneaker';

    const soleGeo = new THREE.BoxGeometry(0.106, 0.046, 0.245);
    const soleMesh = new THREE.Mesh(soleGeo, sneakerWhiteMaterial);
    soleMesh.position.set(0, 0.023, 0.035);
    sneaker.add(soleMesh);

    const upperGeo = new THREE.BoxGeometry(0.098, 0.076, 0.215);
    const upperMesh = new THREE.Mesh(upperGeo, hoodieMaterial);
    upperMesh.position.set(0, 0.076, 0.025);
    sneaker.add(upperMesh);

    const toeGeo = new THREE.SphereGeometry(0.048, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    toeGeo.scale(1.0, 0.72, 1.25);
    const toeMesh = new THREE.Mesh(toeGeo, sneakerWhiteMaterial);
    toeMesh.position.set(0, 0.046, 0.125);
    sneaker.add(toeMesh);

    const stripeGeo = new THREE.BoxGeometry(0.102, 0.022, 0.145);
    const stripeMesh = new THREE.Mesh(stripeGeo, sneakerAccentMaterial);
    stripeMesh.position.set(0, 0.066, 0.015);
    sneaker.add(stripeMesh);

    const collarGeo = new THREE.CylinderGeometry(0.054, 0.054, 0.068, 14);
    const collarMesh = new THREE.Mesh(collarGeo, hoodieMaterial);
    collarMesh.position.set(0, 0.132, -0.01);
    sneaker.add(collarMesh);

    return sneaker;
  };

  const leftSneaker = createSneaker(true);
  leftSneaker.position.set(0.122, 0, 0);
  root.add(leftSneaker);

  const rightSneaker = createSneaker(false);
  rightSneaker.position.set(-0.122, 0, 0);
  root.add(rightSneaker);

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
  console.log('Generating realistic 3D human character avatar for Girish Gowda H R...');
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
