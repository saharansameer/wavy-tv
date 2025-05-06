import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const activateServerInstance: Controller = async (_req, res) => {
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Server is active now!",
      success: true,
    })
  );
};

const activate = asyncHandler(activateServerInstance);

export default activate;
