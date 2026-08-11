import { useEffect, useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
} from "../../../components/raum-und-form/TaskLayout";
import ZylinderSketch from "./ZylinderSketch";

type Task = { radius: number; height: number };

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTask(): Task {
  return { radius: round1(randomBetween(2, 6)), height: round1(randomBetween(5, 14)) };
}

function withinTolerance(given: number, target: number) {
  return Math.abs(given - target) <= Math.max(0.05, target * 0.02);
}

export default function ZylinderOberflaeche() {
  const [task, setTask] = useState<Task>(() => makeTask());
  const [mantelInput, setMantelInput] = useState("");
  const [oberflaecheInput, setOberflaecheInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMantelInput("");
    setOberflaecheInput("");
    setFeedback(null);
  }, [task]);

  const grundflaeche = Math.PI * task.radius ** 2;
  const mantelflaeche = 2 * Math.PI * task.radius * task.height;
  const oberflaeche = 2 * grundflaeche + mantelflaeche;

  const handleCheck = () => {
    const mantelVal = parseFloat(mantelInput.replace(",", "."));
    const oberflaecheVal = parseFloat(oberflaecheInput.replace(",", "."));
    if (Number.isNaN(mantelVal) || Number.isNaN(oberflaecheVal)) {
      setFeedback("Bitte beide Werte eingeben.");
      return;
    }
    const allOk = withinTolerance(mantelVal, mantelflaeche) && withinTolerance(oberflaecheVal, oberflaeche);
    setFeedback(allOk ? "Richtig – Mantel- und Gesamtoberfläche passen." : "Prüfe deine Rechnung. Nutze M = 2·π·r·h und O = 2·π·r² + M.");
    if (allOk) setTimeout(() => setTask(makeTask()), 900);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Zylinder", href: "/raum-und-form/zylinder" },
        { label: "Oberfläche" },
      ]}
      title="Oberfläche berechnen"
      description="Berechne die Mantelfläche und die Gesamtoberfläche eines Zylinders."
      backHref="/raum-und-form/zylinder"
    >
      <div className={taskCardClass}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe</p>
            <h2 className="text-lg font-bold">Mantel- und Gesamtoberfläche</h2>
          </div>
          <button className={primaryButtonClass} onClick={() => setTask(makeTask())}>
            Neue Aufgabe
          </button>
        </div>

        <div className={infoBoxClass}>
          Gegeben ist ein Zylinder mit Radius r = {task.radius} cm und Höhe h = {task.height} cm. Berechne die
          Mantelfläche M und die Gesamtoberfläche O.
        </div>

        <ZylinderSketch radius={task.radius} height={task.height} unit="cm" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mantelfläche M (cm²)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={mantelInput}
              onChange={(e) => setMantelInput(e.target.value)}
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
