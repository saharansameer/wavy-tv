import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { Types } from "mongoose";
import { cookiesOptions } from "../utils/constants.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/env.js";

async function generateTokens(userId: Types.ObjectId): Promise<TokenPayload> {
  try {
    // Find user by userId
    const user = await User.findById(userId);
    // Check If user document is valid
    if (!user) {
      throw new ApiError({
        status: HTTP_STATUS.NOT_FOUND,
        message: "User does not exist",
      });
    }

    // Genereate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update user's refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err: unknown) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message:
        err instanceof Error
          ? err.message
          : "Didn't recieved any error message",
    });
  }
}

export const registerUser: Controller = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  const trimmedFullName = trimAndClean(fullName);
  const trimmedUsername = trimAndClean(username);

  // Checks all fields exist
  if (!trimmedFullName || !trimmedUsername || !email || !password) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "All fields are required",
    });
  }

  // Create user
  const user = await User.create({
    fullName: trimmedFullName,
    username: trimmedUsername,
    email: email,
    password: password,
  });

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Unable to register new user",
    });
  }

  return res.status(200).json(
    new ApiResponse({
      status: HTTP_STATUS.CREATED,
      message: "User registered successfully",
      data: { _id: user._id, username: user.username, email },
    })
  );
};

export const loginUser: Controller = async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = trimAndClean(email);
  if (!trimmedEmail || !password) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({
    $or: [{ username: trimmedEmail }, { email: trimmedEmail }],
  });

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Invalid Email or Username",
    });
  }

  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Password is incorrect",
    });
  }

  const { accessToken, refreshToken } = await generateTokens(
    user._id as Types.ObjectId
  );

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: "User logged in successfully",
      })
    );

  return res.status(200);
};

export const logoutUser: Controller = async (req, res) => {
  // Get existing refreshToken from cookies
  const existingRefreshToken: string = req.cookies?.refreshToken;
  // Check if token exists
  if (!existingRefreshToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Refresh Token not found in cookies",
    });
  }

  // Verify existing refreshToken and return payload (i.e user's _id)
  const decodedToken = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);
  // Check if token is valid
  if (!decodedToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Refresh token is expired or invalid",
    });
  }

  // Find current logged-in user and clear refreshToken from DB
  const user = await User.findByIdAndUpdate(
    decodedToken._id,
    { refreshToken: "" },
    { new: true }
  );
  // Check If user updated successfully
  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.NOT_FOUND,
      message: "Unable to clear refreshToken or Inavlid user id",
    });
  }

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: "User logged out successfully",
      })
    );
};

export const renewTokens: Controller = async (req, res) => {
  // Get existing refresh token
  const existingRefreshToken = req.cookies?.refreshToken;
  if (!existingRefreshToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Refresh Token not found",
    });
  }

  // Validate Refresh Token
  const decodedToken = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);
  if (!decodedToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Refresh Token is expired or invalid",
    });
  }

  // Check if user is authenticated
  const user = await User.findOne({
    _id: decodedToken._id,
    refreshToken: existingRefreshToken,
  });
  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Please Login, User is not authenticated",
    });
  }

  // Generate New Tokens
  const { accessToken, refreshToken } = await generateTokens(
    user._id as Types.ObjectId
  );

  // Update User's refreshToken in DB
  user.refreshToken = refreshToken;
  await user.save();

  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: "New Access and Refresh Token generated successfully",
      })
    );
};
