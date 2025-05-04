import axios from "axios";
import useAuthStore from "@/app/store/authStore";

export const verifyAndGenerateNewToken = async () => {
  const { authenticated, tokenExpiry, setTokenExpiry } =
    useAuthStore.getState();

  if (!authenticated) return false;

  const now = Date.now();

  if (tokenExpiry < now) {
    try {
      await axios.get("/api/v1/auth/token/new", { withCredentials: true });
      setTokenExpiry(now + 10 * 60 * 1000);
      return true;
    } catch {
      await axios.get("/api/v1/auth/token/delete", { withCredentials: true });
      window.location.reload();
      return false;
    }
  }

  return true;
};
