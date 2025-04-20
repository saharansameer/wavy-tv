import ApiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { generateCloudinarySignature } from "../services/cloudinary.js";

export const getCloudinarySignature: Controller = async (req, res) => {
  const dir = req.query.dir as FolderType;

  const { signature, timestamp, upload_preset, folder } =
    generateCloudinarySignature(dir);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: "Cloudinary Signature fetched successfully",
      data: { signature, timestamp, upload_preset, folder },
    })
  );
};
