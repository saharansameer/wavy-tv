import axios from "axios";
import { cloudinaryConfig } from "@/app/config/env";

type UploadOptions = {
  file: File;
  folder: string;
};

export const uploadToCloudinary = async ({ file, folder }: UploadOptions) => {
  try {
    const signatureResponse = await axios.get(
      `/api/v1/cloudinary/signature?dir=${folder}`
    );
    console.log(signatureResponse.data.data);
    const { signature, timestamp, upload_preset } = signatureResponse.data.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", cloudinaryConfig.API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("upload_preset", upload_preset);
    formData.append("folder", folder);

    const uploadResponse = await axios.post(
      cloudinaryConfig.UPLOAD_URL,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return uploadResponse.data;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};
