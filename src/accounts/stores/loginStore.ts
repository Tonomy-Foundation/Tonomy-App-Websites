import {
  LoginWithTonomyMessages,
  RequestsManager,
} from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface WalletRequestsStore {
  payload?: string;
  accountsLogin?: LoginWithTonomyMessages;
  requests?: RequestsManager;
  setRequests: (requests: RequestsManager) => void;
  setPayload: (payload: string) => void;
  setAccountsLogin: (accountsLogin: LoginWithTonomyMessages) => void;
}

export const useWalletRequestsStore = create<WalletRequestsStore>((set) => ({
  payload: undefined,
  accountsLogin: undefined,
  requests: undefined,
  setRequests: (requests: RequestsManager) => {
    set({ requests });
  },
  setPayload: (payload: string) => {
    set({ payload });
  },
  setAccountsLogin: (accountsLogin: LoginWithTonomyMessages) => {
    set({ accountsLogin });
  },
}));
