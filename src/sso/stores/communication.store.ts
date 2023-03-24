import { Communication } from "@tonomy/tonomy-id-sdk";
import { create } from "zustand";

interface CommunicationStore {
  communication: Communication;
}

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  communication: new Communication(),
}));
