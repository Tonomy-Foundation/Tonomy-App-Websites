import {
  LoginWithTonomyMessages,
  DualWalletRequests,
} from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface WalletRequestsStore {
  accountsLogin?: LoginWithTonomyMessages;
  requests?: DualWalletRequests;
  setRequests: (requests: DualWalletRequests) => void;
  setAccountsLogin: (accountsLogin: LoginWithTonomyMessages) => void;
}

export const useWalletRequestsStore = create<WalletRequestsStore>((set) => ({
  accountsLogin: undefined,
  requests: undefined,
  setRequests: (requests: DualWalletRequests) => {
    set({ requests });
  },
  setAccountsLogin: (accountsLogin: LoginWithTonomyMessages) => {
    set({ accountsLogin });
  },
}));
