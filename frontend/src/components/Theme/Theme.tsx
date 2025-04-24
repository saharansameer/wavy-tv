import { useEffect } from "react";
import useAuthStore from "@/app/store/authStore";

export function Theme() {
  const { preferences } = useAuthStore();

  useEffect(() => {
    const root = document.querySelector("html");

    if (preferences.theme === "SYSTEM") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root?.classList.remove("dark", "light");
      root?.classList.add(systemTheme);
      return;
    }

    root?.classList.remove("dark", "light");
    root?.classList.add(preferences.theme);
  }, [preferences.theme]);

  return <></>;
}
