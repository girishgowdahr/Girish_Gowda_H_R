# Avatar Character Bible

All descriptions below are taken from the owner's own reference image. They describe the design, nothing more. Nothing here claims the avatar is an exact replica of anyone. Label it a **stylised representation** wherever it appears.

## 4.1 Identity (stays the same in every outfit)

| Feature | Reference |
|---|---|
| Hair | Short, dark, tight curls on top with tapered short sides |
| Face | Short trimmed beard or stubble, clear rectangular-frame glasses |
| Skin | Warm medium tone |
| Build | Athletic, broad shoulders, defined arms and legs. Slightly leaner in the suit and hoodie looks, which is a tailoring effect; keep one body model |
| Stance | Relaxed, weight even, hands in pockets, calm expression |
| Accessories common to all | Wristwatch or smartwatch, a bracelet |

One base body and one head. Outfits are separate meshes or material sets on the same skeleton.

## 4.2 Outfit sheets

### Outfit 1: `formal-suit`
- **Clothes:** charcoal two-piece suit, white shirt, dark patterned tie, white pocket square, dark belt, black leather oxford shoes, wristwatch and bracelet.
- **Pose:** standing, both hands in trouser pockets, slight head turn.
- **Scene:** high-rise glass office at night with a city skyline, a plant, a desk with warm strip lighting.
- **Palette:** charcoal, white, warm amber accents.

### Outfit 2: `gym`
- **Clothes:** fitted heather-grey t-shirt, black shorts with drawstring, white crew socks, blue running shoes, black smartwatch, orange wristband.
- **Remove before publishing:** every brand logo on the shirt, shorts, socks and shoes. Replace with plain fabric or an original GIRISH mark.
- **Pose:** standing, hands at hips or pockets, chest open.
- **Scene:** dark gym with squat racks and plates, yellow rack accents, overhead strip lights.
- **Palette:** grey, black, signal blue, yellow accent.

### Outfit 3: `dev-hoodie`
- **Clothes:** black hoodie with a glowing blue `</>` emblem on the chest, wireless headphones around the neck with blue glow, black backpack, black cargo joggers, black, white and blue chunky sneakers, bracelet.
- **Pose:** standing, hands in pockets, slight lean.
- **Scene:** dark developer lab with monitors showing code and blue neon strips.
- **Palette:** black, electric blue, white.

## 4.3 Module to outfit mapping (avatar theme data)

These records match the `avatar_theme` structure in doc 02 §4.2: `outfitId, poseId, sceneId, cameraPreset, lighting, transitionMs`. IDs must exist in the asset catalogue.

```json
{
  "schemaVersion": 1,
  "defaultThemeId": "theme-dev-lobby",
  "themes": [
    { "id": "theme-dev-lobby", "name": "Lobby", "outfitId": "dev-hoodie", "poseId": "idle-hands-pockets", "sceneId": "scene-dev-lab", "cameraPreset": "hero-three-quarter", "lighting": "cool-blue", "transitionMs": 700 },
    { "id": "theme-formal-career", "name": "Career and studies", "outfitId": "formal-suit", "poseId": "idle-hands-pockets", "sceneId": "scene-glass-office", "cameraPreset": "medium-front", "lighting": "warm-amber", "transitionMs": 700 },
    { "id": "theme-gym", "name": "Gym and fitness", "outfitId": "gym", "poseId": "idle-hands-hips", "sceneId": "scene-gym", "cameraPreset": "full-body-front", "lighting": "neutral-yellow", "transitionMs": 700 },
    { "id": "theme-dev-projects", "name": "Projects and skills", "outfitId": "dev-hoodie", "poseId": "idle-lean", "sceneId": "scene-dev-lab", "cameraPreset": "medium-front", "lighting": "cool-blue", "transitionMs": 700 }
  ],
  "moduleThemes": {
    "home": "theme-dev-lobby",
    "about": "theme-dev-lobby",
    "studies": "theme-formal-career",
    "career": "theme-formal-career",
    "achievements": "theme-formal-career",
    "certificates": "theme-formal-career",
    "publications": "theme-formal-career",
    "fitness": "theme-gym",
    "projects": "theme-dev-projects",
    "skills": "theme-dev-projects"
  }
}
```

The owner can change any mapping in the admin control center later, with no code change.

## 4.4 Asset catalogue entries (draft, to be completed with licence data)

```json
[
  { "id": "outfit-formal-suit", "type": "outfit", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "brandMarksRemoved": true, "publishable": false },
  { "id": "outfit-gym", "type": "outfit", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "brandMarksRemoved": false, "publishable": false },
  { "id": "outfit-dev-hoodie", "type": "outfit", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "brandMarksRemoved": true, "publishable": false },
  { "id": "scene-glass-office", "type": "scene", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "publishable": false },
  { "id": "scene-gym", "type": "scene", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "publishable": false },
  { "id": "scene-dev-lab", "type": "scene", "version": 1, "source": "OWNER_TO_CONFIRM", "licence": "OWNER_TO_CONFIRM", "publishable": false }
]
```

`publishable` stays `false` until the owner answers decisions 1 to 3 in section 0. The build must refuse to publish any asset with `publishable: false`.
