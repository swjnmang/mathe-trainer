export type Ask =
  | "grundflaeche"
  | "hypotenuse"
  | "mantelflaeche"
  | "oberflaeche"
  | "katheteFromHypotenuse"
  | "volumen"
  | "katheteFromVolumen"
  | "hoeheFromVolumen"
  | "skalierung";

export interface Task {
  ask: Ask;
  question: string;
  askLabel: string;
  unit: string;
  target: number;
  tolerance: number;
  a: number;
  b: number;
  prismHeight: number;
  aKnown: boolean;
  bKnown: boolean;
  heightKnown: boolean;
  hypotenuse?: number;
  hypotenuseKnown?: boolean;
  steps: string[];
}

export const OBERFLAECHE_ASKS: Ask[] = ["grundflaeche", "hypotenuse", "mantelflaeche", "oberflaeche", "katheteFromHypotenuse"];
export const VOLUMEN_ASKS: Ask[] = ["volumen", "katheteFromVolumen", "hoeheFromVolumen"];
export const GEMISCHT_ASKS: Ask[] = [...OBERFLAECHE_ASKS, ...VOLUMEN_ASKS, "skalierung"];

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBase() {
  return {
    a: round1(randomBetween(3, 7)),
    b: round1(randomBetween(3, 7)),
    prismHeight: round1(randomBetween(6, 14)),
  };
}

function genGrundflaeche(): Task {
  const { a, b, prismHeight } = randomBase();
  const g = 0.5 * a * b;
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm) hat die Prismenhöhe H = ${prismHeight} cm. Berechne die Grundfläche G.`,
    `Bestimme die Grundfläche eines Prismas mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm).`,
  ]);
  return {
    ask: "grundflaeche",
    question,
    askLabel: "Grundfläche G",
    unit: "cm²",
    target: g,
    tolerance: Math.max(0.2, g * 0.02),
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps: ["G = ½ · a · b", `G = ½ · ${a} · ${b}`, `G = ${g.toFixed(2)} cm²`],
  };
}

function genHypotenuse(): Task {
  const { a, b, prismHeight } = randomBase();
  const c = Math.sqrt(a ** 2 + b ** 2);
  const question = pick([
    `Ein Prisma hat eine rechtwinklige Dreiecksgrundfläche mit den Katheten a = ${a} cm und b = ${b} cm. Berechne die Hypotenuse c der Grundfläche.`,
    `Bestimme die Hypotenuse der rechtwinkligen Dreiecksgrundfläche eines Prismas mit Katheten a = ${a} cm und b = ${b} cm.`,
  ]);
  return {
    ask: "hypotenuse",
    question,
    askLabel: "Hypotenuse c",
    unit: "cm",
    target: c,
    tolerance: Math.max(0.05, c * 0.02),
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps: ["c = √(a² + b²)", `c = √(${a}² + ${b}²)`, `c ≈ ${c.toFixed(2)} cm`],
  };
}

function genMantelflaeche(): Task {
  const { a, b, prismHeight } = randomBase();
  const c = Math.sqrt(a ** 2 + b ** 2);
  const m = (a + b + c) * prismHeight;
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm) hat die Prismenhöhe H = ${prismHeight} cm. Berechne die Mantelfläche M.`,
  ]);
  return {
    ask: "mantelflaeche",
    question,
    askLabel: "Mantelfläche M",
    unit: "cm²",
    target: m,
    tolerance: Math.max(0.2, m * 0.02),
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Hypotenuse: c = √(a² + b²)",
      `c ≈ ${c.toFixed(2)} cm`,
      "M = (a + b + c) · H",
      `M ≈ ${m.toFixed(2)} cm²`,
    ],
  };
}

function genOberflaeche(): Task {
  const { a, b, prismHeight } = randomBase();
  const c = Math.sqrt(a ** 2 + b ** 2);
  const g = 0.5 * a * b;
  const m = (a + b + c) * prismHeight;
  const o = 2 * g + m;
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm) hat die Prismenhöhe H = ${prismHeight} cm. Berechne die Gesamtoberfläche O.`,
    `Ein Zeltkeil in Prismenform (rechtwinklige Grundfläche, Katheten a = ${a} cm, b = ${b} cm, Länge H = ${prismHeight} cm) soll komplett ummantelt werden. Wie groß ist die Gesamtoberfläche?`,
  ]);
  return {
    ask: "oberflaeche",
    question,
    askLabel: "Gesamtoberfläche O",
    unit: "cm²",
    target: o,
    tolerance: Math.max(0.2, o * 0.02),
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps: [
      "Erst die Hypotenuse: c = √(a² + b²)",
      `c ≈ ${c.toFixed(2)} cm`,
      "O = 2 · G + (a + b + c) · H, mit G = ½ · a · b",
      `O ≈ ${o.toFixed(2)} cm²`,
    ],
  };
}

function genKatheteFromHypotenuse(): Task {
  const { a, b, prismHeight } = randomBase();
  const c = round1(Math.sqrt(a ** 2 + b ** 2));
  const target = Math.sqrt(Math.max(c ** 2 - b ** 2, 0));
  const question = pick([
    `Ein Prisma hat eine rechtwinklige Dreiecksgrundfläche mit Kathete b = ${b} cm und Hypotenuse c = ${c} cm. Berechne die fehlende Kathete a.`,
    `Welche Länge hat die fehlende Kathete a einer rechtwinkligen Dreiecksgrundfläche mit Kathete b = ${b} cm und Hypotenuse c = ${c} cm?`,
  ]);
  return {
    ask: "katheteFromHypotenuse",
    question,
    askLabel: "Kathete a",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    a: target,
    b,
    prismHeight,
    aKnown: false,
    bKnown: true,
    heightKnown: true,
    hypotenuse: c,
    hypotenuseKnown: true,
    steps: [
      "c² = a² + b²  ⟹  a = √(c² − b²)",
      `a = √(${c}² − ${b}²)`,
      `a ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genVolumen(): Task {
  const { a, b, prismHeight } = randomBase();
  const g = 0.5 * a * b;
  const v = g * prismHeight;
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm) hat die Prismenhöhe H = ${prismHeight} cm. Berechne das Volumen V.`,
  ]);
  return {
    ask: "volumen",
    question,
    askLabel: "Volumen V",
    unit: "cm³",
    target: v,
    tolerance: Math.max(0.5, v * 0.02),
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps: ["G = ½ · a · b", `G = ${g.toFixed(2)} cm²`, "V = G · H", `V ≈ ${v.toFixed(2)} cm³`],
  };
}

function genKatheteFromVolumen(): Task {
  const { a, b, prismHeight } = randomBase();
  const v = round1(0.5 * a * b * prismHeight);
  const target = (2 * v) / (b * prismHeight);
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Kathete b = ${b} cm) und Prismenhöhe H = ${prismHeight} cm hat das Volumen V = ${v} cm³. Berechne die fehlende Kathete a.`,
  ]);
  return {
    ask: "katheteFromVolumen",
    question,
    askLabel: "Kathete a",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    a: target,
    b,
    prismHeight,
    aKnown: false,
    bKnown: true,
    heightKnown: true,
    steps: [
      "V = ½ · a · b · H  ⟹  a = 2 · V / (b · H)",
      `a = 2 · ${v} / (${b} · ${prismHeight})`,
      `a ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genHoeheFromVolumen(): Task {
  const { a, b, prismHeight } = randomBase();
  const v = round1(0.5 * a * b * prismHeight);
  const target = (2 * v) / (a * b);
  const question = pick([
    `Ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = ${a} cm, b = ${b} cm) hat das Volumen V = ${v} cm³. Berechne die Prismenhöhe H.`,
  ]);
  return {
    ask: "hoeheFromVolumen",
    question,
    askLabel: "Prismenhöhe H",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    a,
    b,
    prismHeight: target,
    aKnown: true,
    bKnown: true,
    heightKnown: false,
    steps: [
      "V = ½ · a · b · H  ⟹  H = 2 · V / (a · b)",
      `H = 2 · ${v} / (${a} · ${b})`,
      `H ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genSkalierung(): Task {
  const factor = pick([2, 3, 0.5]);
  const factorText = factor === 2 ? "verdoppelt" : factor === 3 ? "verdreifacht" : "halbiert";
  const variable = pick(["katheten", "hoehe"] as const);
  const target = variable === "katheten" ? factor ** 2 : factor;
  const { a, b, prismHeight } = randomBase();

  const question =
    variable === "katheten"
      ? `Bei einem Prisma mit rechtwinkliger Dreiecksgrundfläche werden beide Katheten ${factorText}, die Prismenhöhe bleibt gleich. Um welchen Faktor ändert sich das Volumen?`
      : `Bei einem Prisma mit rechtwinkliger Dreiecksgrundfläche wird die Prismenhöhe ${factorText}, die Grundfläche bleibt gleich. Um welchen Faktor ändert sich das Volumen?`;

  return {
    ask: "skalierung",
    question,
    askLabel: "Faktor für das Volumen",
    unit: "",
    target,
    tolerance: 0.05,
    a,
    b,
    prismHeight,
    aKnown: true,
    bKnown: true,
    heightKnown: true,
    steps:
      variable === "katheten"
        ? [
            "Werden beide Katheten skaliert, wächst die Grundfläche G = ½·a·b mit dem Quadrat des Faktors.",
            `Faktor = ${factor}² = ${target}`,
          ]
        : ["Das Volumen wächst linear mit der Prismenhöhe (bei fester Grundfläche).", `Faktor = ${factor}`],
  };
}

export function generateTask(pool: Ask[]): Task {
  const ask = pick(pool);
  switch (ask) {
    case "grundflaeche":
      return genGrundflaeche();
    case "hypotenuse":
      return genHypotenuse();
    case "mantelflaeche":
      return genMantelflaeche();
    case "oberflaeche":
      return genOberflaeche();
    case "katheteFromHypotenuse":
      return genKatheteFromHypotenuse();
    case "volumen":
      return genVolumen();
    case "katheteFromVolumen":
      return genKatheteFromVolumen();
    case "hoeheFromVolumen":
      return genHoeheFromVolumen();
    case "skalierung":
      return genSkalierung();
  }
}
