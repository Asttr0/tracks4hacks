import { LucideIcon } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";

interface PlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  owner: "Taha" | "Ismail";
  icon: LucideIcon;
}

export const Placeholder = ({
  eyebrow,
  title,
  description,
  owner,
  icon,
}: PlaceholderProps) => (
  <>
    <PageHeader eyebrow={eyebrow} title={title} description={description} />
    <EmptyState
      icon={icon}
      title="Bientôt disponible"
      description={`Cette vue est attribuée à ${owner}. Le squelette est en place, l'implémentation arrive.`}
    />
  </>
);
