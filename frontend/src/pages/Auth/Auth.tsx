import React from "react";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";
import { Navigate } from "react-router-dom";

interface AuthProps {
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export const Auth: React.FC<AuthProps> = ({ children, skeleton }) => {
  const {
    authorized,
    setAuthorized,
    tokenExpiry,
    setTokenExpiry,
    authenticated,
    setAuthenticated,
    setAuthOverlayOpen,
    isAuthOverlayOpen,
  } = useAuthStore();
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const now = Date.now();

      // Return from here if not even authenticated (i.e logged in)
      if (!authenticated) {
        setWaiting(false);
        setAuthOverlayOpen(true);
        return;
      }

      // Go ahead only if Access Token is expired
      if (tokenExpiry > now + 60000) {
        setWaiting(false);
        return;
      }

      // Generate new tokens
      axios
        .get("/api/v1/auth/token/new")
        .then((res) => {
          if (res.data.status === 200) {
            setAuthorized(true);
            setAuthenticated(true);
            setTokenExpiry(now + 2 * 60 * 1000);
          }
        })
        .catch(() => {
          // If refresh token is also expired, then delete both from cookies
          axios.get("/api/v1/auth/token/delete");
          setAuthorized(false);
          setAuthenticated(false);
        })
        .finally(() => {
          setWaiting(false);
        });

      return;
    };

    checkAuth();
  }, [
    setAuthorized,
    authenticated,
    setAuthenticated,
    tokenExpiry,
    setTokenExpiry,
    setAuthOverlayOpen,
  ]);

  if (waiting) return <>{skeleton}</>;

  if (!authorized && !isAuthOverlayOpen) {
    return <Navigate to={"/"} />;
  }

  return <>{children}</>;
};
