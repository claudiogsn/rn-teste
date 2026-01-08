import { create } from "zustand";

type Unit = {
  id: number;
  name: string;
};

type AppState = {
  currentUnit: Unit | null;
  setUnit: (unit: Unit) => void;
  clearUnit: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentUnit: null,

  setUnit: (unit) => set({ currentUnit: unit }),

  clearUnit: () => set({ currentUnit: null }),
}));
