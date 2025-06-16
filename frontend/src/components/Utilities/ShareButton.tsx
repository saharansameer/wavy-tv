import React from "react";
import { Button } from "@/components/ui";
import { Forward } from "lucide-react";
import { useLocation } from "react-router-dom";
import { showToast } from "@/utils/toast";

const iconStyle = {
  width: "20px",
  height: "20px",
};

export function ShareButton() {
  const location = useLocation();

  const copyLinkToClipboard = React.useCallback(() => {
    window.navigator.clipboard.writeText(
      `https://wavytv.vercel.app${location.pathname}`
    );
    showToast("share-action");
  }, [location.pathname]);

  return (
    <Button
      onClick={copyLinkToClipboard}
      variant={"outline"}
      className="w-16 h-7 px-2 shadow-xs"
    >
      <Forward style={iconStyle} />
    </Button>
  );
}
