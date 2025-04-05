import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";

export const getCurrentUser: Controller = async (req, res) => {
  // Get User Details
  const user = await User.findById(req.user?._id).select(
    "-_id fullName username email creatorMode"
  );

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.FETCH_DETAILS_SUCCESS,
      data: user,
    })
  );
};

export const updateUserNames: Controller = async (req, res) => {
  // User new details (i.e fullName and username)
  const { fullName, username } = req.body;

  // Remove Extra Spaces
  const trimmedFullName = trimAndClean(fullName || "");
  const trimmedUsername = trimAndClean(username || "");

  // Check if both values exist
  if (!trimmedFullName || !trimmedUsername) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Update User Details
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: trimmedFullName,
        username: trimmedUsername,
        "lastModified.fullName": new Date(),
        "lastModified.username": new Date(),
        tags: [trimmedFullName, trimmedUsername],
      },
    },
    { new: true, runValidators: true }
  ).select("-_id fullName username");

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.UPDATE_FAILED,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
      data: user,
    })
  );
};

export const updateUserEmail: Controller = async (req, res) => {
  const { currentEmail, newEmail } = req.body;

  // What if current Email and new Email are same
  if (currentEmail === newEmail) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "New email must be different from the current email.",
    });
  }

  // Update User Email
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { email: newEmail, "lastModified.email": new Date() },
    { new: true, runValidators: true }
  ).select("-_id email username fullName");

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.UPDATE_FAILED,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
      data: user,
    })
  );
};

export const updateUserPassword: Controller = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // Check for required fields
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "New passwords must match.",
    });
  }

  // What if old Password and new Password are same
  if (oldPassword === newPassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "New password must be different from the old password.",
    });
  }

  // Get user details
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_FOUND,
    });
  }

  // Validate existing password
  const validatePassword = await user.isPasswordCorrect(oldPassword);

  if (!validatePassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.INCORRECT_PASSWORD,
    });
  }

  // Save new password
  user.password = newPassword;
  user.lastModified.password = new Date();
  await user.save();

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
    })
  );
};

export const toggleCreatorMode: Controller = async (req, res) => {
  // Toggle User's Creater Mode
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    [{ $set: { creatorMode: { $not: "$creatorMode" } } }],
    { new: true }
  ).select("-_id fullName username creatorMode");

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.UPDATE_FAILED,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
      data: user,
    })
  );
};
