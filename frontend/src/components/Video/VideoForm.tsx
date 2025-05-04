import React from "react";
import { InputWithLabel, Button, Label, Switch } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  ErrorMessage,
  FileInput,
  TextEditor,
  UploadProgressOverlay,
} from "@/components";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  videoEditFormSchema,
  VideoEditFormSchemaType,
  videoFormSchema,
  VideoFormSchemaType,
} from "@/app/schema";
import axios from "axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { updatePersistData } from "@/utils/reactQueryUtils";
import { AuthUser } from "@/components";
import { showToast } from "@/utils/toast";

interface VideoFormProps {
  mode?: "post" | "patch";
  videoPublicId?: string;
  data?: any;
  onClose?: () => void;
}

export function VideoForm({
  mode = "post",
  videoPublicId,
  data,
  onClose,
}: VideoFormProps) {
  const isEditMode: boolean = mode === "patch";
  const schema = isEditMode ? videoEditFormSchema : videoFormSchema;
  const [progressPercent, setProgressPercent] = React.useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<VideoFormSchemaType | VideoEditFormSchemaType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: isEditMode
      ? {
          title: data.title,
          description: data.description || "",
          publishStatus: data.publishStatus,
          category: data.category,
          nsfw: data.nsfw,
        }
      : {
          publishStatus: "PUBLIC",
          category: "GENERAL",
          nsfw: false,
        },
  });

  React.useEffect(() => {
    if (isSubmitting && progressPercent < 90) {
      const timer = setInterval(
        () => setProgressPercent((prev) => prev + 5),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [progressPercent, isSubmitting]);

  const onSubmitHandler: SubmitHandler<
    VideoFormSchemaType | VideoEditFormSchemaType
  > = async (data) => {
    try {
      // Check Auth
      if (!(await verifyAndGenerateNewToken())) return;

      // Video Form Data
      const {
        title,
        description,
        video,
        thumbnail,
        publishStatus,
        category,
        nsfw,
      } = data;

      // Edit Mode Form - Start
      if (isEditMode) {
        // Check Auth (Edit Mode)
        if (!(await verifyAndGenerateNewToken())) return;

        // New Thumbnail Data (Only If user wants to update it)
        let thumbnailUploadRes = null;
        if (thumbnail) {
          thumbnailUploadRes = await uploadToCloudinary({
            file: thumbnail,
            folder: "thumbnails",
          });
        }

        // Video Patch Request
        await axios.patch(`/api/v1/video/${videoPublicId}`, {
          title,
          description,
          thumbnail: thumbnailUploadRes,
          publishStatus,
          category,
          nsfw,
        });

        // Refresh Video's details in persisted storage
        await updatePersistData(["video", videoPublicId as string], {
          title,
          description,
          publishStatus,
          category,
          nsfw,
        });

        onClose?.();
        showToast("video-edit");
        return;
      }

      // Edit Mode Form Logic - End

      // Video Upload Response (from Cloudinary)
      const videoUploadRes = await uploadToCloudinary({
        file: video as File,
        folder: "videos",
      });

      // Thumbnail Upload Response (from Cloudinary)
      const thumbnailUploadRes = await uploadToCloudinary({
        file: thumbnail as File,
        folder: "thumbnails",
      });

      // Video Post Request
      await axios.post("/api/v1/video/upload", {
        title,
        description,
        video: videoUploadRes,
        thumbnail: thumbnailUploadRes,
        publishStatus,
        category,
        nsfw,
      });
    } catch (error) {
      console.log("Video Form Error:", error);
    }

    setProgressPercent(0);
    showToast("video-create");
    reset();
  };

  if ((isSubmitting || isLoading) && !isEditMode) {
    return <UploadProgressOverlay progress={progressPercent} />;
  }

  return (
    <div className="flex flex-col gap-5 px-3 md:px-10 pb-7 pt-3">
      {!isEditMode && <AuthUser />}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-10"
      >
        {/* Title */}
        <div>
          <InputWithLabel
            type="text"
            className={"max-w-5xl"}
            placeholder={"Title"}
            label={"Title"}
            {...register("title")}
          />
          {errors.title && <ErrorMessage text={`${errors.title.message}`} />}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <TextEditor
                  className="max-w-5xl h-[250px] md:h-[350px]"
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Start writing... (optional)"
                />
              </div>
            )}
          />
          {errors.description && (
            <ErrorMessage text={`${errors.description.message}`} />
          )}
        </div>

        {/* Video File */}
        {isEditMode ? (
          <></>
        ) : (
          <div className="flex flex-col gap-2 select-none">
            <Controller
              control={control}
              name="video"
              render={({ field }) => (
                <>
                  <Label>Video</Label>
                  <FileInput
                    id={"video-file-input"}
                    value={field.value as File}
                    onChange={field.onChange}
                    accept="video/*"
                    maxFileSize={100}
                  />
                </>
              )}
            />
            {errors.video && <ErrorMessage text={`${errors.video.message}`} />}
          </div>
        )}

        {/* Thumbnail */}
        <div className="flex flex-col gap-2 select-none">
          <Controller
            control={control}
            name="thumbnail"
            render={({ field }) => (
              <>
                <Label>Thumbnail</Label>
                <FileInput
                  id={"thumbnail-file-input"}
                  value={field.value as File}
                  onChange={field.onChange}
                  accept="image/jpeg, image/jpg, image/png"
                  maxFileSize={10}
                />
              </>
            )}
          />

          {errors.thumbnail && (
            <ErrorMessage text={`${errors.thumbnail.message}`} />
          )}
        </div>

        {/* Publish Status */}
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="publishStatus"
            render={({ field }) => (
              <>
                <Label>Publish Status</Label>
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
              </>
            )}
          />

          {errors.publishStatus && (
            <ErrorMessage text={`${errors.publishStatus.message}`} />
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <>
                <Label>Category</Label>
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
              </>
            )}
          />
          {errors.category && (
            <ErrorMessage text={`${errors.category.message}`} />
          )}
        </div>

        {/* NSFW */}
        <div className="flex flex-col gap-1">
          <Label>Mark as NSFW</Label>
          <div className="flex items-center gap-1">
            <img src="/nsfw-icon.svg" alt="nsfw" className="w-6" />
            <Controller
              control={control}
              name="nsfw"
              render={({ field }) => (
                <Switch
                  className={"cursor-pointer"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`max-w-sm sm:max-w-3xs font-semibold`}
          disabled={isSubmitting}
        >
          {isEditMode ? "Save Changes" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
