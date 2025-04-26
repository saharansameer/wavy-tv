import { create, StateCreator } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type ThemeType = "dark" | "light" | "system";
type NsfwContentType = "SHOW" | "HIDE" | "BLUR";

interface AuthUser {
  theme: ThemeType;
  nsfwContent: NsfwContentType;
  fullName: string;
  username: string;
  avatar: string;
}

interface AuthType {
  authorized: boolean;
  setAuthorized: (value: boolean) => void;
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  tokenExpiry: number;
  setTokenExpiry: (value: number) => void;
  isAuthOverlayOpen: boolean;
  setAuthOverlayOpen: (value: boolean) => void;
  authUser: AuthUser;
  setAuthUser: (value: AuthUser) => void;
  setTheme: (value: ThemeType) => void;
}

const authStore: StateCreator<AuthType> = (set, get) => ({
  authorized: false,
  setAuthorized: (authorized: boolean) => set({ authorized }),
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  tokenExpiry: 0,
  setTokenExpiry: (tokenExpiry: number) => set({ tokenExpiry }),
  isAuthOverlayOpen: true,
  setAuthOverlayOpen: (isAuthOverlayOpen: boolean) =>
    set({ isAuthOverlayOpen }),
  authUser: {
    theme: "system",
    nsfwContent: "BLUR",
    fullName: "",
    username: "",
    avatar: "",
  },
  setAuthUser: (authUser: AuthUser) => set({ authUser }),
  setTheme: (theme: ThemeType) =>
    set({ authUser: { ...get().authUser, theme } }),
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
