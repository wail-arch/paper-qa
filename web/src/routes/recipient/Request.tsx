import MobileShell from "../../components/layout/MobileShell";
import { RequestForm } from "../../components/forms/RequestForm";
import { ToastProvider } from "../../components/feedback/ToastProvider";

export default function RecipientRequest() {
  return (
    <ToastProvider>
      <MobileShell title="Demander un budget">
        <p className="text-sm text-gray-600">
          Expliquez ce dont vous avez besoin et choisissez les catégories où l’argent sera utilisable.
        </p>
        <RequestForm />
      </MobileShell>
    </ToastProvider>
  );
}
