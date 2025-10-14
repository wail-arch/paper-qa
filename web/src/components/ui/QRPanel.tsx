import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QRPanel({ payload }: { payload: string }) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, scale: 4 }).then(setSrc);
  }, [payload]);

  return (
    <div className="rounded-3xl bg-white shadow-inner p-6 flex flex-col items-center gap-3">
      <img src={src} alt="QR" className="h-48 w-48" />
      <p className="text-sm text-center text-gray-600">
        Montrez ce QR au commerçant autorisé. Le paiement est valable pendant 5 minutes.
      </p>
    </div>
  );
}
