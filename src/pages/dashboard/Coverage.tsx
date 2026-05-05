import { Gauge } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Coverage() {
  return (
    <Placeholder
      eyebrow="Analytics"
      title="Coverage Scoreboard"
      description="Mesure de la couverture détection vs. tactiques MITRE."
      owner="Ismail"
      icon={Gauge}
    />
  );
}
