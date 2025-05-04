import { Input, Label, CardContent, Button } from "@/components/ui";
import { PasswordInput, ErrorMessage, LoaderSpin } from "@/components";
import { showToast } from "@/utils/toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailFormSchema, EmailFormSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

export function EmailForm({ isActive }: SettingComponentProps) {
  const { setAuthUser, authUser } = useAuthStore();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailFormSchemaType>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<EmailFormSchemaType> = async (data) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Email Form Data
      const { email, newEmail, password } = data;

      // Check if email is available
      const exist = await axios.post("/api/v1/auth/exist", { email: newEmail });
      if (!exist.data.data.email) {
        setError("newEmail", {
          type: "manual",
          message: "Email already exist",
        });
        return;
      }

      // PATCH request
      const res = await axios.patch("/api/v1/user/update/email", {
        currEmail: email,
        newEmail,
        password,
      });

      // Update user details in authStore
      setAuthUser(res.data.data);

      showToast("user-email-update");
      reset();
    } catch {
      setError("password", {
        type: "manual",
        message: "Incorrect password",
      });
    }
  };

  return (
    <CardContent>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className={`space-y-2 overflow-hidden 
        transition-[max-height,opacity] duration-1000 ease-initial
        ${isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            disabled={true}
            value={authUser.email}
            {...register("email")}
          ></Input>
        </div>
        <fieldset disabled={!isActive} className="space-y-5 px-1">
          <div className="space-y-2">
            <Label>New Email</Label>
            <Input
              type="email"
              placeholder="Enter new email"
              {...register("newEmail")}
            ></Input>
            {errors.newEmail && (
              <ErrorMessage text={`${errors.newEmail.message}`} />
            )}
          </div>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <PasswordInput {...register("password")} />
            {errors.password && (
              <ErrorMessage text={`${errors.password.message}`} />
            )}
          </div>
          <Button type="submit" className="font-semibold">
            {isSubmitting ? <LoaderSpin /> : "Save"}
          </Button>
        </fieldset>
      </form>
    </CardContent>
  );
}
