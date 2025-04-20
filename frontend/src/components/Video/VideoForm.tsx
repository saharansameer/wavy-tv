import { Editor } from "primereact/editor";
import { InputWithLabel } from "../ui/input-with-label";
import { InputFile } from "../ui/input-file";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { MySwitch, ErrorMessage } from "@/components";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";

export default function VideoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitHandler = async (data) => {
    try {
      console.log(data);
      // Video File
      const videoFile = data.videoFile[0];

      // Video Upload Response (from Cloudinary)
      /*{ public_id, duration, height, width, url,
        frame_rate, format, created_at, bytes,
        bit_rate, audio, is_audio }*/
      const videoFileUploadRes = await uploadToCloudinary({
        file: videoFile,
        folder: "videos",
      });
      console.log(videoFileUploadRes);
      // Thumbnail
      const thumbnail = data?.thumbnail[0];

      // Thumbnail Upload Response (from Cloudinary)
      /*{ public_id, url, bytes, height, width, format, created_at }*/
      const thumbnailUploadRes = await uploadToCloudinary({
        file: thumbnail,
        folder: "thumbnails",
      });
      console.log(thumbnailUploadRes);
    } catch (error) {
      console.log("Video Form Error:", error);
    }

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-5 px-10"
    >
      <div>
        <InputWithLabel
          type="text"
          label={"Title"}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 characters",
            },
            maxLength: {
              value: 100,
              message: "Title must be at most 100 characters",
            },
          })}
        />
        {errors.title && <ErrorMessage text={`${errors.title.message}`} />}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description-editor">Description</Label>
        <Editor
          id="description-editor"
          {...register("description", {
            maxLength: {
              value: 5000,
              message: "Description can't exceed 5000 characters limit",
            },
          })}
          style={{ height: "320px" }}
        />
        {errors.description && (
          <ErrorMessage text={`${errors.description.message}`} />
        )}
      </div>

      <div>
        <InputFile
          {...register("videoFile", {
            required: "Video file is required",
            validate: {
              isVideo: (files) =>
                files?.[0] &&
                ["video/mp4", "video/quicktime", "video/webm"].includes(
                  files[0].type
                )
                  ? true
                  : "Only MP4, MOV, or WEBM videos are allowed",
            },
          })}
          accept="video/*"
          className={"cursor-pointer"}
          label={"Video"}
        />
        {errors.videoFile && (
          <ErrorMessage text={`${errors.videoFile.message}`} />
        )}
      </div>

      <div>
        <InputFile
          {...register("thumbnail", {
            required: "Thumbnail is required",
            validate: {
              isImage: (files) =>
                !files?.[0] ||
                ["image/jpeg", "image/jpg", "image/png"].includes(
                  files[0].type
                ) ||
                "Only JPG, JPEG, or PNG images are allowed",
            },
          })}
          accept="image/jpeg, image/jpg, image/png"
          className={"cursor-pointer"}
          label={"Thumbnail"}
        />
        {errors.thumbnail && (
          <ErrorMessage text={`${errors.thumbnail.message}`} />
        )}
      </div>

      <div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue
              placeholder="Publish Status"
              {...register("publishStatus")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRIVATE">Private</SelectItem>
            <SelectItem value="UNLISTED">Unlisted</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" {...register("category")} />
          </SelectTrigger>
          <SelectContent style={{ height: "256px" }}>
            <SelectGroup>
              <SelectLabel></SelectLabel>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
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
      </div>

      <div className="flex flex-row gap-1">
        <img src="/nsfw-icon.svg" alt="nsfw" className="w-6" />
        <MySwitch
          label={"NSFW"}
          {...register("nsfw")}
          className={"cursor-pointer"}
        />
      </div>

      <Button
        type="submit"
        className={`cursor-pointer`}
        disabled={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}
