export type Ask =
  | "grundflaeche"
  | "mantellinie"
  | "mantelflaeche"
  | "oberflaeche"
  | "hoeheFromMantellinie"
  | "radiusFromMantellinie"
  | "volumen"
  | "radiusFromVolumen"
  | "hoeheFromVolumen"
  | "skalierung";

export interface Task {
  ask: Ask;
  question: string;
  askLabel: string;
  unit: string;
  target: number;
  tolerance: number;
  radius: number;
  height: number;
  radiusKnown: boolean;
  heightKnown: boolean;
  slant?: number;
  slantKnown?: boolean;
  steps: string[];
}

export const OBERFLAECHE_ASKS: Ask[] = [
  "grundflaeche",
  "mantellinie",
  "mantelflaeche",
  "oberflaeche",
  "hoeheFromMantellinie",
  "radiusFromMantellinie",
];
export const VOLUMEN_ASKS: Ask[] = ["volumen", "radiusFromVolumen", "hoeheFromVolumen"];
export const GEMISCHT_ASKS: Ask[] = [...OBERFLAECHE_ASKS, ...VOLUMEN_ASKS, "skalierung"];

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBase() {
  return { radius: round1(randomBetween(2, 6)), height: round1(randomBetween(4, 10)) };
}

function genGrundflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const g = Math.PI * r ** 2;
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Grundfläche G.`,
    `Bestimme die Grundfläche eines Kegels mit Radius r = ${r} cm.`,
    `Wie groß ist die Grundfläche eines Kegels mit Radius r = ${r} cm?`,
  ]);
  return {
    ask: "grundflaeche",
    question,
    askLabel: "Grundfläche G",
    unit: "cm²",
    target: g,
    tolerance: Math.max(0.2, g * 0.02),
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps: ["G = π · r²", `G = π · ${r}²`, `G ≈ ${g.toFixed(2)} cm²`],
  };
}

function genMantellinie(): Task {
  const { radius: r, height: h } = randomBase();
  const s = Math.sqrt(r ** 2 + h ** 2);
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Mantellinie s.`,
    `Bestimme die Mantellinie eines Kegels mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
    `Wie lang ist die Mantellinie eines Kegels mit Radius r = ${r} cm und Höhe h = ${h} cm?`,
  ]);
  return {
    ask: "mantellinie",
    question,
    askLabel: "Mantellinie s",
    unit: "cm",
    target: s,
    tolerance: Math.max(0.05, s * 0.02),
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps: ["s = √(r² + h²)", `s = √(${r}² + ${h}²)`, `s ≈ ${s.toFixed(2)} cm`],
  };
}

function genMantelflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const s = Math.sqrt(r ** 2 + h ** 2);
  const m = Math.PI * r * s;
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Mantelfläche M.`,
    `Bestimme die Mantelfläche eines Kegels mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
  ]);
  return {
    ask: "mantelflaeche",
    question,
    askLabel: "Mantelfläche M",
    unit: "cm²",
    target: m,
    tolerance: Math.max(0.2, m * 0.02),
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Mantellinie: s = √(r² + h²)",
      `s = √(${r}² + ${h}²) ≈ ${s.toFixed(2)} cm`,
      "Dann die Mantelfläche: M = π · r · s",
      `M ≈ ${m.toFixed(2)} cm²`,
    ],
  };
}

function genOberflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const s = Math.sqrt(r ** 2 + h ** 2);
  const o = Math.PI * r ** 2 + Math.PI * r * s;
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Gesamtoberfläche O.`,
    `Bestimme die Gesamtoberfläche eines Kegels mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
    `Eine kegelförmige Mütze (r = ${r} cm, h = ${h} cm) soll komplett aus Stoff genäht werden – inklusive Boden. Wie groß ist die Gesamtoberfläche?`,
  ]);
  return {
    ask: "oberflaeche",
    question,
    askLabel: "Gesamtoberfläche O",
    unit: "cm²",
    target: o,
    tolerance: Math.max(0.2, o * 0.02),
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Mantellinie: s = √(r² + h²)",
      `s ≈ ${s.toFixed(2)} cm`,
      "O = π · r² + π · r · s",
      `O ≈ ${o.toFixed(2)} cm²`,
    ],
  };
}

function genHoeheFromMantellinie(): Task {
  const { radius: r, height: h } = randomBase();
  const s = round1(Math.sqrt(r ** 2 + h ** 2));
  const target = Math.sqrt(Math.max(s ** 2 - r ** 2, 0));
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Mantellinie s = ${s} cm. Berechne die Höhe h.`,
    `Welche Höhe hat ein Kegel mit Radius r = ${r} cm und Mantellinie s = ${s} cm?`,
  ]);
  return {
    ask: "hoeheFromMantellinie",
    question,
    askLabel: "Höhe h",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: r,
    height: target,
    radiusKnown: true,
    heightKnown: false,
    slant: s,
    slantKnown: true,
    steps: [
      "Rechtwinkliges Dreieck aus r, h und s: s² = r² + h²  ⟹  h = √(s² − r²)",
      `h = √(${s}² − ${r}²)`,
      `h ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genRadiusFromMantellinie(): Task {
  const { radius: r, height: h } = randomBase();
  const s = round1(Math.sqrt(r ** 2 + h ** 2));
  const target = Math.sqrt(Math.max(s ** 2 - h ** 2, 0));
  const question = pick([
    `Ein Kegel hat die Höhe h = ${h} cm und die Mantellinie s = ${s} cm. Berechne den Radius r.`,
    `Welchen Radius hat ein Kegel mit Höhe h = ${h} cm und Mantellinie s = ${s} cm?`,
  ]);
  return {
    ask: "radiusFromMantellinie",
    question,
    askLabel: "Radius r",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: target,
    height: h,
    radiusKnown: false,
    heightKnown: true,
    slant: s,
    slantKnown: true,
    steps: [
      "Rechtwinkliges Dreieck aus r, h und s: s² = r² + h²  ⟹  r = √(s² − h²)",
      `r = √(${s}² − ${h}²)`,
      `r ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = (1 / 3) * Math.PI * r ** 2 * h;
  const question = pick([
    `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne das Volumen V.`,
    `Bestimme das Volumen eines Kegels mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
  ]);
  return {
    ask: "volumen",
    question,
    askLabel: "Volumen V",
    unit: "cm³",
    target: v,
    tolerance: Math.max(0.5, v * 0.02),
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps: ["V = ⅓ · π · r² · h", `V = ⅓ · π · ${r}² · ${h}`, `V ≈ ${v.toFixed(2)} cm³`],
  };
}

function genRadiusFromVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = round1((1 / 3) * Math.PI * r ** 2 * h);
  const target = Math.sqrt((3 * v) / (Math.PI * h));
  const question = pick([
    `Ein Kegel mit Höhe h = ${h} cm hat das Volumen V = ${v} cm³. Berechne den Radius r.`,
    `Welchen Radius hat ein Kegel mit Höhe h = ${h} cm und Volumen V = ${v} cm³?`,
  ]);
  return {
    ask: "radiusFromVolumen",
    question,
    askLabel: "Radius r",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: target,
    height: h,
    radiusKnown: false,
    heightKnown: true,
    steps: [
      "V = ⅓ · π · r² · h  ⟹  r = √(3 · V / (π · h))",
      `r = √(3 · ${v} / (π · ${h}))`,
      `r ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genHoeheFromVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = round1((1 / 3) * Math.PI * r ** 2 * h);
  const target = (3 * v) / (Math.PI * r ** 2);
  const question = pick([
    `Ein Kegel mit Radius r = ${r} cm hat das Volumen V = ${v} cm³. Berechne die Höhe h.`,
    `Welche Höhe hat ein Kegel mit Radius r = ${r} cm und Volumen V = ${v} cm³?`,
  ]);
  return {
    ask: "hoeheFromVolumen",
    question,
    askLabel: "Höhe h",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: r,
    height: target,
    radiusKnown: true,
    heightKnown: false,
    steps: [
      "V = ⅓ · π · r² · h  ⟹  h = 3 · V / (π · r²)",
      `h = 3 · ${v} / (π · ${r}²)`,
      `h ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genSkalierung(): Task {
  const factor = pick([2, 3, 0.5]);
  const factorText = factor === 2 ? "verdoppelt" : factor === 3 ? "verdreifacht" : "halbiert";
  const variable = pick(["radius", "hoehe"] as const);
  const target = variable === "radius" ? factor ** 2 : factor;
  const { radius: r, height: h } = randomBase();

  const question =
    variable === "radius"
      ? `Bei einem Kegel wird der Radius ${factorText}, die Höhe bleibt gleich. Um welchen Faktor ändert sich das Volumen?`
      : `Bei einem Kegel wird die Höhe ${factorText}, der Radius bleibt gleich. Um welchen Faktor ändert sich das Volumen?`;

  return {
    ask: "skalierung",
    question,
    askLabel: "Faktor für das Volumen",
    unit: "",
    target,
    tolerance: 0.05,
    radius: r,
    height: h,
    radiusKnown: true,
    heightKnown: true,
    steps:
      variable === "radius"
        ? ["Das Volumen eines Kegels wächst mit r² (bei fester Höhe).", `Faktor = ${factor}² = ${target}`]
        : ["Das Volumen eines Kegels wächst linear mit der Höhe (bei festem Radius).", `Faktor = ${factor}`],
  };
}

export function generateTask(pool: Ask[]): Task {
  const ask = pick(pool);
  switch (ask) {
    case "grundflaeche":
      return genGrundflaeche();
    case "mantellinie":
      return genMantellinie();
    case "mantelflaeche":
      return genMantelflaeche();
    case "oberflaeche":
      return genOberflaeche();
    case "hoeheFromMantellinie":
      return genHoeheFromMantellinie();
    case "radiusFromMantellinie":
      return genRadiusFromMantellinie();
    case "volumen":
      return genVolumen();
    case "radiusFromVolumen":
      return genRadiusFromVolumen();
    case "hoeheFromVolumen":
      return genHoeheFromVolumen();
    case "skalierung":
      return genSkalierung();
  }
}
