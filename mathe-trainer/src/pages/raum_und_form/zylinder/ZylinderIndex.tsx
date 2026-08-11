import type { LucideIcon } from "lucide-react";
import { Layers, Box, Shuffle, Waves } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/zylinder/oberflaeche", label: "Oberfläche berechnen", description: "Grund-, Mantel- und Gesamtoberfläche bestimmen", icon: Layers },
  { href: "/raum-und-form/zylinder/volumen", label: "Volumen berechnen", description: "Rauminhalt eines Zylinders berechnen", icon: Box },
  { href: "/raum-und-form/zylinder/gemischt", label: "Gemischte Übungsaufgaben", description: "Oberfläche und Volumen gemischt üben", icon: Shuffle },
  { href: "/raum-und-form/anwendungsaufgaben/pool", label: "Anwendungsaufgaben", description: "Der zylinderförmige Pool im Garten", icon: Waves },
];

export default function ZylinderIndex() {
  return (
    <TopicIndexLayout
      title="Zylinder"
      description="Grund-, Mantel- und Gesamtoberfläche sowie das Volumen eines Zylinders berechnen."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
