import { useEffect, useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
} from "../../../components/raum-und-form/TaskLayout";
import KegelSketch from "./KegelSketch";

type Task = { radius: number; height: number };

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTask(): Task {
  return { radius: round1(randomBetween(2, 6)), height: round1(randomBetween(4, 10)) };
}

function withinTolerance(given: number, target: number) {
  return Math.abs(given - target) <= Math.max(0.05, target * 0.02);
}

export default function KegelOberflaeche() {
  const [task, setTask] = useState<Task>(() => makeTask());
  const [slantInput, setSlantInput] = useState("");
  const [oberflaecheInput, setOberflaecheInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSlantInput("");
    setOberflaecheInput("");
    setFeedback(null);
  }, [task]);

  const slant = Math.sqrt(task.radius ** 2 + task.height ** 2);
  const grundflaeche = Math.PI * task.radius ** 2;
  const mantelflaeche = Math.PI * task.radius * slant;
  const oberflaeche = grundflaeche + mantelflaeche;

  const handleCheck = () => {
    const slantVal = parseFloat(slantInput.replace(",", "."));
    const oberflaecheVal = parseFloat(oberflaecheInput.replace(",", "."));
    if (Number.isNaN(slantVal) || Number.isNaN(oberflaecheVal)) {
      setFeedback("Bitte beide Werte eingeben.");
      return;
    }
    const allOk = withinTolerance(slantVal, slant) && withinTolerance(oberflaecheVal, oberflaeche);
    setFeedback(
      allOk
        ? "Richtig – Mantellinie und Gesamtoberfläche passen."
        : "Prüfe deine Rechnung. Nutze s = √(r² + h²) und O = π·r² + π·r·s."
    );
    if (allOk) setTimeout(() => setTask(makeTask()), 900);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Kegel", href: "/raum-und-form/kegel" },
        { label: "Oberfläche" },
      ]}
      title="Oberfläche berechnen"
      description="Berechne zuerst die Mantellinie, dann die Gesamtoberfläche eines Kegels."
      backHref="/raum-und-form/kegel"
    >
      <div className={taskCardClass}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe</p>
            <h2 className="text-lg font-bold">Mantellinie und Gesamtoberfläche</h2>
          </div>
          <button className={primaryButtonClass} onClick={() => setTask(makeTask())}>
            Neue Aufgabe
          </button>
        </div>

        <div className={infoBoxClass}>
          Gegeben ist ein Kegel mit Radius r = {task.radius} cm und Höhe h = {task.height} cm. Berechne zuerst die
          Mantellinie s (mit dem Satz des Pythagoras) und dann die Gesamtoberfläche O.
        </div>

        <KegelSketch radius={task.radius} height={task.height} unit="cm" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mantellinie s (cm)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={slantInput}
              onChange={(e) => setSlantInput(e.target.value)}
              inputMode="decimal"
              placeholder="Zahl eingeben"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Gesamtoberfläche O (cm²)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={oberflaecheInput}
              onChange={(e) => setOberflaecheInput(e.target.value)}
              inputMode="decimal"
              placeholder="Zahl eingeben"
            />
          </div>
        </div>

        <button className={primaryButtonClass} onClick={handleCheck}>
          Prüfen
        </button>

        {feedback && <FeedbackBanner correct={feedback.startsWith("Richtig")}>{feedback}</FeedbackBanner>}
      </div>
    </TaskLayout>
  );
}
