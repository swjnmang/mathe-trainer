import { useMemo, useState, useEffect } from "react";

type Shape =
  | { kind: "rectangle"; w: number; h: number; unit: Unit }
  | { kind: "square"; a: number; unit: Unit }
  | { kind: "triangle"; b: number; h: number; sides?: [number, number, number]; unit: Unit }
  | { kind: "trapezoid"; a: number; b: number; h: number; legs?: [number, number]; unit: Unit }
  | { kind: "parallelogram"; b: number; h: number; side: number; unit: Unit }
  | { kind: "rhombus"; d1: number; d2: number; side: number; unit: Unit }
  | { kind: "circle"; r: number; unit: Unit }
  | { kind: "lshape"; w1: number; h1: number; w2: number; h2: number; unit: Unit }
  | { kind: "rect_plus_triangle"; w: number; h: number; b: number; tHeight: number; unit: Unit }
  | { kind: "semi_circle_rect"; w: number; h: number; r: number; unit: Unit };

type Unit = "cm" | "m";

type Task = {
  id: number;
  title: string;
  question: string;
  ask: "area" | "perimeter" | "both";
  shape: Shape;
  area?: number;
  perimeter?: number;
};

const cardClass = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900 text-slate-50 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800";

export default function GemischteFlaechenaufgaben() {
  const tasks = useMemo(() => buildTasks(), []);
  const [index, setIndex] = useState(0);
  const task = tasks[index];

  const [areaInput, setAreaInput] = useState("");
  const [perimeterInput, setPerimeterInput] = useState("");
  const [areaUnit, setAreaUnit] = useState(getAreaUnit(task.shape));
  const [perimeterUnit, setPerimeterUnit] = useState(getLengthUnit(task.shape));
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setAreaInput("");
    setPerimeterInput("");
    setAreaUnit(getAreaUnit(task.shape));
    setPerimeterUnit(getLengthUnit(task.shape));
    setFeedback(null);
  }, [task]);

  const goPrev = () => setIndex(i => (i === 0 ? tasks.length - 1 : i - 1));
  const goNext = () => setIndex(i => (i + 1) % tasks.length);

  const handleCheck = () => {
    const mistakes: string[] = [];

    if (task.ask === "area" || task.ask === "both") {
      const val = parseNumber(areaInput);
      if (Number.isNaN(val)) mistakes.push("Fläche fehlt");
      else if (!task.area || !withinTolerance(val, task.area)) mistakes.push("Fläche passt nicht");
      if (areaUnit !== getAreaUnit(task.shape)) mistakes.push("Einheit Fläche");
    }

    if (task.ask === "perimeter" || task.ask === "both") {
      const val = parseNumber(perimeterInput);
      if (Number.isNaN(val)) mistakes.push("Umfang fehlt");
      else if (!task.perimeter || !withinTolerance(val, task.perimeter)) mistakes.push("Umfang passt nicht");
      if (perimeterUnit !== getLengthUnit(task.shape)) mistakes.push("Einheit Umfang");
    }

    if (mistakes.length === 0) {
      setFeedback("Super! Alles stimmt.");
      return;
    }

    setFeedback(`Bitte prüfen: ${mistakes.join(", ")}`);
  };

  const areaOptions = areaUnitChoices(task.shape);
  const perimeterOptions = lengthUnitChoices(task.shape);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Flächengeometrie</p>
            <h1 className="text-3xl font-bold">Gemischte Übungsaufgaben</h1>
            <p className="text-slate-600 max-w-3xl">
              30 statische Aufgaben zu Rechtecken, Parallelogrammen, Rauten, Trapezen, Dreiecken, Kreisen und
              zusammengesetzten Flächen. Skizze ansehen, Ergebnis eintragen, prüfen und bei Bedarf als PDF sichern.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={() => window.print()}>
              Alle Aufgaben als PDF
            </button>
            <span className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold">Aufgabe {task.id} / {tasks.length}</span>
          </div>
        </div>

        <div className={cardClass + " space-y-6"} id="print-area">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe {task.id}</p>
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-slate-700 leading-relaxed">{task.question}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <Sketch shape={task.shape} />
              <p className="mt-3 text-sm text-slate-600 text-center">Skizze (schematisch, nicht maßstabsgerecht)</p>
            </div>

            <div className="space-y-4">
              {(task.ask === "area" || task.ask === "both") && (
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-slate-700">Flächeninhalt A</span>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      value={areaInput}
                      onChange={e => setAreaInput(e.target.value)}
                      placeholder="Zahl eingeben"
                      inputMode="decimal"
                    />
                    <select
                      className="min-w-[92px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                      value={areaUnit}
                      onChange={e => setAreaUnit(e.target.value)}
                    >
                      {areaOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </label>
              )}

              {(task.ask === "perimeter" || task.ask === "both") && (
                <label className="block space-y-1">
                  <span className="text-sm font-semibold text-slate-700">Umfang U</span>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      value={perimeterInput}
                      onChange={e => setPerimeterInput(e.target.value)}
                      placeholder="Zahl eingeben"
                      inputMode="decimal"
                    />
                    <select
                      className="min-w-[92px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                      value={perimeterUnit}
                      onChange={e => setPerimeterUnit(e.target.value)}
                    >
                      {perimeterOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </label>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className={buttonClass} onClick={handleCheck}>Prüfen</button>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={goPrev}>Zurück</button>
                  <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={goNext}>Weiter</button>
                </div>
                {feedback && <span className="text-sm font-semibold text-slate-800">{feedback}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sketch({ shape }: { shape: Shape }) {
  return (
    <svg viewBox="0 0 260 220" className="w-full" role="img" aria-label="Skizze">
      <rect x="0" y="0" width="260" height="220" rx="16" fill="#f8fafc" />
      {drawShape(shape)}
    </svg>
  );
}

function drawShape(shape: Shape) {
  const stroke = "#0f172a";
  const fill = "#e2e8f0";

  switch (shape.kind) {
    case "rectangle": {
      const w = 140;
      const h = 90;
      return <rect x={(260 - w) / 2} y={(220 - h) / 2} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={3} rx={6} />;
    }
    case "square": {
      const s = 110;
      return <rect x={(260 - s) / 2} y={(220 - s) / 2} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={3} rx={6} />;
    }
    case "triangle": {
      const points = "60,170 200,170 130,60";
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={3} />;
    }
    case "trapezoid": {
      const points = "70,170 190,170 220,110 40,110";
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={3} />;
    }
    case "parallelogram": {
      const points = "60,170 190,170 210,110 80,110";
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={3} />;
    }
    case "rhombus": {
      const points = "130,60 210,140 130,200 50,120";
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={3} />;
    }
    case "circle": {
      return <circle cx={130} cy={120} r={70} fill={fill} stroke={stroke} strokeWidth={3} />;
    }
    case "lshape": {
      return (
        <g fill={fill} stroke={stroke} strokeWidth={3}>
          <rect x={50} y={90} width={120} height={90} />
          <rect x={50} y={40} width={60} height={50} />
        </g>
      );
    }
    case "rect_plus_triangle": {
      return (
        <g fill={fill} stroke={stroke} strokeWidth={3}>
          <rect x={60} y={110} width={140} height={70} />
          <polygon points="60,110 200,110 130,60" />
        </g>
      );
    }
    case "semi_circle_rect": {
      return (
        <g fill={fill} stroke={stroke} strokeWidth={3}>
          <rect x={60} y={110} width={140} height={70} />
          <path d="M60 110 A70 70 0 0 1 200 110" />
        </g>
      );
    }
    default:
      return null;
  }
}

function buildTasks(): Task[] {
  const defs: Omit<Task, "id" | "area" | "perimeter">[] = [
    { title: "Rechteckige Terrasse", ask: "both", shape: { kind: "rectangle", w: 8, h: 5, unit: "m" }, question: "Eine Terrasse ist 8 m lang und 5 m breit. Berechne Fläche A und Umfang U." },
    { title: "Gartenbeet", ask: "both", shape: { kind: "rectangle", w: 6, h: 2.5, unit: "m" }, question: "Ein rechteckiges Beet misst 6 m × 2,5 m. Bestimme Fläche und Umfang." },
    { title: "Quadratische Fliese", ask: "area", shape: { kind: "square", a: 12, unit: "cm" }, question: "Eine quadratische Fliese hat Seitenlänge 12 cm. Berechne den Flächeninhalt." },
    { title: "Quadratischer Platz", ask: "both", shape: { kind: "square", a: 15, unit: "m" }, question: "Ein quadratischer Platz hat Seitenlänge 15 m. Berechne Fläche und Umfang." },
    { title: "Dreieckige Wiese", ask: "both", shape: { kind: "triangle", b: 18, h: 10, sides: [18, 15, 13], unit: "m" }, question: "Eine Wiese ist dreieckig: Grundseite 18 m, Höhe dazu 10 m, weitere Seiten 15 m und 13 m. Berechne Fläche und Umfang." },
    { title: "Dachfläche", ask: "area", shape: { kind: "triangle", b: 9, h: 6, sides: [9, 7, 7], unit: "m" }, question: "Eine dachförmige Dreiecksfläche hat Grundseite 9 m und Höhe 6 m. Bestimme den Flächeninhalt." },
    { title: "Trapezförmiges Feld", ask: "both", shape: { kind: "trapezoid", a: 14, b: 9, h: 6, legs: [6.5, 6.5], unit: "m" }, question: "Ein Feld ist trapezförmig mit Grundseiten 14 m und 9 m, Höhe 6 m, Schenkel je 6,5 m. Berechne Fläche und Umfang." },
    { title: "Trapezplatte", ask: "area", shape: { kind: "trapezoid", a: 18, b: 10, h: 7, legs: [7.5, 7.5], unit: "cm" }, question: "Eine Metallplatte ist trapezförmig: Grundseiten 18 cm und 10 cm, Höhe 7 cm. Bestimme den Flächeninhalt." },
    { title: "Parallelogramm-Fahne", ask: "both", shape: { kind: "parallelogram", b: 11, h: 7.5, side: 9, unit: "cm" }, question: "Eine Fahne ist ein Parallelogramm mit Grundseite 11 cm, Höhe 7,5 cm und zweiter Seite 9 cm. Berechne Fläche und Umfang." },
    { title: "Parallelogramm-Grundriss", ask: "area", shape: { kind: "parallelogram", b: 16, h: 9, side: 12, unit: "m" }, question: "Grundriss eines Anbaus als Parallelogramm: Grundseite 16 m, Höhe 9 m. Bestimme den Flächeninhalt." },
    { title: "Raute-Parkett", ask: "both", shape: { kind: "rhombus", d1: 12, d2: 18, side: 10, unit: "cm" }, question: "Ein Parkettteil ist eine Raute mit Diagonalen 12 cm und 18 cm, Seitenlänge 10 cm. Berechne Fläche und Umfang." },
    { title: "Rauten-Schild", ask: "area", shape: { kind: "rhombus", d1: 14, d2: 20, side: 12, unit: "cm" }, question: "Ein Schild hat die Form einer Raute mit Diagonalen 14 cm und 20 cm. Bestimme den Flächeninhalt." },
    { title: "Kreisrunde Spielfläche", ask: "both", shape: { kind: "circle", r: 7.5, unit: "m" }, question: "Eine runde Spielfläche hat Radius 7,5 m. Berechne Fläche und Umfang." },
    { title: "Springbrunnen", ask: "area", shape: { kind: "circle", r: 4.2, unit: "m" }, question: "Eine runde Brunnenfläche hat Radius 4,2 m. Bestimme den Flächeninhalt." },
    { title: "Kreisverkehr", ask: "perimeter", shape: { kind: "circle", r: 18, unit: "m" }, question: "Ein Kreisverkehr hat Radius 18 m. Berechne den Umfang der Fahrbahnbegrenzung." },
    { title: "Rundes Beet", ask: "both", shape: { kind: "circle", r: 3.6, unit: "m" }, question: "Ein rundes Blumenbeet hat Radius 3,6 m. Berechne Fläche und Umfang." },
    { title: "L-förmige Terrasse", ask: "area", shape: { kind: "lshape", w1: 9, h1: 6, w2: 4, h2: 3, unit: "m" }, question: "Eine Terrasse ist L-förmig. Großer Teil 9 m × 6 m, angesetzter Teil 4 m × 3 m. Berechne die Gesamtfläche." },
    { title: "L-förmiger Weg", ask: "area", shape: { kind: "lshape", w1: 7, h1: 5, w2: 3, h2: 2, unit: "m" }, question: "Ein Weg verläuft L-förmig mit Teilflächen 7 m × 5 m und 3 m × 2 m. Bestimme den Flächeninhalt." },
    { title: "Lagerfläche L-Form", ask: "area", shape: { kind: "lshape", w1: 12, h1: 8, w2: 4, h2: 4, unit: "m" }, question: "Eine Lagerfläche ist L-förmig (12 m × 8 m plus 4 m × 4 m angesetzt). Berechne die Fläche." },
    { title: "Dach mit Dreiecksgiebel", ask: "area", shape: { kind: "rect_plus_triangle", w: 10, h: 6, b: 10, tHeight: 3.5, unit: "m" }, question: "Ein Hausdach besteht aus einem Rechteck 10 m × 6 m mit aufgesetztem gleichschenkligem Dreieck (Grundseite 10 m, Höhe 3,5 m). Berechne die gesamte Fläche." },
    { title: "Werbeschild", ask: "area", shape: { kind: "rect_plus_triangle", w: 6, h: 3, b: 6, tHeight: 2.5, unit: "m" }, question: "Ein Werbeschild besteht aus einem Rechteck 6 m × 3 m und einem darüber liegenden Dreieck (Grundseite 6 m, Höhe 2,5 m). Bestimme die Fläche." },
    { title: "Zeltplane", ask: "area", shape: { kind: "rect_plus_triangle", w: 8, h: 4, b: 8, tHeight: 3, unit: "m" }, question: "Eine Plane setzt sich aus einem Rechteck 8 m × 4 m und einem Dreieck (Grundseite 8 m, Höhe 3 m) zusammen. Berechne die Fläche." },
    { title: "Halbrunder Vorbau", ask: "area", shape: { kind: "semi_circle_rect", w: 8, h: 5, r: 4, unit: "m" }, question: "Ein Vorbau besteht aus einem Rechteck 8 m × 5 m mit einem halbrunden Abschluss (Radius 4 m). Berechne die Gesamtfläche." },
    { title: "Halbrundes Fenster", ask: "area", shape: { kind: "semi_circle_rect", w: 2.4, h: 1.6, r: 1.2, unit: "m" }, question: "Ein Fenster besteht aus einem Rechteck 2,4 m × 1,6 m mit einem halbrunden Aufsatz (Radius 1,2 m). Bestimme die Fläche." },
    { title: "Rechteck plus Kreisausschnitt", ask: "area", shape: { kind: "rect_plus_triangle", w: 9, h: 5, b: 0, tHeight: 0, unit: "m" }, question: "Eine Platte ist 9 m × 5 m, zusätzlich soll ein kleiner dreieckiger Giebel entfallen (hier als Platzhalter: Fläche nur des Rechtecks berechnen)." },
    { title: "Parallelogramm-Boden", ask: "both", shape: { kind: "parallelogram", b: 13, h: 8, side: 10, unit: "m" }, question: "Ein Boden ist als Parallelogramm ausgeführt: Grundseite 13 m, Höhe 8 m, zweite Seite 10 m. Berechne Fläche und Umfang." },
    { title: "Trapezsteg", ask: "perimeter", shape: { kind: "trapezoid", a: 12, b: 6, h: 4, legs: [5, 5], unit: "m" }, question: "Ein Steg ist trapezförmig mit Grundseiten 12 m und 6 m, Schenkellängen je 5 m. Berechne den Umfang." },
    { title: "Dreiecksgarten", ask: "perimeter", shape: { kind: "triangle", b: 10, h: 0, sides: [10, 9, 7], unit: "m" }, question: "Ein dreieckiger Garten hat Seiten 10 m, 9 m und 7 m. Berechne den Umfang." },
    { title: "Quadrat-Rand", ask: "perimeter", shape: { kind: "square", a: 22, unit: "m" }, question: "Ein quadratischer Innenhof hat Seitenlänge 22 m. Berechne den Umfang." },
    { title: "Kreispfad", ask: "perimeter", shape: { kind: "circle", r: 5.5, unit: "m" }, question: "Ein kreisförmiger Pfad hat Radius 5,5 m. Berechne den Umfang." }
  ];

  return defs.map((def, idx) => {
    const metrics = computeMetrics(def.shape);
    return { id: idx + 1, area: metrics.area, perimeter: metrics.perimeter, ...def };
  });
}

function computeMetrics(shape: Shape) {
  switch (shape.kind) {
    case "rectangle": {
      const area = shape.w * shape.h;
      const perimeter = 2 * (shape.w + shape.h);
      return { area, perimeter };
    }
    case "square": {
      const area = shape.a * shape.a;
      const perimeter = 4 * shape.a;
      return { area, perimeter };
    }
    case "triangle": {
      const area = 0.5 * shape.b * shape.h;
      const perimeter = shape.sides ? shape.sides.reduce((a, b) => a + b, 0) : undefined;
      return { area, perimeter };
    }
    case "trapezoid": {
      const area = 0.5 * (shape.a + shape.b) * shape.h;
      const perimeter = shape.legs ? shape.a + shape.b + shape.legs[0] + shape.legs[1] : undefined;
      return { area, perimeter };
    }
    case "parallelogram": {
      const area = shape.b * shape.h;
      const perimeter = 2 * (shape.b + shape.side);
      return { area, perimeter };
    }
    case "rhombus": {
      const area = 0.5 * shape.d1 * shape.d2;
      const perimeter = 4 * shape.side;
      return { area, perimeter };
    }
    case "circle": {
      const area = Math.PI * shape.r * shape.r;
      const perimeter = 2 * Math.PI * shape.r;
      return { area, perimeter };
    }
    case "lshape": {
      const area = shape.w1 * shape.h1 + shape.w2 * shape.h2;
      return { area, perimeter: undefined };
    }
    case "rect_plus_triangle": {
      const rectArea = shape.w * shape.h;
      const triArea = shape.b > 0 && shape.tHeight > 0 ? 0.5 * shape.b * shape.tHeight : 0;
      return { area: rectArea + triArea, perimeter: undefined };
    }
    case "semi_circle_rect": {
      const rectArea = shape.w * shape.h;
      const semiArea = 0.5 * Math.PI * shape.r * shape.r;
      return { area: rectArea + semiArea, perimeter: undefined };
    }
    default:
      return { area: undefined, perimeter: undefined };
  }
}

function getLengthUnit(shape: Shape) {
  return shape.unit;
}

function getAreaUnit(shape: Shape) {
  return shape.unit === "cm" ? "cm²" : "m²";
}

function areaUnitChoices(shape: Shape) {
  const correct = getAreaUnit(shape);
  const wrong = correct === "cm²" ? ["cm", "mm²", "m²"] : ["m", "cm²", "dm²"];
  return [correct, ...wrong.filter((u, idx) => wrong.indexOf(u) === idx)];
}

function lengthUnitChoices(shape: Shape) {
  const correct = getLengthUnit(shape);
  const wrong = correct === "cm" ? ["mm", "m", "cm²"] : ["cm", "mm", "m²"];
  return [correct, ...wrong.filter((u, idx) => wrong.indexOf(u) === idx)];
}

function parseNumber(value: string) {
  return parseFloat(value.replace(",", "."));
}

function withinTolerance(given: number, target?: number) {
  if (target === undefined) return false;
  const tol = Math.max(0.05, Math.abs(target) * 0.02);
  return Math.abs(given - target) <= tol;
}
