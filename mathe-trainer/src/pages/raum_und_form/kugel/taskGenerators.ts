export type Ask = "oberflaeche" | "radiusFromOberflaeche" | "volumen" | "radiusFromVolumen" | "skalierung";

export interface Task {
  ask: Ask;
  question: string;
  askLabel: string;
  unit: string;
  target: number;
  tolerance: number;
  radius: number;
  radiusKnown: boolean;
  steps: string[];
}

export const OBERFLAECHE_ASKS: Ask[] = ["oberflaeche", "radiusFromOberflaeche"];
export const VOLUMEN_ASKS: Ask[] = ["volumen", "radiusFromVolumen"];
export const GEMISCHT_ASKS: Ask[] = ["oberflaeche", "radiusFromOberflaeche", "volumen", "radiusFromVolumen", "skalierung"];

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genOberflaeche(): Task {
  const r = round1(randomBetween(2, 9));
  const o = 4 * Math.PI * r ** 2;
  const question = pick([
    `Eine Kugel hat den Radius r = ${r} cm. Berechne die Oberfläche O.`,
    `Bestimme die Oberfläche einer Kugel mit Radius r = ${r} cm.`,
    `Wie groß ist die Oberfläche einer Kugel, deren Radius r = ${r} cm beträgt?`,
    `Der Radius einer Kugel beträgt r = ${r} cm. Ermittle ihre Oberfläche.`,
  ]);
  return {
    ask: "oberflaeche",
    question,
    askLabel: "Oberfläche O",
    unit: "cm²",
    target: o,
    tolerance: Math.max(0.5, o * 0.02),
    radius: r,
    radiusKnown: true,
    steps: ["O = 4 · π · r²", `O = 4 · π · ${r}²`, `O ≈ ${o.toFixed(2)} cm²`],
  };
}

function genRadiusFromOberflaeche(): Task {
  const r = round1(randomBetween(2, 9));
  const o = round1(4 * Math.PI * r ** 2);
  const target = Math.sqrt(o / (4 * Math.PI));
  const question = pick([
    `Eine Kugel hat die Oberfläche O = ${o} cm². Berechne den Radius r.`,
    `Welchen Radius hat eine Kugel mit der Oberfläche O = ${o} cm²?`,
    `Für eine Kugel wurde die Oberfläche O = ${o} cm² gemessen. Wie groß ist ihr Radius?`,
    `Eine Kugel besitzt die Oberfläche O = ${o} cm². Bestimme den Radius r.`,
  ]);
  return {
    ask: "radiusFromOberflaeche",
    question,
    askLabel: "Radius r",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: target,
    radiusKnown: false,
    steps: ["O = 4 · π · r²  ⟹  r = √(O / (4 · π))", `r = √(${o} / (4 · π))`, `r ≈ ${target.toFixed(2)} cm`],
  };
}

function genVolumen(): Task {
  const r = round1(randomBetween(2, 9));
  const v = (4 / 3) * Math.PI * r ** 3;
  const question = pick([
    `Eine Kugel hat den Radius r = ${r} cm. Berechne das Volumen V.`,
    `Bestimme das Volumen einer Kugel mit Radius r = ${r} cm.`,
    `Wie viel Rauminhalt hat eine Kugel mit Radius r = ${r} cm?`,
    `Der Radius einer Kugel beträgt r = ${r} cm. Ermittle ihr Volumen.`,
  ]);
  return {
    ask: "volumen",
    question,
    askLabel: "Volumen V",
    unit: "cm³",
    target: v,
    tolerance: Math.max(0.5, v * 0.02),
    radius: r,
    radiusKnown: true,
    steps: ["V = ⁴⁄₃ · π · r³", `V = ⁴⁄₃ · π · ${r}³`, `V ≈ ${v.toFixed(2)} cm³`],
  };
}

function genRadiusFromVolumen(): Task {
  const r = round1(randomBetween(2, 9));
  const v = round1((4 / 3) * Math.PI * r ** 3);
  const target = Math.cbrt((3 * v) / (4 * Math.PI));
  const question = pick([
    `Eine Kugel hat das Volumen V = ${v} cm³. Berechne den Radius r.`,
    `Welchen Radius hat eine Kugel mit dem Volumen V = ${v} cm³?`,
    `Ein kugelförmiger Behälter fasst V = ${v} cm³. Wie groß ist sein Radius?`,
    `Eine Kugel hat ein Volumen von V = ${v} cm³. Bestimme den Radius r.`,
  ]);
  return {
    ask: "radiusFromVolumen",
    question,
    askLabel: "Radius r",
    unit: "cm",
    target,
    tolerance: Math.max(0.05, target * 0.02),
    radius: target,
    radiusKnown: false,
    steps: [
      "V = ⁴⁄₃ · π · r³  ⟹  r = ³√(3 · V / (4 · π))",
      `r = ³√(3 · ${v} / (4 · π))`,
      `r ≈ ${target.toFixed(2)} cm`,
    ],
  };
}

function genSkalierung(): Task {
  const factor = pick([2, 3, 0.5]);
  const quantity = pick(["volumen", "oberflaeche"] as const);
  const factorText = factor === 2 ? "verdoppelt" : factor === 3 ? "verdreifacht" : "halbiert";
  const target = quantity === "volumen" ? factor ** 3 : factor ** 2;
  const displayRadius = round1(randomBetween(3, 6));

  const question =
    quantity === "volumen"
      ? pick([
          `Der Radius einer Kugel wird ${factorText}. Um welchen Faktor ändert sich das Volumen?`,
          `Eine Kugel wird vergrößert, sodass sich ihr Radius ${factorText}. Wie verändert sich dadurch ihr Volumen (Faktor)?`,
        ])
      : pick([
          `Der Radius einer Kugel wird ${factorText}. Um welchen Faktor ändert sich die Oberfläche?`,
          `Eine Kugel wird vergrößert, sodass sich ihr Radius ${factorText}. Wie verändert sich dadurch ihre Oberfläche (Faktor)?`,
        ]);

  return {
    ask: "skalierung",
    question,
    askLabel: quantity === "volumen" ? "Faktor für das Volumen" : "Faktor für die Oberfläche",
    unit: "",
    target,
    tolerance: 0.05,
    radius: displayRadius,
    radiusKnown: true,
    steps:
      quantity === "volumen"
        ? ["Das Volumen einer Kugel wächst mit r³.", `Faktor = ${factor}³ = ${target}`]
        : ["Die Oberfläche einer Kugel wächst mit r².", `Faktor = ${factor}² = ${target}`],
  };
}

export function generateTask(pool: Ask[]): Task {
  const ask = pick(pool);
  switch (ask) {
    case "oberflaeche":
      return genOberflaeche();
    case "radiusFromOberflaeche":
      return genRadiusFromOberflaeche();
    case "volumen":
      return genVolumen();
    case "radiusFromVolumen":
      return genRadiusFromVolumen();
    case "skalierung":
      return genSkalierung();
  }
}
