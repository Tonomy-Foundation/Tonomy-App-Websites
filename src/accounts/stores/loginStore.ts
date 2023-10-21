import { RequestManager, TonomyRequest } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface TonomyRequestsStore {
  requests?: RequestManager;
  setRequests: (request: TonomyRequest[]) => void;
}

export const useTonomyRequestsStore = create<TonomyRequestsStore>(
  (set, get) => ({
    requests: undefined,
    setRequests: (requests: TonomyRequest[]) => {
      set({ requests: new RequestManager(requests) });
    },
  })
);
