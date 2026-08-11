export type Ask =
  | "grundflaeche"
  | "mantelflaeche"
  | "oberflaeche"
  | "hoeheFromOberflaeche"
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
  steps: string[];
}

export const OBERFLAECHE_ASKS: Ask[] = ["grundflaeche", "mantelflaeche", "oberflaeche", "hoeheFromOberflaeche"];
export const VOLUMEN_ASKS: Ask[] = ["volumen", "radiusFromVolumen", "hoeheFromVolumen"];
export const GEMISCHT_ASKS: Ask[] = [
  "grundflaeche",
  "mantelflaeche",
  "oberflaeche",
  "hoeheFromOberflaeche",
  "volumen",
  "radiusFromVolumen",
  "hoeheFromVolumen",
  "skalierung",
];

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBase() {
  return { radius: round1(randomBetween(2, 7)), height: round1(randomBetween(5, 15)) };
}

function genGrundflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const g = Math.PI * r ** 2;
  const question = pick([
    `Ein Zylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Grundfläche G.`,
    `Bestimme die Grundfläche eines Zylinders mit Radius r = ${r} cm (Höhe h = ${h} cm).`,
    `Wie groß ist die Grundfläche eines Zylinders mit Radius r = ${r} cm?`,
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

function genMantelflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const m = 2 * Math.PI * r * h;
  const question = pick([
    `Ein Zylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Mantelfläche M.`,
    `Bestimme die Mantelfläche eines Zylinders mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
    `Ein zylindrischer Behälter (r = ${r} cm, h = ${h} cm) soll mit Papier beklebt werden – ohne Deckel und Boden. Wie groß ist die benötigte Fläche?`,
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
    steps: ["M = 2 · π · r · h", `M = 2 · π · ${r} · ${h}`, `M ≈ ${m.toFixed(2)} cm²`],
  };
}

function genOberflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const o = 2 * Math.PI * r ** 2 + 2 * Math.PI * r * h;
  const question = pick([
    `Ein Zylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne die Gesamtoberfläche O.`,
    `Bestimme die Gesamtoberfläche eines Zylinders mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
    `Eine Konservendose (r = ${r} cm, h = ${h} cm) soll komplett mit Etikett und Deckeln beschichtet werden. Wie groß ist die Gesamtoberfläche?`,
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
    steps: ["O = 2 · π · r² + 2 · π · r · h", `O = 2 · π · ${r}² + 2 · π · ${r} · ${h}`, `O ≈ ${o.toFixed(2)} cm²`],
  };
}

function genHoeheFromOberflaeche(): Task {
  const { radius: r, height: h } = randomBase();
  const o = round1(2 * Math.PI * r ** 2 + 2 * Math.PI * r * h);
  const target = (o - 2 * Math.PI * r ** 2) / (2 * Math.PI * r);
  const question = pick([
    `Ein Zylinder mit Radius r = ${r} cm hat die Gesamtoberfläche O = ${o} cm². Berechne die Höhe h.`,
    `Welche Höhe hat ein Zylinder mit Radius r = ${r} cm und Gesamtoberfläche O = ${o} cm²?`,
    `Ein zylindrischer Tank mit Radius r = ${r} cm wurde mit O = ${o} cm² Blech ummantelt (inkl. Deckel/Boden). Wie hoch ist er?`,
  ]);
  return {
    ask: "hoeheFromOberflaeche",
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
      "O = 2 · π · r² + 2 · π · r · h  ⟹  h = (O − 2 · π · r²) / (2 · π · r)",
      `h = (${o} − 2 · π · ${r}²) / (2 · π · ${r})`,
      `h ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = Math.PI * r ** 2 * h;
  const question = pick([
    `Ein Zylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne das Volumen V.`,
    `Bestimme das Volumen eines Zylinders mit Radius r = ${r} cm und Höhe h = ${h} cm.`,
    `Wie viel passt in einen zylindrischen Behälter mit Radius r = ${r} cm und Höhe h = ${h} cm?`,
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
    steps: ["V = π · r² · h", `V = π · ${r}² · ${h}`, `V ≈ ${v.toFixed(2)} cm³`],
  };
}

function genRadiusFromVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = round1(Math.PI * r ** 2 * h);
  const target = Math.sqrt(v / (Math.PI * h));
  const question = pick([
    `Ein Zylinder mit Höhe h = ${h} cm hat das Volumen V = ${v} cm³. Berechne den Radius r.`,
    `Welchen Radius hat ein Zylinder mit Höhe h = ${h} cm und Volumen V = ${v} cm³?`,
    `Ein zylindrischer Tank mit Höhe h = ${h} cm fasst V = ${v} cm³. Wie groß ist sein Radius?`,
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
      "V = π · r² · h  ⟹  r = √(V / (π · h))",
      `r = √(${v} / (π · ${h}))`,
      `r ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genHoeheFromVolumen(): Task {
  const { radius: r, height: h } = randomBase();
  const v = round1(Math.PI * r ** 2 * h);
  const target = v / (Math.PI * r ** 2);
  const question = pick([
    `Ein Zylinder mit Radius r = ${r} cm hat das Volumen V = ${v} cm³. Berechne die Höhe h.`,
    `Welche Höhe hat ein Zylinder mit Radius r = ${r} cm und Volumen V = ${v} cm³?`,
    `Ein zylindrisches Fass mit Radius r = ${r} cm fasst V = ${v} cm³. Wie hoch ist es?`,
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
      "V = π · r² · h  ⟹  h = V / (π · r²)",
      `h = ${v} / (π · ${r}²)`,
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
      ? pick([
          `Bei einem Zylinder wird der Radius ${factorText}, die Höhe bleibt gleich. Um welchen Faktor ändert sich das Volumen?`,
          `Ein Zylinder wird so verändert, dass sich sein Radius ${factorText} (Höhe bleibt gleich). Wie verändert sich dadurch sein Volumen (Faktor)?`,
        ])
      : pick([
          `Bei einem Zylinder wird die Höhe ${factorText}, der Radius bleibt gleich. Um welchen Faktor ändert sich das Volumen?`,
          `Ein Zylinder wird so verändert, dass sich seine Höhe ${factorText} (Radius bleibt gleich). Wie verändert sich dadurch sein Volumen (Faktor)?`,
        ]);

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
        ? ["Das Volumen eines Zylinders wächst mit r² (bei fester Höhe).", `Faktor = ${factor}² = ${target}`]
        : ["Das Volumen eines Zylinders wächst linear mit der Höhe (bei festem Radius).", `Faktor = ${factor}`],
  };
}

export function generateTask(pool: Ask[]): Task {
  const ask = pick(pool);
  switch (ask) {
    case "grundflaeche":
      return genGrundflaeche();
    case "mantelflaeche":
      return genMantelflaeche();
    case "oberflaeche":
      return genOberflaeche();
    case "hoeheFromOberflaeche":
      return genHoeheFromOberflaeche();
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
