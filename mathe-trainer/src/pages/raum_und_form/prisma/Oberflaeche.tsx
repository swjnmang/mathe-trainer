import { useEffect, useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
} from "../../../components/raum-und-form/TaskLayout";
import PrismaSketch from "./PrismaSketch";

type Task = { a: number; b: number; prismHeight: number };

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTask(): Task {
  return {
    a: round1(randomBetween(3, 7)),
    b: round1(randomBetween(3, 7)),
    prismHeight: round1(randomBetween(6, 14)),
  };
}

function withinTolerance(given: number, target: number) {
  return Math.abs(given - target) <= Math.max(0.05, target * 0.02);
}

export default function PrismaOberflaeche() {
  const [task, setTask] = useState<Task>(() => makeTask());
  const [hypInput, setHypInput] = useState("");
  const [oberflaecheInput, setOberflaecheInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setHypInput("");
    setOberflaecheInput("");
    setFeedback(null);
  }, [task]);

  const c = Math.sqrt(task.a ** 2 + task.b ** 2);
  const grundflaeche = 0.5 * task.a * task.b;
  const umfang = task.a + task.b + c;
  const mantelflaeche = umfang * task.prismHeight;
  const oberflaeche = 2 * grundflaeche + mantelflaeche;

  const handleCheck = () => {
    const hypVal = parseFloat(hypInput.replace(",", "."));
    const oberflaecheVal = parseFloat(oberflaecheInput.replace(",", "."));
    if (Number.isNaN(hypVal) || Number.isNaN(oberflaecheVal)) {
      setFeedback("Bitte beide Werte eingeben.");
      return;
    }
    const allOk = withinTolerance(hypVal, c) && withinTolerance(oberflaecheVal, oberflaeche);
    setFeedback(
      allOk
        ? "Richtig – Hypotenuse und Gesamtoberfläche passen."
        : "Prüfe deine Rechnung. Nutze c = √(a² + b²) und O = 2·G + (a+b+c)·H."
    );
    if (allOk) setTimeout(() => setTask(makeTask()), 900);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Prisma", href: "/raum-und-form/prisma" },
        { label: "Oberfläche" },
      ]}
      title="Oberfläche berechnen"
      description="Die Grundfläche ist ein rechtwinkliges Dreieck. Berechne zuerst die Hypotenuse, dann die Gesamtoberfläche."
      backHref="/raum-und-form/prisma"
    >
      <div className={taskCardClass}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe</p>
            <h2 className="text-lg font-bold">Hypotenuse und Gesamtoberfläche</h2>
          </div>
          <button className={primaryButtonClass} onClick={() => setTask(makeTask())}>
            Neue Aufgabe
          </button>
        </div>

        <div className={infoBoxClass}>
          Gegeben ist ein Prisma mit rechtwinkliger Dreiecksgrundfläche (Katheten a = {task.a} cm, b = {task.b} cm)
          und Prismenhöhe H = {task.prismHeight} cm. Berechne zuerst die Hypotenuse c der Grundfläche (mit dem Satz
          des Pythagoras) und dann die Gesamtoberfläche O.
        </div>

        <PrismaSketch a={task.a} b={task.b} prismHeight={task.prismHeight} unit="cm" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Hypotenuse c (cm)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={hypInput}
              onChange={(e) => setHypInput(e.target.value)}
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
