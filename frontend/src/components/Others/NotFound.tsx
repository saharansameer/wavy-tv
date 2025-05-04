import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        Page not found
      </h2>

      <p className="mt-4 mb-8 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved to another
        location.
      </p>

      <Button asChild variant="default" size="lg" className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </Button>
    </div>
  );
}
