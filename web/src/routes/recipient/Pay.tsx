import { useLocation } from "react-router-dom";
import MobileShell from "../../components/layout/MobileShell";
import { useSession } from "../../store/auth";
import { useApi, postApi } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { MoneyInput } from "../../components/ui/MoneyInput";
import { QRPanel } from "../../components/ui/QRPanel";

export default function RecipientPay() {
  const location = useLocation() as any;
  const restrictedId = location.state?.restrictedId ?? "restricted-1";
  const { token } = useSession();
  const { data } = useApi<any>("/restricted/mine", token);
  const [amount, setAmount] = useState(1000);
  const [merchantId, setMerchantId] = useState("pharma-1");
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    setQr(null);
  }, [restrictedId, merchantId, amount]);

  const preparePayment = async () => {
    if (!token) return;
    const response = await postApi<{ qr: string }>(
      "/pay/prepare",
      {
        restricted_id: restrictedId,
        merchant_id: merchantId,
        amount_cents: amount,
      },
      token
    );
    setQr(response.qr);
  };

  const confirmPayment = async () => {
    if (!token || !qr) return;
    await postApi(
      "/pay/confirm",
      {
        issuance_id: restrictedId,
        merchant_id: merchantId,
        amount_cents: amount,
        nonce: "demo",
      },
      token
    );
    alert("Paiement simulé !");
  };

  return (
    <MobileShell title="Payer chez un commerçant">
      <p className="text-sm text-gray-600">Le commerçant doit faire partie des lieux autorisés.</p>
      <label className="block text-sm font-medium text-gray-600">
        Choisissez un montant
        <MoneyInput value={amount} onChange={setAmount} />
      </label>
      <label className="block text-sm font-medium text-gray-600">
        Choisissez un lieu
        <select
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="pharma-1">Pharmacie République</option>
          <option value="grocery-1">Épicerie Locale</option>
          <option value="library-1">Librairie Soleil</option>
        </select>
      </label>
      <button onClick={preparePayment} className="w-full rounded-full bg-primary py-3 text-white font-semibold">
        Générer un QR
      </button>
      {qr && (
        <div className="space-y-3">
          <QRPanel payload={qr} />
          <button onClick={confirmPayment} className="w-full rounded-full bg-green-600 py-3 text-white font-semibold">
            Simuler l’acceptation
          </button>
        </div>
      )}
      <div className="space-y-2 text-sm text-gray-600">
        <p>Budgets disponibles :</p>
        <ul className="list-disc pl-5">
          {data?.items?.map((item: any) => (
            <li key={item.id}>
              {item.categories.join(", ")} — {(item.remainingCents / 100).toFixed(2)} €
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
