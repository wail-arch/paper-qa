import { useEffect, useState } from "react";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"];

export function MoneyInput({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const [local, setLocal] = useState<string>(value.toString());

  useEffect(() => {
    setLocal(value.toString());
  }, [value]);

  const handleKey = (key: string) => {
    if (key === "⌫") {
      const next = local.slice(0, -1) || "0";
      setLocal(next);
      onChange(Number(next));
      return;
    }
    const next = local === "0" ? key : local + key;
    setLocal(next);
    onChange(Number(next));
  };

  return (
    <div className="space-y-3">
      <div className="text-4xl font-semibold text-center">{(Number(local) / 100).toFixed(2)} €</div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className="rounded-2xl bg-gray-100 py-3 text-lg font-medium active:bg-gray-200"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
