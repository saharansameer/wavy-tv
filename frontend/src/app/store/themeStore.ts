import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

type ThemeType = "dark" | "light" | "system";

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const themeStore: StateCreator<ThemeState> = (set) => ({
  theme: "system",
  setTheme: (theme: ThemeType) => set({ theme }),
});

const useThemeStore = create(
  devtools(
    persist(themeStore, {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export default useThemeStore;
