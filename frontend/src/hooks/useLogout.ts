import axios from "axios";
import { queryClient } from "@/app/query/queryClient";
import { generateNewToken } from "@/utils/generateToken";

export const useLogout = async () => {
  try {
    await generateNewToken();
    await axios.get("/api/v1/auth/logout");
    await queryClient.invalidateQueries();
    localStorage.removeItem("auth");
    window.location.reload();
  } catch {
    localStorage.removeItem("auth");
    window.location.reload();
  }
};
