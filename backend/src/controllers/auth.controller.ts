import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { trimAndClean } from "../utils/stringUtils.js";
import {
  HTTP_STATUS,
  RESPONSE_MESSAGE,
  cookiesOptions,
} from "../utils/constants.js";
import { Types } from "mongoose";
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
        message: RESPONSE_MESSAGE.USER.NOT_FOUND,
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
      message: RESPONSE_MESSAGE.AUTH.SIGNUP_REQUIRED_FIELDS,
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
      message: RESPONSE_MESSAGE.AUTH.SIGNUP_FAILED,
    });
  }

  return res.status(200).json(
    new ApiResponse({
      status: HTTP_STATUS.CREATED,
      message: RESPONSE_MESSAGE.AUTH.SIGNUP_SUCCESS,
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
      message: RESPONSE_MESSAGE.AUTH.LOGIN_REQUIRED_FIELDS,
    });
  }

  const user = await User.findOne({
    $or: [{ username: trimmedEmail }, { email: trimmedEmail }],
  });

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.INVALID_LOGIN_CREDS,
    });
  }

  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.INCORRECT_PASSWORD,
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
        message: RESPONSE_MESSAGE.AUTH.LOGIN_SUCCESS,
      })
    );
};

export const logoutUser: Controller = async (req, res) => {
  // Get existing refreshToken from cookies
  const existingRefreshToken: string = req.cookies?.refreshToken;
  // Check if token exists
  if (!existingRefreshToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `refreshToken: ${RESPONSE_MESSAGE.COOKIES.NOT_FOUND}`,
    });
  }

  // Verify existing refreshToken and return payload (i.e user's _id)
  const decodedToken = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);
  // Check if token is valid
  if (!decodedToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COOKIES.REFRESH_TOKEN_EXPIRED,
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
      message: RESPONSE_MESSAGE.USER.UPDATE_FAILED,
    });
  }

  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.AUTH.LOGOUT_SUCCESS,
      })
    );
};

export const renewTokens: Controller = async (req, res) => {
  // Get existing refresh token
  const existingRefreshToken = req.cookies?.refreshToken;
  if (!existingRefreshToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `refreshToken: ${RESPONSE_MESSAGE.COOKIES.NOT_FOUND}`,
    });
  }

  // Validate Refresh Token
  const decodedToken = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);
  if (!decodedToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COOKIES.REFRESH_TOKEN_EXPIRED,
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
      message: RESPONSE_MESSAGE.AUTH.LOGIN_AGAIN,
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
        message: RESPONSE_MESSAGE.COOKIES.TOKEN_GENERATED,
      })
    );
};
