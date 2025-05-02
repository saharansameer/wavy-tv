import React from "react";
import { EyeOff, Eye } from "lucide-react";
import { Button, Input } from "@/components/ui";

export function PasswordInput({ ...props }) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        {...props}
      />
      <Button
        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
        variant={"link"}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
