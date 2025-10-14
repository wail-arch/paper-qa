import MobileShell from "../../components/layout/MobileShell";
import { useSession } from "../../store/auth";
import { useApi } from "../../hooks/useApi";

export default function RecipientHistory() {
  const { token } = useSession();
  const { data } = useApi<any>("/me", token);
  return (
    <MobileShell title="Historique">
      <ul className="space-y-3">
        {data?.activity?.map((item: any) => (
          <li key={item.id} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}
