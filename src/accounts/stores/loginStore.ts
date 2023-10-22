import { RequestsManager, TonomyRequest } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface TonomyRequestsStore {
  requests?: RequestsManager;
  setRequests: (request: TonomyRequest[]) => void;
}

export const useTonomyRequestsStore = create<TonomyRequestsStore>(
  (set, get) => ({
    requests: undefined,
    setRequests: (requests: TonomyRequest[]) => {
      set({ requests: new RequestsManager(requests) });
    },
  })
);
