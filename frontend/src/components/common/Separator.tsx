import React from "react";
import clsx from "clsx";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  label,
  className,
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={clsx(
        "flex py-4",
        isHorizontal ? "items-center w-full" : "flex-col h-full justify-center",
        className
      )}
    >
      {isHorizontal ? (
        <>
          <span className="flex-grow border-t border-gray-200"></span>
          {label && (
            <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
              {label}
            </span>
          )}
          <span className="flex-grow border-t border-gray-200"></span>
        </>
      ) : (
        <>
          <span className="border-l border-gray-200 flex-grow"></span>
          {label && (
            <span className="py-4 text-base text-accent whitespace-nowrap rotate-90">
              {label}
            </span>
          )}
          <span className="border-l border-gray-200 flex-grow"></span>
        </>
      )}
    </div>
  );
};
