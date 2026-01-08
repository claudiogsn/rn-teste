import { create } from "zustand";

export type Unit = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  name: string;
};

type ContextState = {
  unit: Unit | null;
  group: Group | null;

  setUnit: (unit: Unit) => void;
  setGroup: (group: Group) => void;

  clearGroup: () => void;
  resetContext: () => void;
};

export const useContextStore = create<ContextState>((set) => ({
  unit: null,
  group: null,

  setUnit: (unit) =>
    set(() => ({
      unit,
      group: null, // trocar unidade invalida grupo
    })),

  setGroup: (group) =>
    set((state) => ({
      ...state,
      group,
    })),

  clearGroup: () =>
    set((state) => ({
      ...state,
      group: null,
    })),

  resetContext: () =>
    set({
      unit: null,
      group: null,
    }),
}));
