import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useMemo, useState } from "react";

interface ToastContextValue {
  push: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function useToasts() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const value = useMemo(
    () => ({
      push: (msg: string) => {
        setMessage(msg);
        setOpen(true);
      },
    }),
    []
  );
  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-6 py-3 text-white shadow"
          open={open}
          onOpenChange={setOpen}
        >
          {message}
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
