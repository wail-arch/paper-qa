import { CategoryChips } from "./CategoryChips";

export function BalanceCard({
  title,
  amount,
  categories,
  expires,
  cta,
  onClick,
}: {
  title: string;
  amount: string;
  categories: string[];
  expires?: string;
  cta?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl bg-white shadow-sm px-5 py-4 text-left space-y-3 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{amount}</p>
        </div>
        {cta && <span className="rounded-full bg-primary text-white px-3 py-1 text-xs">{cta}</span>}
      </div>
      <div>
        <p className="text-xs uppercase text-gray-400">Utilisable uniquement chez :</p>
        <CategoryChips categories={categories} />
      </div>
      {expires && <p className="text-xs text-amber-600">Expire : {expires}</p>}
    </button>
  );
}
