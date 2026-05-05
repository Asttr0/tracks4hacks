import { useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { Placeholder } from "./_Placeholder";

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <Placeholder
      eyebrow={`Incident ${id ?? ""}`}
      title="Détail de l'incident"
      description="Chronologie, artefacts et export PDF du rapport d'incident."
      owner="Ismail"
      icon={FileText}
    />
  );
}
