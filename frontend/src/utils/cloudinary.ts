import { axios } from "@/app/config/axios";
import { cloudinaryConfig } from "@/app/config/env";

type UploadOptions = {
  file: File;
  folder: string;
};

export const uploadToCloudinary = async ({ file, folder }: UploadOptions) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned");
    formData.append("folder", folder);

    const uploadResponse = await axios.post(
      cloudinaryConfig.UPLOAD_URL,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
      }
    );

    return uploadResponse.data;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};
