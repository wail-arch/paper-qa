import MobileShell from "../../components/layout/MobileShell";
import { useSession } from "../../store/auth";
import { useApi } from "../../hooks/useApi";
import { BalanceCard } from "../../components/ui/BalanceCard";
import { SkeletonCard } from "../../components/feedback/SkeletonCard";

export default function SenderHome() {
  const { token, user } = useSession();
  const { data, loading } = useApi<any>("/me", token);

  return (
    <MobileShell title={`Bonjour ${user?.name ?? ""}`}>
      <div className="rounded-3xl bg-blue-600 px-5 py-6 text-white">
        <p className="text-sm opacity-80">Solde disponible</p>
        <p className="text-3xl font-semibold">{((data?.sender_balance_cents ?? 0) / 100).toFixed(2)} €</p>
        <button className="mt-4 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
          Recharger (SEPA simulé)
        </button>
      </div>
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Derniers envois</h2>
        {loading && <SkeletonCard />}
        {data?.sent?.map((item: any) => (
          <BalanceCard
            key={item.id}
            title={`Pour ${item.recipientId}`}
            amount={`${(item.remainingCents / 100).toFixed(2)} € restant`}
            categories={item.categories}
            expires={item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("fr-FR") : undefined}
          />
        ))}
      </section>
    </MobileShell>
  );
}
