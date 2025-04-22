import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui";

interface UploadProgressOverlay {
  message?: string;
  progress?: number; // Optional 0–100
}

export function UploadProgressOverlay({
  message,
  progress,
}: UploadProgressOverlay) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm bg-black/30 transition-all"
      )}
    >
      <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
