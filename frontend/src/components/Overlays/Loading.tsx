import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui";

interface UploadProgressOverlayProps {
  message?: string;
  progress?: number;
}

export function UploadProgressOverlay({
  message,
  progress,
}: UploadProgressOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm bg-black/30 transition-all"
      )}
    >
      <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl">
        <p className="text-sm text-muted-foreground">
          {message || "Upload in progress..."}
        </p>

        {typeof progress === "number" && (
          <Progress value={progress} className="w-64 mt-2" />
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
