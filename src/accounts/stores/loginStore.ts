import { RequestsManager, WalletRequest } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface WalletRequestsStore {
  requests?: RequestsManager;
  setRequests: (request: WalletRequest[]) => void;
}

export const useWalletRequestsStore = create<WalletRequestsStore>(
  (set, get) => ({
    requests: undefined,
    setRequests: (requests: WalletRequest[]) => {
      set({ requests: new RequestsManager(requests) });
    },
  })
);
