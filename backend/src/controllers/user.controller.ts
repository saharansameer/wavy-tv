import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";

export const getCurrentUser: Controller = async (req, res) => {
  // Ensure TypeScript recognizes req.user as defined
  req.user = req.user as Required<typeof req.user>;

  // Get User Details
  const user = await User.findById(req.user?._id).select(
    "fullName username email createrMode"
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
  // Ensure TypeScript recognizes req.user as defined
  req.user = req.user as Required<typeof req.user>;

  // User new details (i.e fullName and username)
  const { fullName, username } = req.body;
  // Remove Extra Spaces
  const trimmedFullName = trimAndClean(fullName);
  const trimmedUsername = trimAndClean(username);
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
    { $set: { fullName: trimmedFullName, username: trimmedUsername } },
    { new: true, runValidators: true }
  );

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
    })
  );
};

export const updateUserEmail: Controller = async (req, res) => {
  // Ensure TypeScript recognizes req.user as defined
  req.user = req.user as Required<typeof req.user>;

  const { email } = req.body;

  // Update User Email
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { email },
    { new: true, runValidators: true }
  ).select("email");

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
  // Ensure TypeScript recognizes req.user as defined
  req.user = req.user as Required<typeof req.user>;

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
  await user.save();

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
    })
  );
};

export const toggleCreaterMode: Controller = async (req, res) => {
  // Ensure TypeScript recognizes req.user as defined
  req.user = req.user as Required<typeof req.user>;

  // Toggle User's Creater Mode
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    [{ $set: { createrMode: { $not: "$createrMode" } } }],
    { new: true }
  ).select("username createrMode");

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
