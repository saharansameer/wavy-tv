import { Input, Label, Button } from "@/components/ui";
import { ErrorMessage, LoaderSpin, TextEditor } from "@/components";
import { showToast } from "@/utils/toast";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { updateUserInfoSchema, UpdateUserInfoSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";
import { setQueryInvalid } from "@/utils/reactQueryUtils";
import { useNavigate } from "react-router-dom";
import { ProfileHeaderProps } from "../UserProfile/ProfileHeader";

export function UpdateUserInfo({ user }: ProfileHeaderProps) {
  const { setAuthUser, authUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UpdateUserInfoSchemaType>({
    resolver: zodResolver(updateUserInfoSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      fullName: user.fullName,
      username: user.username,
      about: user.about,
    },
  });

  const onSubmitHandler: SubmitHandler<UpdateUserInfoSchemaType> = async (
    data
  ) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Email Form Data
      const { fullName, username, about } = data;

      // PATCH request
      await axios.patch("/api/v1/user/update/info", {
        fullName,
        username,
        about,
      });

      // Invalidate persisted data
      await setQueryInvalid({ queryKey: [authUser.username] });

      // Update user details in authStore
      setAuthUser({ ...authUser, fullName, username });

      // Show toast and reset form
      showToast("user-details-update");
      reset();

      // Navigate
      navigate(`/u/${username}`);
    } catch (error) {
      console.error("UpdateUserInfo Error:", error);
      setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={`space-y-5`}>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          type="text"
          placeholder="Enter new email"
          {...register("fullName")}
        ></Input>
        {errors.fullName && (
          <ErrorMessage text={`${errors.fullName.message}`} />
        )}
      </div>
      <div className="space-y-2">
        <Label>Username</Label>
        <Input
          type="text"
          placeholder="Enter new email"
          {...register("username")}
        ></Input>
        {errors.username && (
          <ErrorMessage text={`${errors.username.message}`} />
        )}
      </div>

      <Controller
        control={control}
        name="about"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>About</Label>
            <TextEditor
              onChange={field.onChange}
              value={field.value as string}
              placeholder="Describe yourself..."
            />
            {errors.fullName && (
              <ErrorMessage text={`${errors.fullName.message}`} />
            )}
          </div>
        )}
      />

      <Button type="submit" className="font-semibold">
        {isSubmitting ? <LoaderSpin /> : "Save"}
      </Button>
    </form>
  );
}
