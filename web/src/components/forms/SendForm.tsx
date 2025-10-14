import { useState } from "react";
import { MoneyInput } from "../ui/MoneyInput";
import { CategoryChips } from "../ui/CategoryChips";
import { postApi } from "../../hooks/useApi";
import { useSession } from "../../store/auth";
import { useToasts } from "../feedback/ToastProvider";

const categories = [
  { id: "pharmacy", label: "Pharmacies" },
  { id: "grocery", label: "Épiceries" },
  { id: "library", label: "Librairies" },
];

export function SendForm() {
  const [amount, setAmount] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["pharmacy"]);
  const [recipientId, setRecipientId] = useState("user-b");
  const { token } = useSession();
  const toasts = useToasts();

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!token) return;
    await postApi("/restricted/send", {
      recipient_id: recipientId,
      amount_cents: amount,
      categories: selectedCategories,
    }, token);
    toasts.push("Montant verrouillé envoyé !");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-600">
        Destinataire (beta)
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="user-b">Bruno</option>
          <option value="user-c">Chloé</option>
        </select>
      </label>
      <MoneyInput value={amount} onChange={setAmount} />
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Catégories autorisées</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm ${selectedCategories.includes(category.id) ? "bg-primary text-white" : "bg-gray-100"}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <CategoryChips categories={selectedCategories} />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full rounded-full bg-primary py-4 text-lg font-semibold text-white"
      >
        Envoyer
      </button>
    </div>
  );
}
