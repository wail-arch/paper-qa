import { create } from "zustand";

type Role = "SENDER" | "RECIPIENT" | "BOTH";

interface SessionState {
  token?: string;
  user?: { id: string; name: string; role: Role };
  setSession: (token: string, user: SessionState["user"]) => void;
  clear: () => void;
}

export const useSession = create<SessionState>((set) => ({
  setSession: (token, user) => set({ token, user }),
  clear: () => set({ token: undefined, user: undefined }),
}));
