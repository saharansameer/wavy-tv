import React from "react";
import useAuthStore from "@/app/store/authStore";
import { Navigate } from "react-router-dom";
import { LoadingOverlay } from "@/components";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";

interface AuthProps {
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

export const Auth: React.FC<AuthProps> = ({ children, skeleton }) => {
  const {
    tokenExpiry,
    setTokenExpiry,
    authenticated,
    setAuthenticated,
    setAuthOverlayOpen,
    isAuthOverlayOpen,
  } = useAuthStore();
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      await verifyAndGenerateNewToken();
      setWaiting(false);
    })();
  }, [
    authenticated,
    setAuthenticated,
    tokenExpiry,
    setTokenExpiry,
    setAuthOverlayOpen,
  ]);

  if (!authenticated && !isAuthOverlayOpen) {
    return <Navigate to={"/"} />;
  }

  if (waiting) return <>{skeleton || <LoadingOverlay />}</>;

  return <>{children}</>;
};
