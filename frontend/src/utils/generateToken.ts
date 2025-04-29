import axios from "axios";

export const generateNewToken = async () => {
  try {
    await axios.get("/api/v1/auth/token/new", { withCredentials: true });
    return true;
  } catch {
    return false;
  }
};
