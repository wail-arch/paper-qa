export function MapToggle({ view, onChange }: { view: "map" | "list"; onChange: (view: "map" | "list") => void }) {
  return (
    <div className="grid grid-cols-2 rounded-full bg-gray-100 p-1">
      <button
        className={`rounded-full py-2 text-sm font-medium ${view === "list" ? "bg-white shadow" : "text-gray-500"}`}
        onClick={() => onChange("list")}
      >
        Liste
      </button>
      <button
        className={`rounded-full py-2 text-sm font-medium ${view === "map" ? "bg-white shadow" : "text-gray-500"}`}
        onClick={() => onChange("map")}
      >
        Carte
      </button>
    </div>
  );
}
