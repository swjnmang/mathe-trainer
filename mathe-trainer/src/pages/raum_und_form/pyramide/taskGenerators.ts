export type Ask =
  | "grundflaeche"
  | "seitenhoehe"
  | "mantelflaeche"
  | "oberflaeche"
  | "hoeheFromSeitenhoehe"
  | "seiteFromSeitenhoehe"
  | "volumen"
  | "seiteFromVolumen"
  | "hoeheFromVolumen"
  | "skalierung";

export interface Task {
  ask: Ask;
  question: string;
  askLabel: string;
  unit: string;
  target: number;
  tolerance: number;
  side: number;
  height: number;
  sideKnown: boolean;
  heightKnown: boolean;
  slantHeight?: number;
  slantHeightKnown?: boolean;
  steps: string[];
}

export const OBERFLAECHE_ASKS: Ask[] = [
  "grundflaeche",
  "seitenhoehe",
  "mantelflaeche",
  "oberflaeche",
  "hoeheFromSeitenhoehe",
  "seiteFromSeitenhoehe",
];
export const VOLUMEN_ASKS: Ask[] = ["volumen", "seiteFromVolumen", "hoeheFromVolumen"];
export const GEMISCHT_ASKS: Ask[] = [...OBERFLAECHE_ASKS, ...VOLUMEN_ASKS, "skalierung"];

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBase() {
  return { side: round1(randomBetween(4, 10)), height: round1(randomBetween(5, 12)) };
}

function genGrundflaeche(): Task {
  const { side: a, height: h } = randomBase();
  const g = a ** 2;
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne die Grundfläche G.`,
    `Bestimme die Grundfläche einer quadratischen Pyramide mit Grundkante a = ${a} cm.`,
  ]);
  return {
    ask: "grundflaeche",
    question,
    askLabel: "Grundfläche G",
    unit: "cm²",
    target: g,
    tolerance: Math.max(0.2, g * 0.02),
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps: ["G = a²", `G = ${a}²`, `G = ${g.toFixed(2)} cm²`],
  };
}

function genSeitenhoehe(): Task {
  const { side: a, height: h } = randomBase();
  const hs = Math.sqrt(h ** 2 + (a / 2) ** 2);
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne die Seitenhöhe h_s.`,
    `Bestimme die Seitenhöhe einer quadratischen Pyramide mit Grundkante a = ${a} cm und Höhe h = ${h} cm.`,
  ]);
  return {
    ask: "seitenhoehe",
    question,
    askLabel: "Seitenhöhe h_s",
    unit: "cm",
    target: hs,
    tolerance: Math.max(0.05, hs * 0.02),
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps: ["h_s = √(h² + (a/2)²)", `h_s = √(${h}² + (${a}/2)²)`, `h_s ≈ ${hs.toFixed(2)} cm`],
  };
}

function genMantelflaeche(): Task {
  const { side: a, height: h } = randomBase();
  const hs = Math.sqrt(h ** 2 + (a / 2) ** 2);
  const m = 2 * a * hs;
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne die Mantelfläche M.`,
    `Bestimme die Mantelfläche einer quadratischen Pyramide mit Grundkante a = ${a} cm und Höhe h = ${h} cm.`,
  ]);
  return {
    ask: "mantelflaeche",
    question,
    askLabel: "Mantelfläche M",
    unit: "cm²",
    target: m,
    tolerance: Math.max(0.2, m * 0.02),
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Seitenhöhe: h_s = √(h² + (a/2)²)",
      `h_s ≈ ${hs.toFixed(2)} cm`,
      "M = 2 · a · h_s",
      `M ≈ ${m.toFixed(2)} cm²`,
    ],
  };
}

function genOberflaeche(): Task {
  const { side: a, height: h } = randomBase();
  const hs = Math.sqrt(h ** 2 + (a / 2) ** 2);
  const o = a ** 2 + 2 * a * hs;
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne die Gesamtoberfläche O.`,
    `Bestimme die Gesamtoberfläche einer quadratischen Pyramide mit Grundkante a = ${a} cm und Höhe h = ${h} cm.`,
    `Eine pyramidenförmige Zeltplane hat eine quadratische Grundkante a = ${a} cm und Höhe h = ${h} cm. Wie viel Stoff wird insgesamt (inkl. Boden) benötigt?`,
  ]);
  return {
    ask: "oberflaeche",
    question,
    askLabel: "Gesamtoberfläche O",
    unit: "cm²",
    target: o,
    tolerance: Math.max(0.2, o * 0.02),
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Seitenhöhe: h_s = √(h² + (a/2)²)",
      `h_s ≈ ${hs.toFixed(2)} cm`,
      "O = a² + 2 · a · h_s",
      `O ≈ ${o.toFixed(2)} cm²`,
    ],
  };
}

function genHoeheFromSeitenhoehe(): Task {
  const { side: a, height: h } = randomBase();
  const hs = round1(Math.sqrt(h ** 2 + (a / 2) ** 2));
  const target = Math.sqrt(Math.max(hs ** 2 - (a / 2) ** 2, 0));
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Seitenhöhe h_s = ${hs} cm. Berechne die Höhe h.`,
    `Welche Höhe hat eine quadratische Pyramide mit Grundkante a = ${a} cm und Seitenhöhe h_s = ${hs} cm?`,
  ]);
  return {
    ask: "hoeheFromSeitenhoehe",
    question,
    askLabel: "Höhe h",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    side: a,
    height: target,
    sideKnown: true,
    heightKnown: false,
    slantHeight: hs,
    slantHeightKnown: true,
    steps: [
      "Rechtwinkliges Dreieck aus h, a/2 und h_s: h_s² = h² + (a/2)²  ⟹  h = √(h_s² − (a/2)²)",
      `h = √(${hs}² − (${a}/2)²)`,
      `h ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genSeiteFromSeitenhoehe(): Task {
  const { side: a, height: h } = randomBase();
  const hs = round1(Math.sqrt(h ** 2 + (a / 2) ** 2));
  const target = 2 * Math.sqrt(Math.max(hs ** 2 - h ** 2, 0));
  const question = pick([
    `Eine quadratische Pyramide hat die Höhe h = ${h} cm und die Seitenhöhe h_s = ${hs} cm. Berechne die Grundkante a.`,
    `Welche Grundkante hat eine quadratische Pyramide mit Höhe h = ${h} cm und Seitenhöhe h_s = ${hs} cm?`,
  ]);
  return {
    ask: "seiteFromSeitenhoehe",
    question,
    askLabel: "Grundkante a",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    side: target,
    height: h,
    sideKnown: false,
    heightKnown: true,
    slantHeight: hs,
    slantHeightKnown: true,
    steps: [
      "Rechtwinkliges Dreieck aus h, a/2 und h_s: h_s² = h² + (a/2)²  ⟹  a = 2 · √(h_s² − h²)",
      `a = 2 · √(${hs}² − ${h}²)`,
      `a ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genVolumen(): Task {
  const { side: a, height: h } = randomBase();
  const v = (1 / 3) * a ** 2 * h;
  const question = pick([
    `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Berechne das Volumen V.`,
    `Bestimme das Volumen einer quadratischen Pyramide mit Grundkante a = ${a} cm und Höhe h = ${h} cm.`,
  ]);
  return {
    ask: "volumen",
    question,
    askLabel: "Volumen V",
    unit: "cm³",
    target: v,
    tolerance: Math.max(0.5, v * 0.02),
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps: ["V = ⅓ · a² · h", `V = ⅓ · ${a}² · ${h}`, `V ≈ ${v.toFixed(2)} cm³`],
  };
}

function genSeiteFromVolumen(): Task {
  const { side: a, height: h } = randomBase();
  const v = round1((1 / 3) * a ** 2 * h);
  const target = Math.sqrt((3 * v) / h);
  const question = pick([
    `Eine quadratische Pyramide mit Höhe h = ${h} cm hat das Volumen V = ${v} cm³. Berechne die Grundkante a.`,
    `Welche Grundkante hat eine quadratische Pyramide mit Höhe h = ${h} cm und Volumen V = ${v} cm³?`,
  ]);
  return {
    ask: "seiteFromVolumen",
    question,
    askLabel: "Grundkante a",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    side: target,
    height: h,
    sideKnown: false,
    heightKnown: true,
    steps: [
      "V = ⅓ · a² · h  ⟹  a = √(3 · V / h)",
      `a = √(3 · ${v} / ${h})`,
      `a ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genHoeheFromVolumen(): Task {
  const { side: a, height: h } = randomBase();
  const v = round1((1 / 3) * a ** 2 * h);
  const target = (3 * v) / a ** 2;
  const question = pick([
    `Eine quadratische Pyramide mit Grundkante a = ${a} cm hat das Volumen V = ${v} cm³. Berechne die Höhe h.`,
    `Welche Höhe hat eine quadratische Pyramide mit Grundkante a = ${a} cm und Volumen V = ${v} cm³?`,
  ]);
  return {
    ask: "hoeheFromVolumen",
    question,
    askLabel: "Höhe h",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    side: a,
    height: target,
    sideKnown: true,
    heightKnown: false,
    steps: [
      "V = ⅓ · a² · h  ⟹  h = 3 · V / a²",
      `h = 3 · ${v} / ${a}²`,
      `h ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genSkalierung(): Task {
  const factor = pick([2, 3, 0.5]);
  const factorText = factor === 2 ? "verdoppelt" : factor === 3 ? "verdreifacht" : "halbiert";
  const variable = pick(["seite", "hoehe"] as const);
  const target = variable === "seite" ? factor ** 2 : factor;
  const { side: a, height: h } = randomBase();

  const question =
    variable === "seite"
      ? `Bei einer quadratischen Pyramide wird die Grundkante ${factorText}, die Höhe bleibt gleich. Um welchen Faktor ändert sich das Volumen?`
      : `Bei einer quadratischen Pyramide wird die Höhe ${factorText}, die Grundkante bleibt gleich. Um welchen Faktor ändert sich das Volumen?`;

  return {
    ask: "skalierung",
    question,
    askLabel: "Faktor für das Volumen",
    unit: "",
    target,
    tolerance: 0.05,
    side: a,
    height: h,
    sideKnown: true,
    heightKnown: true,
    steps:
      variable === "seite"
        ? ["Das Volumen einer Pyramide wächst mit a² (bei fester Höhe).", `Faktor = ${factor}² = ${target}`]
        : ["Das Volumen einer Pyramide wächst linear mit der Höhe (bei fester Grundkante).", `Faktor = ${factor}`],
  };
}

export function generateTask(pool: Ask[]): Task {
  const ask = pick(pool);
  switch (ask) {
    case "grundflaeche":
      return genGrundflaeche();
    case "seitenhoehe":
      return genSeitenhoehe();
    case "mantelflaeche":
      return genMantelflaeche();
    case "oberflaeche":
      return genOberflaeche();
    case "hoeheFromSeitenhoehe":
      return genHoeheFromSeitenhoehe();
    case "seiteFromSeitenhoehe":
      return genSeiteFromSeitenhoehe();
    case "volumen":
      return genVolumen();
    case "seiteFromVolumen":
      return genSeiteFromVolumen();
    case "hoeheFromVolumen":
      return genHoeheFromVolumen();
    case "skalierung":
      return genSkalierung();
  }
}
