import { useEffect, useState } from "react";
import TaskLayout, {
  taskCardClass,
  primaryButtonClass,
  infoBoxClass,
  FeedbackBanner,
} from "../../../components/raum-und-form/TaskLayout";
import KugelSketch from "./KugelSketch";

const round1 = (v: number) => Math.round(v * 10) / 10;
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTask() {
  return round1(randomBetween(2, 8));
}

export default function KugelOberflaeche() {
  const [radius, setRadius] = useState<number>(() => makeTask());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setInput("");
    setFeedback(null);
  }, [radius]);

  const oberflaeche = 4 * Math.PI * radius ** 2;

  const handleCheck = () => {
    const val = parseFloat(input.replace(",", "."));
    if (Number.isNaN(val)) {
      setFeedback("Bitte einen Wert eingeben.");
      return;
    }
    const correct = Math.abs(val - oberflaeche) <= Math.max(0.5, oberflaeche * 0.02);
    setFeedback(correct ? "Richtig – die Oberfläche stimmt." : "Prüfe deine Rechnung. Nutze O = 4 · π · r².");
    if (correct) setTimeout(() => setRadius(makeTask()), 900);
  };

  return (
    <TaskLayout
      breadcrumbs={[
        { label: "Raum & Form", href: "/raum-und-form" },
        { label: "Kugel", href: "/raum-und-form/kugel" },
        { label: "Oberfläche" },
      ]}
      title="Oberfläche berechnen"
      description="Berechne die Oberfläche einer Kugel."
      backHref="/raum-und-form/kugel"
    >
      <div className={taskCardClass}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Aufgabe</p>
            <h2 className="text-lg font-bold">Oberfläche berechnen</h2>
          </div>
          <button className={primaryButtonClass} onClick={() => setRadius(makeTask())}>
            Neue Aufgabe
          </button>
        </div>

        <div className={infoBoxClass}>
          Gegeben ist eine Kugel mit Radius r = {radius} cm. Berechne die Oberfläche O.
        </div>

        <KugelSketch radius={radius} unit="cm" />

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Oberfläche O (cm²)</label>
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
      </div>
    </TaskLayout>
  );
}
