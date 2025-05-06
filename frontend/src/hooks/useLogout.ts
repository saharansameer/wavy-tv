import { axios } from "@/app/config/axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { setQueriesInvalid } from "@/utils/reactQueryUtils";
import { showToast } from "@/utils/toast";
import useAuthStore from "@/app/store/authStore";

export const useLogout = async () => {
  const { setAuthenticated } = useAuthStore.getState();
  if (!(await verifyAndGenerateNewToken())) return;
  try {
    await axios.get("/api/v1/auth/logout", { withCredentials: true });
    showToast("user-logout");
    setAuthenticated(false);
    await setQueriesInvalid();
    window.location.reload();
  } catch {
    setAuthenticated(false);
    window.location.reload();
  }
};
