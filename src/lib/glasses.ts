export interface Glasses {
  id: string;
  name: string;
  tagline: string;
  model: string;
  price: number;
  shape: string; // "rect" | "round" - used by the stylist
  color: string;
  turn?: number; // rotate the model about Y so the lenses face the camera
  lens?: string[]; // extra material names to treat as lenses
  hide?: string[]; // material names to hide
  recolor?: string[]; // material names that change colour (default: the biggest frame part)
  colors: { name: string; hex: string; original?: boolean }[];
}

export const glasses: Record<string, Glasses> = {
  bold: {
    id: "bold",
    name: "Heritage Bold",
    tagline: "Thick acetate rectangle with wood-grain temples.",
    model: "/models/glasses1.glb",
    price: 64,
    shape: "rect",
    color: "#111111",
    turn: 0,
    recolor: ["Frame", "Handles"],
    colors: [
      { name: "Original Black", hex: "#111111", original: true },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Burgundy", hex: "#5b1a2b" },
      { name: "Forest", hex: "#1f3d2e" },
    ],
  },
  wire: {
    id: "wire",
    name: "Round Wire",
    tagline: "Thin round wire frame with a light, vintage feel.",
    model: "/models/glasses.glb",
    price: 64,
    shape: "round",
    color: "#9e6549",
    turn: 0,
    recolor: ["Copper"],
    colors: [
      { name: "Original Copper", hex: "#9e6549", original: true },
      { name: "Gold", hex: "#d4af37" },
      { name: "Silver", hex: "#c0c0c0" },
      { name: "Black", hex: "#111111" },
    ],
  },
  rect: {
    id: "rect",
    name: "Slim Rectangle",
    tagline: "Lightweight everyday rectangle with metal hinges.",
    model: "/models/glasses2.glb",
    price: 64,
    shape: "rect",
    color: "#222222",
    turn: -Math.PI / 2,
    recolor: ["plastik"],
    colors: [
      { name: "Original Black", hex: "#222222", original: true },
      { name: "Navy", hex: "#1f2a44" },
      { name: "Tortoise", hex: "#6b3f1f" },
      { name: "Crimson", hex: "#7a1226" },
    ],
  },
};
export const glassesList = [glasses.bold, glasses.rect, glasses.wire];

export function getGlasses(id?: string | null): Glasses {
  return (id && glasses[id]) || glasses.bold;
}
