import { useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  secondaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
  SolutionBox,
} from "../../../components/raum-und-form/TaskLayout";
import PyramideSketch from "./PyramideSketch";

type Ask = "grundflaeche" | "seitenhoehe" | "mantelflaeche" | "oberflaeche" | "volumen";

type Task = {
  id: number;
  side: number;
  height: number;
  ask: Ask;
  askLabel: string;
  unit: string;
  target: number;
  question: string;
  steps: string[];
};

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
const askOptions: Ask[] = ["grundflaeche", "seitenhoehe", "mantelflaeche", "oberflaeche", "volumen"];

const askMeta: Record<Ask, { label: string; unit: string; question: string; formula: string }> = {
  grundflaeche: { label: "Grundfläche G", unit: "cm²", question: "Berechne die Grundfläche G.", formula: "G = a²" },
  seitenhoehe: { label: "Seitenhöhe h_s", unit: "cm", question: "Berechne die Seitenhöhe h_s.", formula: "h_s = √(h² + (a/2)²)" },
  mantelflaeche: { label: "Mantelfläche M", unit: "cm²", question: "Berechne die Mantelfläche M.", formula: "M = 2 · a · h_s" },
  oberflaeche: { label: "Gesamtoberfläche O", unit: "cm²", question: "Berechne die Gesamtoberfläche O.", formula: "O = a² + 2 · a · h_s" },
  volumen: { label: "Volumen V", unit: "cm³", question: "Berechne das Volumen V.", formula: "V = ⅓ · a² · h" },
};

function computeTarget(ask: Ask, side: number, height: number) {
  const g = side ** 2;
  const hs = Math.sqrt(height ** 2 + (side / 2) ** 2);
  const m = 2 * side * hs;
  if (ask === "grundflaeche") return g;
  if (ask === "seitenhoehe") return hs;
  if (ask === "mantelflaeche") return m;
  if (ask === "oberflaeche") return g + m;
  return (1 / 3) * g * height;
}

function makeTask(id: number): Task {
  const side = round1(randomBetween(4, 10));
  const height = round1(randomBetween(5, 12));
  const ask = askOptions[Math.floor(Math.random() * askOptions.length)];
  const target = computeTarget(ask, side, height);
  const meta = askMeta[ask];
  return {
    id,
    side,
    height,
    ask,
    askLabel: meta.label,
    unit: meta.unit,
    target,
    question: `Gegeben ist eine quadratische Pyramide mit Grundkante a = ${side} cm und Höhe h = ${height} cm. ${meta.question}`,
    steps: [meta.formula, `${meta.label} ≈ ${target.toFixed(2)} ${meta.unit}`],
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQueue(): Task[] {
  return shuffle(Array.from({ length: 8 }, (_, i) => makeTask(i))).map((t, idx) => ({ ...t, id: idx + 1 }));
}

export default function PyramideGemischt() {
  const [queue, setQueue] = useState<Task[]>(() => buildQueue());
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const task = queue[index];

  const resetUi = () => {
    setInput("");
    setFeedback(null);
    setShowSolution(false);
  };

  const goTo = (i: number) => {
    setIndex(i);
    resetUi();
  };

  const handleCheck = () => {
    const val = parseFloat(input.replace(",", "."));
    if (Number.isNaN(val)) {
      setFeedback("Bitte einen Wert eingeben.");
      return;
    }
    const correct = Math.abs(val - task.target) <= Math.max(0.5, task.target * 0.02);
    setFeedback(correct ? `Richtig! ${task.askLabel} ≈ ${task.target.toFixed(2)} ${task.unit}` : "Noch nicht ganz richtig.");
    if (!correct) setShowSolution(true);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Pyramide", href: "/raum-und-form/pyramide" },
        { label: "Gemischte Übungsaufgaben" },
      ]}
      title="Gemischte Übungsaufgaben"
      description="Grundfläche, Seitenhöhe, Mantelfläche, Oberfläche und Volumen gemischt üben."
      backHref="/raum-und-form/pyramide"
      onReset={() => {
        setQueue(buildQueue());
        goTo(0);
      }}
      resetLabel="Neue Sitzung"
    >
      <div className={taskCardClass}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Aufgabe {index + 1} / {queue.length}
        </p>

        <div className={infoBoxClass}>{task.question}</div>

        <PyramideSketch side={task.side} height={task.height} unit="cm" />

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {task.askLabel} ({task.unit})
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              inputMode="decimal"
              placeholder="Zahl eingeben"
            />
            <button className={primaryButtonClass} onClick={handleCheck}>
              Prüfen
            </button>
          </div>
        </div>

        {feedback && <FeedbackBanner correct={feedback.startsWith("Richtig")}>{feedback}</FeedbackBanner>}

        {showSolution && (
          <SolutionBox>
            {task.steps.map((line, idx) => (
              <div key={idx} className="font-mono text-sm">
                {line}
              </div>
            ))}
          </SolutionBox>
        )}

        <div className="flex gap-2 justify-center pt-2">
          <button className={secondaryButtonClass} onClick={() => goTo(index === 0 ? queue.length - 1 : index - 1)}>
            Vorherige Aufgabe
          </button>
          <button className={secondaryButtonClass} onClick={() => goTo((index + 1) % queue.length)}>
            Nächste Aufgabe
          </button>
        </div>
      </div>
    </TaskLayout>
  );
}
