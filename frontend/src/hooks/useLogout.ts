import axios from "axios";

export const useLogout = () => {
  axios.get("/api/v1/auth/logout").then(() => {
    localStorage.removeItem("auth");
    window.location.reload();
  });
};
