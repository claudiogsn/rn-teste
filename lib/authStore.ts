import { create } from "zustand";
import { useContextStore } from "./contextStore";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type User = {
  id: number;
  login: string;
  name: string;
  token: string;
  system_unit_id: number;
  photo_urls?: string[];
  permissions?: string[];
};

type AuthState = {
  user: User | null;
  login: (userDetails: any) => void;
  logout: () => void;
};

/* -------------------------------------------------------------------------- */
/* Store                                                                      */
/* -------------------------------------------------------------------------- */

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (userDetails) => {
    if (!userDetails?.id) {
      console.error("login() recebeu userDetails inválido:", userDetails);
      return;
    }

    /* ---------- auth ---------- */
    set({
      user: {
        id: userDetails.id,
        login: userDetails.login,
        name: userDetails.name,
        token: userDetails.token,
        system_unit_id: userDetails.system_unit_id,
        photo_urls: userDetails.photo_urls,
        permissions: userDetails.permissions_names,
      },
    });

    /* ---------- contexto global ---------- */
    const { setUnit, setGroup } = useContextStore.getState();

    if (userDetails.unit) {
      setUnit({
        id: userDetails.unit.id,
        name: userDetails.unit.name,
      });
    }

    if (userDetails.group) {
      setGroup({
        id: userDetails.group.id,
        name: userDetails.group.name,
        slug: userDetails.group.slug,
      });
    }
  },

  logout: () => {
    set({ user: null });
    useContextStore.getState().resetContext();
  },
}));
