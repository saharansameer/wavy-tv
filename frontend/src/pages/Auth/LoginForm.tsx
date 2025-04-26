import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, Input, Label, TabsContent } from "@/components/ui";
import { ErrorMessage } from "@/components";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormSchemaType } from "@/app/schema";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setAuthenticated, setAuthorized, setAuthOverlayOpen, setAuthUser } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmitHandler: SubmitHandler<LoginFormSchemaType> = async (data) => {
    try {
      console.log(data);
      const { email, password } = data;
      const loginResponse = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      // Set Auth User Data
      const user = loginResponse.data.data;
      setAuthUser(user);
      setAuthenticated(true);
      setAuthorized(true);
      setAuthOverlayOpen(false);
    } catch (error) {
      console.error("Login Form Error:", error);
    }

    reset();
  };

  return (
    <TabsContent value="login">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Log in to get access</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <CardContent className="space-y-7">
            <div className="space-y-1">
              <Label htmlFor="login-email">Email</Label>
              <Input
                type="email"
                id="login-email"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage text={`${errors.email.message}`} />
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <Button
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                  variant={"ghost"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.password && (
                <ErrorMessage text={`${errors.password.message}`} />
              )}
            </div>
          </CardContent>
          <div className="py-4"></div>
          <CardFooter>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
