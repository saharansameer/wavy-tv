import { Button } from "@/components/ui/button";
import { VideoOff } from "lucide-react";
import { Link } from "react-router-dom";

interface UnavailableVideoProps {
  message?: string;
  browseRoute?: string;
  showBrowseButton?: boolean;
  className?: string;
}

export function UnavailableVideo({
  message = "This video is private or has been removed by the creator.",
  browseRoute = "/v/feed",
  showBrowseButton = true,
  className = "",
}: UnavailableVideoProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="rounded-full bg-muted p-6 mb-4">
        <VideoOff className="h-12 w-12 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold mt-2">Video Unavailable</h2>

      <p className="mt-3 mb-6 max-w-md text-muted-foreground">{message}</p>

      {showBrowseButton && (
        <Button asChild>
          <Link to={browseRoute}>Browse more videos</Link>
        </Button>
      )}
    </div>
  );
}
