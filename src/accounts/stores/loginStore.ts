import {
  LoginWithTonomyMessages,
  DualWalletRequests,
} from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface WalletRequestsStore {
  loginWithTonomyMessageStore?: LoginWithTonomyMessages;
  requestsStore?: DualWalletRequests;
  setRequestsStore: (requests: DualWalletRequests) => void;
  setLoginWithTonomyMessageStore: (
    loginWithTonomyMessageStore: LoginWithTonomyMessages,
  ) => void;
}

export const useWalletRequestsStore = create<WalletRequestsStore>((set) => ({
  loginWithTonomyMessageStore: undefined,
  requestsStore: undefined,
  setRequestsStore: (requests: DualWalletRequests) => {
    set({ requestsStore: requests });
  },
  setLoginWithTonomyMessageStore: (
    loginWithTonomyMessageStore: LoginWithTonomyMessages,
  ) => {
    set({ loginWithTonomyMessageStore });
  },
}));
