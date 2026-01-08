import { create } from "zustand";

export type AppRoute = "home" | "menus" | "dashboard";

type NavState = {
  current: AppRoute;
  navigate: (route: AppRoute) => void;
};

export const useNavStore = create<NavState>((set) => ({
  current: "home",

  navigate: (route) => {
    set({ current: route });
  },
}));
