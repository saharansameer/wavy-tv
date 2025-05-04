import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, Input, Label, TabsContent } from "@/components/ui";
import { ErrorMessage, PasswordInput, LoaderSpin } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormSchemaType } from "@/app/schema";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";
import { setQueriesInvalid } from "@/utils/reactQueryUtils";
import { showToast } from "@/utils/toast";

export function LoginForm() {
  const { setAuthenticated, setAuthOverlayOpen, setAuthUser, setTokenExpiry } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmitHandler: SubmitHandler<LoginFormSchemaType> = async (data) => {
    try {
      const { email, password } = data;
      const loginResponse = await axios.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // Set Auth User Data
      const user = loginResponse.data.data;

      setAuthUser(user);
      setAuthenticated(true);
      setTokenExpiry(Date.now() + 10 * 60 * 1000);
      setAuthOverlayOpen(false);

      // Show toast and set queries invalid
      showToast("user-login");
      await setQueriesInvalid();

      reset();
    } catch {
      setError("root", {
        type: "manual",
        message: "Invalid Email or Password",
      });
    }
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
              {errors.root && <ErrorMessage text={`${errors.root.message}`} />}
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
              <Label>Password</Label>
              <PasswordInput {...register("password")} />
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
              {isSubmitting ? <LoaderSpin /> : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
