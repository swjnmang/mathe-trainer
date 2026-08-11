import type { LucideIcon } from "lucide-react";
import { Waves, Umbrella } from "lucide-react";
import TopicIndexLayout, { TopicCard, TopicCardGrid } from "../../../components/raum-und-form/TopicIndexLayout";

type Item = { title: string; desc: string; href: string; icon: LucideIcon };

const items: Item[] = [
  {
    icon: Waves,
    title: "Der Pool",
    desc: "Zylinderförmiger Pool und Pavillon",
    href: "pool"
  },
  {
    icon: Umbrella,
    title: "Schwimmbad mit Schirm",
    desc: "Schwimmbecken mit Sonnenschirm",
    href: "schwimmbad-mit-schirm"
  }
];

export default function AnwendungsaufgabenIndex() {
  return (
    <TopicIndexLayout
      title="Anwendungsaufgaben"
      description="Löse praxisnahe Aufgaben zu verschiedenen geometrischen Formen."
    >
      <TopicCardGrid>
        {items.map(({ href, title, desc, icon }) => (
          <TopicCard key={href} href={href} title={title} description={desc} icon={icon} />
        ))}
      </TopicCardGrid>
    </TopicIndexLayout>
  );
}
