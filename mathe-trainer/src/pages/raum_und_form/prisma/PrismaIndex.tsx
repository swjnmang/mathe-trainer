import type { LucideIcon } from "lucide-react";
import { Layers, Box, Shuffle, Tent } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/prisma/oberflaeche", label: "Oberfläche berechnen", description: "Hypotenuse, Mantelfläche und Gesamtoberfläche bestimmen", icon: Layers },
  { href: "/raum-und-form/prisma/volumen", label: "Volumen berechnen", description: "Rauminhalt eines Dreiecksprismas berechnen", icon: Box },
  { href: "/raum-und-form/prisma/gemischt", label: "Gemischte Übungsaufgaben", description: "Oberfläche und Volumen gemischt üben", icon: Shuffle },
  { href: "/raum-und-form/prisma/anwendungsaufgaben", label: "Anwendungsaufgaben", description: "Das Zeltdach und andere Alltagsaufgaben", icon: Tent },
];

export default function PrismaIndex() {
  return (
    <TopicIndexLayout
      title="Prisma"
      description="Grundfläche, Mantelfläche, Gesamtoberfläche sowie das Volumen eines Dreiecksprismas berechnen."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
