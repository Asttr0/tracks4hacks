import { Globe2 } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Map() {
  return (
    <Placeholder
      eyebrow="GeoIP"
      title="Carte des sources"
      description="Visualisation géographique des IPs source détectées par Wazuh / Suricata."
      owner="Taha"
      icon={Globe2}
    />
  );
}
