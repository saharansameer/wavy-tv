import React from "react";
import {
  Input,
  Label,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  ErrorMessage,
  LoaderSpin,
  FileInput,
  UploadProgressOverlay,
} from "@/components";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { imageFormSchema, ImageFormSchemaType } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { showToast } from "@/utils/toast";
import { setQueryInvalid } from "@/utils/reactQueryUtils";
import { uploadToCloudinary } from "@/utils/cloudinary";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

interface UpdateImageProps {
  folder: "avatars" | "coverImages";
  label: string;
}

export default function UpdateImage({ folder, label }: UpdateImageProps) {
  const { authUser, setAuthUser } = useAuthStore();
  const [progressPercent, setProgressPercent] = React.useState(0);

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ImageFormSchemaType>({
    resolver: zodResolver(imageFormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<ImageFormSchemaType> = async (data) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Image Form Data
      const { image } = data;
      let imageUploadRes = null;

      // Getting Response from Cloudinary
      if (image) {
        imageUploadRes = await uploadToCloudinary({
          file: image,
          folder: folder,
        });
      }

      // If no image selected by user
      if (imageUploadRes === null) return;

      // PATCH request
      await axios.patch(
        `/api/v1/user/update/image?type=${folder.slice(0, -1)}`,
        {
          image: imageUploadRes,
        }
      );

      // Invaidate persisted data and update authUser
      await setQueryInvalid({ queryKey: [authUser.username] });
      if (folder === "avatars") {
        setAuthUser({ ...authUser, avatar: imageUploadRes.secure_url });
      }

      // Show toast
      showToast("user-profile-update");
    } catch (error) {
      console.error("ImageFormError: ", error);
    }

    setProgressPercent(0);
    reset();
  };

  React.useEffect(() => {
    if (isSubmitting && progressPercent < 90) {
      const timer = setInterval(
        () => setProgressPercent((prev) => prev + 5),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [progressPercent, isSubmitting]);

  if (isSubmitting) {
    return <UploadProgressOverlay progress={progressPercent} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{label}</CardTitle>
        <CardDescription>{`Update user's ${label}`}</CardDescription>
      </CardHeader>

      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col items-center gap-y-10"
      >
        <Controller
          control={control}
          name={"image"}
          render={({ field }) => (
            <div className="space-y-2">
              {errors.image && (
                <ErrorMessage text={`${errors.image.message}`} />
              )}
              <FileInput
                id={folder}
                value={field.value as File}
                onChange={field.onChange}
                accept="image/jpeg, image/jpg, image/png"
                maxFileSize={10}
              />
            </div>
          )}
        />

        <Button type="submit" variant={"default"} className="min-w-3xs font-semibold">
          Save
        </Button>
      </form>
    </Card>
  );
}
