import { Play } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Replay() {
  return (
    <Placeholder
      eyebrow="Simulation"
      title="Attack Replay"
      description="Rejeu d'une chaîne d'attaque pré-enregistrée à vitesse contrôlée."
      owner="Taha"
      icon={Play}
    />
  );
}
