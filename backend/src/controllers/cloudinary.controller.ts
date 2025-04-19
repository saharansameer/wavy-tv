import ApiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { generateCloudinarySignature } from "../services/cloudinary.js";

export const getCloudinarySignature: Controller = async (_req, res) => {
  const { signature, timestamp, upload_preset, source } =
    generateCloudinarySignature();

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: "Cloudinary Signature fetched successfully",
      data: { signature, timestamp, upload_preset, source },
    })
  );
};
