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
import { Playlist } from "../models/playlist.model.js";
import { generatePublicId } from "../utils/crypto.js";

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
  const trimmedFullName = trimAndClean(fullName || "");
  const trimmedUsername = trimAndClean(username || "");

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

  // Create default playlists (Watch Later and Favourites)
  const watchLater = await Playlist.create({
    publicId: generatePublicId(),
    title: "Watch Later",
    owner: user._id,
    isSystemPlaylist: true,
  });

  const favourites = await Playlist.create({
    publicId: generatePublicId(),
    title: "Favourites",
    owner: user._id,
    isSystemPlaylist: true,
  });

  // Update User with playlist reference
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    {
      watchLater: watchLater._id,
      favourites: favourites._id,
    },
    { new: true, runValidators: true }
  );

  if (!updateUser) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.SIGNUP_FAILED,
    });
  }

  // Final Response
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

  if (!email || !password) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.LOGIN_REQUIRED_FIELDS,
    });
  }

  // Find user with the recieved email or username
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.INVALID_LOGIN_CREDS,
    });
  }

  // Check if password is correct
  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.AUTH.INCORRECT_PASSWORD,
    });
  }

  // Generate Tokens
  const { accessToken, refreshToken } = await generateTokens(
    user._id as Types.ObjectId
  );

  // Final Response
  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.AUTH.LOGIN_SUCCESS,
        data: {
          theme: user.preferences.theme,
          nsfwContent: user.preferences.nsfwContent,
          publishStatus: user.preferences.publishStatus,
          category: user.preferences.category,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
        },
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

  // Final Response
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
      status: HTTP_STATUS.NOT_FOUND,
      message: `refreshToken: ${RESPONSE_MESSAGE.COOKIES.NOT_FOUND}`,
    });
  }

  // Validate Refresh Token
  const decodedToken = jwt.verify(existingRefreshToken, REFRESH_TOKEN_SECRET);

  if (!decodedToken) {
    throw new ApiError({
      status: HTTP_STATUS.UNAUTHORIZED,
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
      status: HTTP_STATUS.UNAUTHORIZED,
      message: RESPONSE_MESSAGE.AUTH.LOGIN_AGAIN,
    });
  }

  // Generate New Tokens
  const { accessToken, refreshToken } = await generateTokens(
    user._id as Types.ObjectId
  );

  // Final Response
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

export const deleteTokensFromCookies: Controller = async (_req, res) => {
  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.COOKIES.DELETE_SUCCESS,
      })
    );
};

export const existingEmailAndUsername: Controller = async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find users with the given email and username
  const users = await User.find({
    $or: [{ email }, { username }],
  });

  // Response - No user found with the given email and username
  if (users.length === 0) {
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: "Username and Email both are available",
        data: {
          email: true,
          username: true,
        },
      })
    );
  }

  // Edge case very rare scenario
  if (users.length === 2) {
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: "Both username and email are already taken",
        data: {
          email: false,
          username: false,
        },
      })
    );
  }

  // Final Response - User exist with the given Email or Username
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: "User already exist with the given Email or Username",
      data: {
        email: users[0].email !== email,
        username: users[0].username !== username,
      },
    })
  );
};
