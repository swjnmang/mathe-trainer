import type { LucideIcon } from "lucide-react";
import { Layers, Box, Shuffle, CircleDot } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/kugel/oberflaeche", label: "Oberfläche berechnen", description: "Oberfläche einer Kugel bestimmen", icon: Layers },
  { href: "/raum-und-form/kugel/volumen", label: "Volumen berechnen", description: "Rauminhalt einer Kugel berechnen", icon: Box },
  { href: "/raum-und-form/kugel/gemischt", label: "Gemischte Übungsaufgaben", description: "Oberfläche und Volumen gemischt üben", icon: Shuffle },
  { href: "/raum-und-form/kugel/anwendungsaufgaben", label: "Anwendungsaufgaben", description: "Fußball, Globus und andere Alltagsaufgaben", icon: CircleDot },
];

export default function KugelIndex() {
  return (
    <TopicIndexLayout
      title="Kugel"
      description="Oberfläche und Volumen einer Kugel berechnen."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
