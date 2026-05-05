import { ShieldAlert } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function Incidents() {
  return (
    <Placeholder
      eyebrow="Tickets"
      title="Incidents"
      description="Liste des incidents corrélés — triage, statut et propriétaire."
      owner="Ismail"
      icon={ShieldAlert}
    />
  );
}
