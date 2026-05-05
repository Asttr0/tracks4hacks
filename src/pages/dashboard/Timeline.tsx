import { GitMerge } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Timeline() {
  return (
    <Placeholder
      eyebrow="Correlation"
      title="Timeline d'attaque"
      description="Corrélation chronologique des évènements à travers les capteurs."
      owner="Taha"
      icon={GitMerge}
    />
  );
}
