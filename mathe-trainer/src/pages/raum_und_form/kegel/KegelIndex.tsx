import type { LucideIcon } from "lucide-react";
import { Layers, Box, Shuffle, Cone } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/kegel/oberflaeche", label: "Oberfläche berechnen", description: "Mantellinie, Mantelfläche und Gesamtoberfläche bestimmen", icon: Layers },
  { href: "/raum-und-form/kegel/volumen", label: "Volumen berechnen", description: "Rauminhalt eines Kegels berechnen", icon: Box },
  { href: "/raum-und-form/kegel/gemischt", label: "Gemischte Übungsaufgaben", description: "Oberfläche und Volumen gemischt üben", icon: Shuffle },
  { href: "/raum-und-form/kegel/anwendungsaufgaben", label: "Anwendungsaufgaben", description: "Die Eistüte und andere Alltagsaufgaben", icon: Cone },
];

export default function KegelIndex() {
  return (
    <TopicIndexLayout
      title="Kegel"
      description="Mantellinie, Mantelfläche, Gesamtoberfläche sowie das Volumen eines Kegels berechnen."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
