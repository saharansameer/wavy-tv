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

type CloudinaryDestroyer = (
  publicId: string,
  resourceType: "video" | "image" | "raw"
) => Promise<boolean>;

export const destroyAssetFromCloudinary: CloudinaryDestroyer = async (
  publicId,
  resourceType
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: resourceType,
    });
    return true;
  } catch {
    return false;
  }
};
