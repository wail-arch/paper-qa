import * as Dialog from "@radix-ui/react-dialog";

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 rounded-t-3xl bg-white p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full border border-gray-200 py-3 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="flex-1 rounded-full bg-primary text-white py-3 font-semibold"
            >
              Confirmer
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
