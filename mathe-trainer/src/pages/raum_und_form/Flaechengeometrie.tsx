import type { LucideIcon } from "lucide-react";
import { Circle, Diamond, Layers, Ruler, Shuffle, Square, Triangle, BookOpen } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/flaechengeometrie/dreiecke", label: "Dreiecke", description: "Dreiecksarten erkennen, Fläche und Umfang berechnen", icon: Triangle },
  { href: "/raum-und-form/flaechengeometrie/trapez", label: "Trapez", description: "Fläche und Umfang des Trapezes berechnen", icon: Ruler },
  { href: "/raum-und-form/flaechengeometrie/rechteck", label: "Rechteck", description: "Fläche und Umfang des Rechtecks berechnen", icon: Square },
  { href: "/raum-und-form/flaechengeometrie/parallelogramm", label: "Parallelogramm", description: "Fläche und Umfang des Parallelogramms berechnen", icon: Layers },
  { href: "/raum-und-form/flaechengeometrie/raute", label: "Raute", description: "Fläche und Umfang der Raute berechnen", icon: Diamond },
  { href: "/raum-und-form/flaechengeometrie/kreis", label: "Kreis", description: "Fläche und Umfang des Kreises berechnen", icon: Circle },
  { href: "/raum-und-form/flaechengeometrie/gemischte-aufgaben", label: "Gemischte Übungsaufgaben", description: "Zufällig gemischte Aufgaben aus allen Formen", icon: Shuffle },
  { href: "/raum-und-form/flaechengeometrie/anwendungs-uebungsaufgaben", label: "Anwendungs- und Übungsaufgaben", description: "Praxisnahe Aufgaben aus dem Alltag", icon: BookOpen }
];

export default function Flaechengeometrie() {
  return (
    <TopicIndexLayout
      title="Flächengeometrie"
      description="Dreiecke, Vierecke und Kreis als einzelne Übungspfade."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
