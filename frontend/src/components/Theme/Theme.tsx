import { useEffect } from "react";
import useThemeStore from "@/app/store/themeStore";

export function Theme() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.querySelector("html");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root?.classList.remove("dark", "light");
      root?.classList.add(systemTheme);
      return;
    }

    root?.classList.remove("dark", "light");
    root?.classList.add(theme);
  }, [theme]);

  return <></>;
}
