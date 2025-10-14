import MobileShell from "../../components/layout/MobileShell";
import { useSession } from "../../store/auth";
import { useApi } from "../../hooks/useApi";
import { BalanceCard } from "../../components/ui/BalanceCard";
import { SkeletonCard } from "../../components/feedback/SkeletonCard";
import { useNavigate } from "react-router-dom";

export default function RecipientHome() {
  const { token, user } = useSession();
  const { data, loading } = useApi<any>("/me", token);
  const navigate = useNavigate();
  return (
    <MobileShell title={`Bonjour ${user?.name ?? ""}`}>
      <p className="text-sm text-gray-600">
        Utilisez votre budget dans les lieux autorisés. Chaque carte indique les catégories disponibles.
      </p>
      {loading && <SkeletonCard />}
      {data?.recipient_restricted?.map((item: any) => (
        <BalanceCard
          key={item.id}
          title={`Reçu de ${item.issuerId}`}
          amount={`${(item.remainingCents / 100).toFixed(2)} €`}
          categories={item.categories}
          expires={item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("fr-FR") : undefined}
          cta="Payer"
          onClick={() => navigate("/b/pay", { state: { restrictedId: item.id } })}
        />
      ))}
    </MobileShell>
  );
}
