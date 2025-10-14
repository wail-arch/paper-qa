import { useState } from "react";
import { MoneyInput } from "../ui/MoneyInput";
import { useSession } from "../../store/auth";
import { postApi } from "../../hooks/useApi";
import { useToasts } from "../feedback/ToastProvider";

const categories = [
  { id: "pharmacy", label: "Pharmacie" },
  { id: "grocery", label: "Épicerie" },
  { id: "library", label: "Librairie" },
];

export function RequestForm() {
  const [amount, setAmount] = useState(1500);
  const [selected, setSelected] = useState<string[]>(["pharmacy"]);
  const [note, setNote] = useState("Médicaments cette semaine");
  const { token } = useSession();
  const toasts = useToasts();

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const submit = async () => {
    if (!token) return;
    await postApi("/requests", {
      target_issuer_id: "user-a",
      amount_cents: amount,
      categories: selected,
      note,
    }, token);
    toasts.push("Demande envoyée à Alice");
  };

  return (
    <div className="space-y-4">
      <MoneyInput value={amount} onChange={setAmount} />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggle(category.id)}
            className={`rounded-full px-4 py-2 text-sm ${selected.includes(category.id) ? "bg-primary text-white" : "bg-gray-100"}`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium text-gray-600">
        Note
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
        />
      </label>
      <button onClick={submit} className="w-full rounded-full bg-primary py-4 text-lg font-semibold text-white">
        Demander
      </button>
    </div>
  );
}
