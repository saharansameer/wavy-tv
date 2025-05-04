import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import { Link } from "react-router-dom";

interface DeletedPostProps {
  message?: string;
  browseRoute?: string;
  className?: string;
}

export function UnavailablePost({
  message = "This post has been deleted or is no longer available.",
  browseRoute = "/p/feed",
  className = "",
}: DeletedPostProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileX className="h-12 w-12 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold mt-2">Post No Longer Available</h2>

      <p className="mt-3 mb-6 max-w-md text-muted-foreground">{message}</p>

      <Button asChild>
        <Link to={browseRoute}>Return to feed</Link>
      </Button>
    </div>
  );
}
