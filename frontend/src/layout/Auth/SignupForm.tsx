import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, Input, Label, TabsContent } from "@/components/ui";
import { ErrorMessage, LoaderSpin, PasswordInput } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema, SignupFormSchemaType } from "@/app/schema";
import { axios } from "@/app/config/axios";
import useAuthStore from "@/app/store/authStore";
import { showToast } from "@/utils/toast";

export function SignupForm() {
  const { setAuthOverlayOpen } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<SignupFormSchemaType> = async (data) => {
    try {
      const { fullName, username, email, password } = data;

      // Checks if Email and Username both are available
      const existResponse = await axios.post("/api/v1/auth/exist", {
        email,
        username,
      });

      const userData = existResponse.data.data;

      // Edge case scenario very rare
      if (userData.email === false && userData.username === false) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
        setError("email", {
          type: "manual",
          message: "An account already exist with this Email",
        });
        return;
      }

      // If username is already taken
      if (userData.username === false) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
        return;
      }

      // If Email is already taken
      if (userData.email === false) {
        setError("email", {
          type: "manual",
          message: "An account already exist with this Email",
        });
        return;
      }

      // Signup Request
      await axios.post("/api/v1/auth/signup", {
        fullName,
        email,
        username,
        password,
      });

      showToast("user-signup");
      setAuthOverlayOpen(false);
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong",
      });
    }

    setAuthOverlayOpen(true);
    reset();
  };

  return (
    <TabsContent value="signup">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Signup</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <CardContent className="space-y-7">
            <div className="space-y-1">
              {errors.root && <ErrorMessage text={`${errors.root.message}`} />}
              <Label htmlFor="signup-fullname">Full Name</Label>
              <Input
                id="signup-fullname"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <ErrorMessage text={`${errors.fullName.message}`} />
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-username">Username</Label>
              <Input
                id="signup-username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <ErrorMessage text={`${errors.username.message}`} />
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage text={`${errors.email.message}`} />
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-password">Password</Label>
              <PasswordInput {...register("password")} />
              {errors.password && (
                <ErrorMessage
                  text={`${errors.password.message}`}
                  className={"w-72 line-clamp-2 leading-5"}
                />
              )}
            </div>
          </CardContent>
          <div className="py-4"></div>
          <CardFooter className="space-y-1">
            <Button type="submit" className="cursor-pointer font-semibold w-full">
              {isSubmitting ? <LoaderSpin /> : "Sign up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
