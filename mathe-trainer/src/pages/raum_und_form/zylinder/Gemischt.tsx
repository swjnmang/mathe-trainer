import { useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  secondaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
  SolutionBox,
} from "../../../components/raum-und-form/TaskLayout";
import ZylinderSketch from "./ZylinderSketch";

type Ask = "grundflaeche" | "mantelflaeche" | "oberflaeche" | "volumen";

type Task = {
  id: number;
  radius: number;
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
const askOptions: Ask[] = ["grundflaeche", "mantelflaeche", "oberflaeche", "volumen"];

const askMeta: Record<Ask, { label: string; unit: string; question: string; formula: string }> = {
  grundflaeche: { label: "Grundfläche G", unit: "cm²", question: "Berechne die Grundfläche G.", formula: "G = π · r²" },
  mantelflaeche: { label: "Mantelfläche M", unit: "cm²", question: "Berechne die Mantelfläche M.", formula: "M = 2 · π · r · h" },
  oberflaeche: { label: "Gesamtoberfläche O", unit: "cm²", question: "Berechne die Gesamtoberfläche O.", formula: "O = 2 · π · r² + 2 · π · r · h" },
  volumen: { label: "Volumen V", unit: "cm³", question: "Berechne das Volumen V.", formula: "V = π · r² · h" },
};

function computeTarget(ask: Ask, radius: number, height: number) {
  const g = Math.PI * radius ** 2;
  const m = 2 * Math.PI * radius * height;
  if (ask === "grundflaeche") return g;
  if (ask === "mantelflaeche") return m;
  if (ask === "oberflaeche") return 2 * g + m;
  return g * height;
}

function makeTask(id: number): Task {
  const radius = round1(randomBetween(2, 6));
  const height = round1(randomBetween(5, 14));
  const ask = askOptions[Math.floor(Math.random() * askOptions.length)];
  const target = computeTarget(ask, radius, height);
  const meta = askMeta[ask];
  return {
    id,
    radius,
    height,
    ask,
    askLabel: meta.label,
    unit: meta.unit,
    target,
    question: `Gegeben ist ein Zylinder mit Radius r = ${radius} cm und Höhe h = ${height} cm. ${meta.question}`,
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

export default function ZylinderGemischt() {
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
        { label: "Zylinder", href: "/raum-und-form/zylinder" },
        { label: "Gemischte Übungsaufgaben" },
      ]}
      title="Gemischte Übungsaufgaben"
      description="Grundfläche, Mantelfläche, Oberfläche und Volumen gemischt üben."
      backHref="/raum-und-form/zylinder"
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

        <ZylinderSketch radius={task.radius} height={task.height} unit="cm" />

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
