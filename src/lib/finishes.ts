import * as THREE from "three";

export type Finish = "gold" | "rosegold" | "silver" | "titanium" | "gunmetal" | "acetate";

/**
 * Physically based surface settings for luxury finishes. These only change how the surface reacts to
 * light (metalness, roughness, clear coat, index of refraction). The colour itself comes from the
 * colour swatch the shopper picked, or from the model's own colour.
 */
export const FINISHES: Record<
  Finish,
  { metalness: number; roughness: number; clearcoat: number; clearcoatRoughness: number; ior: number; specularIntensity: number }
> = {
  gold:      { metalness: 1, roughness: 0.2,  clearcoat: 0,   clearcoatRoughness: 0,    ior: 1.5, specularIntensity: 1 }, // polished 18k
  rosegold:  { metalness: 1, roughness: 0.24, clearcoat: 0,   clearcoatRoughness: 0,    ior: 1.5, specularIntensity: 1 },
  silver:    { metalness: 1, roughness: 0.16, clearcoat: 0,   clearcoatRoughness: 0,    ior: 1.5, specularIntensity: 1 }, // mirror-polished
  titanium:  { metalness: 1, roughness: 0.32, clearcoat: 0,   clearcoatRoughness: 0,    ior: 1.5, specularIntensity: 1 }, // satin
  gunmetal:  { metalness: 1, roughness: 0.28, clearcoat: 0.2, clearcoatRoughness: 0.2,  ior: 1.5, specularIntensity: 1 },
  acetate:   { metalness: 0, roughness: 0.18, clearcoat: 1,   clearcoatRoughness: 0.05, ior: 1.49, specularIntensity: 1 }, // glossy cellulose acetate
};

/** pick a finish from the colour's name ("Gold", "Rose Gold", "Silver", ...) */
export function finishFor(colorName: string, metal: boolean): Finish {
  if (!metal) return "acetate";
  if (/rose|copper|bronze/i.test(colorName)) return "rosegold";
  if (/silver|chrome|steel|platinum/i.test(colorName)) return "silver";
  if (/gunmetal/i.test(colorName)) return "gunmetal";
  if (/titan/i.test(colorName)) return "titanium";
  return "gold";
}

export function applyFinish(m: THREE.MeshPhysicalMaterial, f: Finish) {
  const p = FINISHES[f];
  m.metalness = p.metalness;
  m.roughness = p.roughness;
  m.clearcoat = p.clearcoat;
  m.clearcoatRoughness = p.clearcoatRoughness;
  m.ior = p.ior;
  m.specularIntensity = p.specularIntensity;
}

/**
 * Optical-glass lens: transmission 0.95, roughness 0.05, ior 1.52, thickness 0.5 cm, clear coat and a
 * little chromatic dispersion. Because the camera picture is drawn INSIDE the 3D scene (see
 * ARScene.attachVideo), transmission really refracts the user's face and room through the lens.
 *
 * Units: the model is normalised to 1 = frame width, and the frame is then scaled to `frameWidthCm`,
 * so a 0.5 cm lens becomes `0.5 / frameWidthCm` in model units.
 */
export function makeLensMaterial(tint: string, frameWidthCm: number) {
  const thickness = 0.5 / frameWidthCm;
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.52,
    thickness,
    attenuationColor: new THREE.Color(tint),
    attenuationDistance: thickness / 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    specularIntensity: 0.7,
    envMapIntensity: 0.9,
  });
  (m as unknown as { dispersion?: number }).dispersion = 0.25; // chromatic dispersion (three r163+)
  return m;
}