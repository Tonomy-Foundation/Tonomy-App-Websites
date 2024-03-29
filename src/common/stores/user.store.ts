import { Communication, ExternalUser } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface ExternalUserStore {
  user: ExternalUser | undefined;
  communication: Communication;
  isLoggedIn: () => boolean;
  setUser: (user: ExternalUser) => void;
  logout: () => void;
}

export const useUserStore = create<ExternalUserStore>((set, get) => ({
  user: undefined,
  communication: new Communication(),
  isLoggedIn: () => get().user !== undefined,
  setUser: (user: ExternalUser) => {
    set({ user });
  },
  logout: async () => {
    await get().user?.logout();
    set({ user: undefined });
  },
}));
