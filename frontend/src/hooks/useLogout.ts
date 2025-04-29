import axios from "axios";
import { generateNewToken } from "@/utils/generateToken";
import { setQueriesInvalid } from "@/utils/reactQueryUtils";

export const useLogout = async () => {
  try {
    await generateNewToken();
    await axios.get("/api/v1/auth/logout");
    await setQueriesInvalid();
    localStorage.removeItem("auth");
    window.location.reload();
  } catch {
    localStorage.removeItem("auth");
    window.location.reload();
  }
};
