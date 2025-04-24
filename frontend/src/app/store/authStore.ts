import { create, StateCreator } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type ThemeType = "DARK" | "LIGHT" | "SYSTEM";
type NsfwContentType = "SHOW" | "HIDE" | "BLUR";

interface Preferences {
  theme: ThemeType;
  nsfwContent: NsfwContentType;
}

interface AuthType {
  authorized: boolean;
  setAuthorized: (value: boolean) => void;
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  tokenExpiry: number;
  setTokenExpiry: (value: number) => void;
  preferences: Preferences;
  setTheme: (value: ThemeType) => void;
  setNsfwContent: (value: NsfwContentType) => void;
  isAuthOverlayOpen: boolean;
  setAuthOverlayOpen: (value: boolean) => void;
}

const authStore: StateCreator<AuthType> = (set, get) => ({
  authorized: false,
  setAuthorized: (authorized: boolean) => set({ authorized }),
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  tokenExpiry: 0,
  setTokenExpiry: (tokenExpiry: number) => set({ tokenExpiry }),
  preferences: {
    theme: "SYSTEM",
    nsfwContent: "BLUR",
  },
  setTheme: (theme: ThemeType) =>
    set({ preferences: { ...get().preferences, theme } }),
  setNsfwContent: (nsfwContent: NsfwContentType) =>
    set({ preferences: { ...get().preferences, nsfwContent } }),
  isAuthOverlayOpen: true,
  setAuthOverlayOpen: (isAuthOverlayOpen: boolean) =>
    set({ isAuthOverlayOpen }),
});

const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export default useAuthStore;
