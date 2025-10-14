const labels: Record<string, string> = {
  pharmacy: "Pharmacies",
  grocery: "Épiceries",
  library: "Librairies",
};

export function CategoryChips({ categories }: { categories: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <span
          key={category}
          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
        >
          {labels[category] ?? category}
        </span>
      ))}
    </div>
  );
}
