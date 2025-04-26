import { useEffect } from "react";
import useAuthStore from "@/app/store/authStore";

export function Theme() {
  const { authUser } = useAuthStore();

  useEffect(() => {
    const root = document.querySelector("html");

    if (authUser.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root?.classList.remove("dark", "light");
      root?.classList.add(systemTheme);
      return;
    }

    root?.classList.remove("dark", "light");
    root?.classList.add(authUser.theme);
  }, [authUser.theme]);

  return <></>;
}
