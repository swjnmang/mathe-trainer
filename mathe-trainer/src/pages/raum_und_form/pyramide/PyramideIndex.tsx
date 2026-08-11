import type { LucideIcon } from "lucide-react";
import { Layers, Box, Shuffle, Umbrella } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

const topics: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/raum-und-form/pyramide/oberflaeche", label: "Oberfläche berechnen", description: "Seitenhöhe, Mantelfläche und Gesamtoberfläche bestimmen", icon: Layers },
  { href: "/raum-und-form/pyramide/volumen", label: "Volumen berechnen", description: "Rauminhalt einer quadratischen Pyramide berechnen", icon: Box },
  { href: "/raum-und-form/pyramide/gemischt", label: "Gemischte Übungsaufgaben", description: "Oberfläche und Volumen gemischt üben", icon: Shuffle },
  { href: "/raum-und-form/anwendungsaufgaben/schwimmbad-mit-schirm", label: "Anwendungsaufgaben", description: "Der pyramidenförmige Sonnenschirm", icon: Umbrella },
];

export default function PyramideIndex() {
  return (
    <TopicIndexLayout
      title="Pyramide"
      description="Seitenhöhe, Mantelfläche, Gesamtoberfläche sowie das Volumen einer quadratischen Pyramide berechnen."
    >
      <TopicCardGrid>
        {topics.map(({ href, label, description, icon }) => (
          <TopicCard key={href} href={href} title={label} description={description} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
