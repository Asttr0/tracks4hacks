import { Grid3x3 } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Mitre() {
  return (
    <Placeholder
      eyebrow="ATT&CK"
      title="MITRE Heatmap"
      description="Couverture des techniques MITRE ATT&CK observées dans le SOC."
      owner="Taha"
      icon={Grid3x3}
    />
  );
}
