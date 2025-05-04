import axios from "axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { setQueriesInvalid } from "@/utils/reactQueryUtils";
import { showToast } from "@/utils/toast";

export const useLogout = async () => {
  try {
    await verifyAndGenerateNewToken();
    await axios.get("/api/v1/auth/logout");
    showToast("user-logout");
    await setQueriesInvalid();
    localStorage.removeItem("auth");
    window.location.reload();
  } catch {
    localStorage.removeItem("auth");
    window.location.reload();
  }
};
