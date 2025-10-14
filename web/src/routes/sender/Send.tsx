import MobileShell from "../../components/layout/MobileShell";
import { SendForm } from "../../components/forms/SendForm";
import { ToastProvider } from "../../components/feedback/ToastProvider";

export default function SenderSend() {
  return (
    <ToastProvider>
      <MobileShell title="Envoyer avec conditions">
        <p className="text-sm text-gray-600">
          L’argent envoyé reste utilisable uniquement dans les catégories sélectionnées.
        </p>
        <SendForm />
      </MobileShell>
    </ToastProvider>
  );
}
