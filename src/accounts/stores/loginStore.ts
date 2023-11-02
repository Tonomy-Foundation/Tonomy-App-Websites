import { RequestsManager } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface WalletRequestsStore {
  requests?: RequestsManager;
  setRequests: (requests: RequestsManager) => void;
}

export const useWalletRequestsStore = create<WalletRequestsStore>(
  (set, get) => ({
    requests: undefined,
    setRequests: (requests: RequestsManager) => {
      set({ requests });
    },
  })
);
