import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const generateCloudinarySignature = (folderName: FolderType) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const upload_preset = "ml_default";
  const folder = folderName;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset, folder },
    CLOUDINARY_API_SECRET!
  );

  return { signature, timestamp, upload_preset, folder };
};
