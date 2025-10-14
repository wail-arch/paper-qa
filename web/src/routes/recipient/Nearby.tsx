import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MobileShell from "../../components/layout/MobileShell";
import { MapToggle } from "../../components/ui/MapToggle";
import { useApi } from "../../hooks/useApi";
import { useSession } from "../../store/auth";

const defaultPosition: [number, number] = [48.8675, 2.3636];

export default function RecipientNearby() {
  const { token } = useSession();
  const { data } = useApi<any>("/merchants", token);
  const [view, setView] = useState<"map" | "list">("map");
  const merchants = data?.merchants ?? [];

  return (
    <MobileShell title="Lieux autorisés">
      <MapToggle view={view} onChange={setView} />
      {view === "map" ? (
        <div className="h-72 overflow-hidden rounded-3xl">
          <MapContainer center={defaultPosition} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {merchants.map((merchant: any) => (
              <Marker key={merchant.id} position={[merchant.lat, merchant.lon]}>
                <Popup>
                  <strong>{merchant.legalName}</strong>
                  <br />
                  Catégories : {merchant.categories.join(", ")}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <ul className="space-y-3">
          {merchants.map((merchant: any) => (
            <li key={merchant.id} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold">{merchant.legalName}</p>
              <p className="text-xs text-gray-500">{merchant.categories.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </MobileShell>
  );
}
