import { CardContent, Label, Button } from "@/components/ui";
import { PasswordInput, ErrorMessage, LoaderSpin } from "@/components";
import { showToast } from "@/utils/toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { passwordFormSchema, PasswordFormSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import axios from "axios";

export function PasswordForm({ isActive }: SettingComponentProps) {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<PasswordFormSchemaType> = async (
    data
  ) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Password Form Data
      const { currPassword, newPassword, confirmNewPassword } = data;

      // PATCH request
      await axios.patch("/api/v1/user/update/password", {
        currPassword,
        newPassword,
        confirmNewPassword,
      });

      showToast("user-password-change");
      reset();
    } catch {
      setError("currPassword", {
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
        <fieldset disabled={!isActive} className="space-y-5 px-1">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <PasswordInput {...register("currPassword")} />
            {errors.currPassword && (
              <ErrorMessage text={`${errors.currPassword.message}`} />
            )}
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <PasswordInput {...register("newPassword")} />
            {errors.newPassword && (
              <ErrorMessage text={`${errors.newPassword.message}`} />
            )}
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <PasswordInput {...register("confirmNewPassword")} />
            {errors.confirmNewPassword && (
              <ErrorMessage text={`${errors.confirmNewPassword.message}`} />
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
