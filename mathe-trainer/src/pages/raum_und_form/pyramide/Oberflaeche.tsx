import { useEffect, useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
} from "../../../components/raum-und-form/TaskLayout";
import PyramideSketch from "./PyramideSketch";

type Task = { side: number; height: number };

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTask(): Task {
  return { side: round1(randomBetween(4, 10)), height: round1(randomBetween(5, 12)) };
}

function withinTolerance(given: number, target: number) {
  return Math.abs(given - target) <= Math.max(0.05, target * 0.02);
}

export default function PyramideOberflaeche() {
  const [task, setTask] = useState<Task>(() => makeTask());
  const [seitenhoeheInput, setSeitenhoeheInput] = useState("");
  const [oberflaecheInput, setOberflaecheInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSeitenhoeheInput("");
    setOberflaecheInput("");
    setFeedback(null);
  }, [task]);

  const seitenhoehe = Math.sqrt(task.height ** 2 + (task.side / 2) ** 2);
  const grundflaeche = task.side ** 2;
  const mantelflaeche = 2 * task.side * seitenhoehe;
  const oberflaeche = grundflaeche + mantelflaeche;

  const handleCheck = () => {
    const seitenhoeheVal = parseFloat(seitenhoeheInput.replace(",", "."));
    const oberflaecheVal = parseFloat(oberflaecheInput.replace(",", "."));
    if (Number.isNaN(seitenhoeheVal) || Number.isNaN(oberflaecheVal)) {
      setFeedback("Bitte beide Werte eingeben.");
      return;
    }
    const allOk = withinTolerance(seitenhoeheVal, seitenhoehe) && withinTolerance(oberflaecheVal, oberflaeche);
    setFeedback(
      allOk
        ? "Richtig – Seitenhöhe und Gesamtoberfläche passen."
        : "Prüfe deine Rechnung. Nutze h_s = √(h² + (a/2)²) und O = a² + 2·a·h_s."
    );
    if (allOk) setTimeout(() => setTask(makeTask()), 900);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Pyramide", href: "/raum-und-form/pyramide" },
        { label: "Oberfläche" },
      ]}
      title="Oberfläche berechnen"
      description="Berechne zuerst die Seitenhöhe, dann die Gesamtoberfläche einer quadratischen Pyramide."
      backHref="/raum-und-form/pyramide"
    >
      <div className={taskCardClass}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe</p>
            <h2 className="text-lg font-bold">Seitenhöhe und Gesamtoberfläche</h2>
          </div>
          <button className={primaryButtonClass} onClick={() => setTask(makeTask())}>
            Neue Aufgabe
          </button>
        </div>

        <div className={infoBoxClass}>
          Gegeben ist eine quadratische Pyramide mit Grundkante a = {task.side} cm und Höhe h = {task.height} cm.
          Berechne zuerst die Seitenhöhe h<sub>s</sub> (mit dem Satz des Pythagoras) und dann die Gesamtoberfläche O.
        </div>

        <PyramideSketch side={task.side} height={task.height} unit="cm" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Seitenhöhe h_s (cm)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={seitenhoeheInput}
              onChange={(e) => setSeitenhoeheInput(e.target.value)}
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
