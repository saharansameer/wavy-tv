import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui";
import useAuthStore from "@/app/store/authStore";
import { X } from "lucide-react";
import { RenderOverlay } from "@/components";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthOverlay() {
  const { isAuthOverlayOpen, setAuthOverlayOpen } = useAuthStore();

  if (isAuthOverlayOpen)
    return (
      <RenderOverlay>
        <Tabs defaultValue="login" className="min-w-80 md:min-w-md">
          <div className="flex justify-end">
            <Button
              className="cursor-pointer max-w-10"
              variant={"secondary"}
              onClick={() => setAuthOverlayOpen(false)}
            >
              <X style={{ height: "20px", width: "20px" }} />
            </Button>
          </div>

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="login">
              Login
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="signup">
              Signup
            </TabsTrigger>
          </TabsList>

          {/* Login Card */}
          <LoginForm />

          {/* Signup Card */}
          <SignupForm />
        </Tabs>
      </RenderOverlay>
    );

  return <></>;
}
