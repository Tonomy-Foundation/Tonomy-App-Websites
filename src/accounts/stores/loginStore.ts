import { LoginRequest } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface LoginStore {
  request?: LoginRequest;
  setRequest: (request: LoginRequest) => void;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  request: undefined,
  setRequest: (request: LoginRequest) => {
    set({ request });
  },
}));
