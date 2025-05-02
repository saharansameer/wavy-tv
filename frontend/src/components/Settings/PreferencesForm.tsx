import { CardContent, Label, Button } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ErrorMessage, LoaderSpin } from "@/components";
import { showToast } from "@/utils/toast";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { preferencesFormSchema, PreferencesFormSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

export function PreferencesForm({ isActive }: SettingComponentProps) {
  const { setAuthUser, authUser } = useAuthStore();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PreferencesFormSchemaType>({
    resolver: zodResolver(preferencesFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: { ...authUser },
  });

  const onSubmitHandler: SubmitHandler<PreferencesFormSchemaType> = async (
    data
  ) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Preferences Form Data
      const { theme, nsfwContent, publishStatus, category } = data;

      // PATCH request
      const res = await axios.patch("/api/v1/user/update/preferences", {
        theme,
        nsfwContent,
        publishStatus,
        category,
      });

      // Update user details in authStore
      setAuthUser(res.data.data);

      showToast("user-preference-update");
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong",
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
          {/* Theme */}
          <Controller
            control={control}
            name="theme"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-sm md:max-w-2xs">
                    <SelectValue placeholder="Select publish status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                {errors.theme && (
                  <ErrorMessage text={`${errors.theme.message}`} />
                )}
              </div>
            )}
          />

          {/* NSFW Content */}
          <Controller
            control={control}
            name="nsfwContent"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>NSFW Content</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-sm md:max-w-2xs">
                    <SelectValue placeholder="Select publish status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHOW">Show</SelectItem>
                    <SelectItem value="HIDE">Hide</SelectItem>
                    <SelectItem value="BLUR">Blur</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nsfwContent && (
                  <ErrorMessage text={`${errors.nsfwContent.message}`} />
                )}
              </div>
            )}
          />

          {/* Publish Status */}

          <Controller
            control={control}
            name="publishStatus"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Default Publish Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-sm md:max-w-2xs">
                    <SelectValue placeholder="Select publish status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="UNLISTED">Unlisted</SelectItem>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                  </SelectContent>
                </Select>
                {errors.publishStatus && (
                  <ErrorMessage text={`${errors.publishStatus.message}`} />
                )}
              </div>
            )}
          />

          {/* Category */}

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Default Category</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full max-w-sm md:max-w-2xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent style={{ height: "256px" }}>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="ENTERTAINMENT">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                    </SelectGroup>

                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="GAMING">Gaming</SelectItem>
                      <SelectItem value="MUSIC">Music</SelectItem>
                      <SelectItem value="COMEDY">Comedy</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="PROGRAMMING">Programming</SelectItem>
                      <SelectItem value="SCIENCE">Science</SelectItem>
                      <SelectItem value="TECH">Tech</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="ART">Art</SelectItem>
                      <SelectItem value="ANIMATION">Animation</SelectItem>
                      <SelectItem value="GRAPHICS">Graphics</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <ErrorMessage text={`${errors.category.message}`} />
                )}
              </div>
            )}
          />

          {/* Submit Button*/}
          <Button type="submit" className="font-semibold">
            {isSubmitting ? <LoaderSpin /> : "Save"}
          </Button>
        </fieldset>
      </form>
    </CardContent>
  );
}
