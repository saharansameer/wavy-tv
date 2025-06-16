import type React from "react";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyContentProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionRoute?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NoContent({
  title = "Empty for Now",
  description = "The content you're looking for doesn't exist.",
  actionText,
  actionRoute,
  icon = <Inbox className="h-12 w-12" />,
  className = "",
}: EmptyContentProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="rounded-full bg-muted p-4 mb-4">{icon}</div>

      <h3 className="text-xl font-semibold mt-4">{title}</h3>

      <p className="mt-2 mb-6 max-w-md text-muted-foreground">{description}</p>

      {actionText && actionRoute && (
        <Button asChild>
          <Link to={actionRoute}>{actionText}</Link>
        </Button>
      )}
    </div>
  );
}
