import React from "react";

interface OverlayProps {
  children: React.ReactNode | null;
}

export function RenderOverlay({ children }: OverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl">{children}</div>
    </div>
  );
}
