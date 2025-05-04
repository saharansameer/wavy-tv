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
  const { authenticated, setAuthOverlayOpen, isAuthOverlayOpen } =
    useAuthStore();
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      await verifyAndGenerateNewToken();
      setWaiting(false);
    })();
  }, []);

  React.useEffect(() => {
    if (!authenticated && !isAuthOverlayOpen) {
      setAuthOverlayOpen(true);
    }
  }, [authenticated, isAuthOverlayOpen, setAuthOverlayOpen]);

  if (!authenticated) {
    return <Navigate to={"/"} />;
  }

  if (waiting) return <>{skeleton || <LoadingOverlay />}</>;

  return <>{children}</>;
};
