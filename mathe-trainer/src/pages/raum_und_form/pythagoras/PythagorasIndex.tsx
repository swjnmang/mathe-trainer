import type { LucideIcon } from "lucide-react";
import { Triangle, Calculator, Ruler, Shuffle } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; icon: LucideIcon; desc: string }[] = [
  { href: "/raum-und-form/satz-des-pythagoras/katheten-hypotenuse", label: "Katheten und Hypotenuse erkennen", icon: Triangle, desc: "Lerne die Begriffe kennen" },
  { href: "/raum-und-form/satz-des-pythagoras/berechnen", label: "Seiten berechnen", icon: Calculator, desc: "Fehlende Seiten ermitteln" },
  { href: "/raum-und-form/satz-des-pythagoras/anwendung", label: "Anwendungsaufgaben", icon: Ruler, desc: "Alltag & Modelle" },
  { href: "/raum-und-form/satz-des-pythagoras/gemischt", label: "Gemischte Aufgaben", icon: Shuffle, desc: "Alle Aufgabentypen gemischt" }
];

export default function PythagorasIndex() {
  return (
    <TopicIndexLayout
      title="Satz des Pythagoras"
      description="Kathete² + Kathete² = Hypotenuse²"
    >
      <TopicCardGrid>
        {topics.map(({ href, label, icon, desc }) => (
          <TopicCard key={href} href={href} title={label} description={desc} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
