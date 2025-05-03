import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { extractTagsAndKeywords } from "../utils/stringUtils.js";
import { unpackUserData } from "../utils/authUtils.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { Types } from "mongoose";

export const getUserByUsername: Controller = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED,
    });
  }

  // Verify logged-in User and Extract user info
  let userObjectId = null;
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);
  if (userInfo?._id && Types.ObjectId.isValid(userInfo._id)) {
    userObjectId = new Types.ObjectId(String(userInfo._id));
  }

  // Find user by username
  const user = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "channel",
        as: "followers",
        pipeline: [
          {
            $project: {
              _id: 0,
              follower: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
        pipeline: [
          {
            $project: {
              _id: 0,
              channel: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        followers: {
          $size: "$followers",
        },
        following: {
          $size: "$following",
        },
        isOwnProfile: {
          $cond: {
            if: { $eq: [userObjectId, "$_id"] },
            then: true,
            else: false,
          },
        },
        isFollower: {
          $cond: {
            if: { $in: [userObjectId, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        about: 1,
        avatar: 1,
        coverImage: 1,
        followers: 1,
        following: 1,
        isOwnProfile: 1,
        isFollower: 1,
      },
    },
  ]);

  if (user.length === 0) {
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
      data: user[0],
    })
  );
};

export const getCurrentUser: Controller = async (req, res) => {
  // Get User Details
  const user = await User.findById(req.user?._id).select(
    "-_id -password -refreshToken"
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
      data: unpackUserData(user),
    })
  );
};

export const updateUserInfo: Controller = async (req, res) => {
  // User new details (i.e fullName and username)
  const { fullName, username, about } = req.body;

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
        about: about || "",
        "tags.0": trimmedFullName,
        "tags.1": trimmedUsername,
      },
    },
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
      data: {
        fullName: user.fullName,
        username: user.username,
        about: user.about,
      },
    })
  );
};

export const updateUserEmail: Controller = async (req, res) => {
  const { currEmail, newEmail, password } = req.body;

  // Check for required fields
  if (!currEmail || !newEmail || !password) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // What if current Email and new Email are same
  if (currEmail === newEmail) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "New email must be different from the current email.",
    });
  }

  // Find User
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_AUTHORIZED,
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

  // Update User Email
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { email: newEmail, "lastModified.email": new Date() },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.USER.UPDATE_SUCCESS,
      data: unpackUserData(updatedUser),
    })
  );
};

export const updateUserPassword: Controller = async (req, res) => {
  const { currPassword, newPassword, confirmNewPassword } = req.body;

  // Check for required fields
  if (!currPassword || !newPassword || !confirmNewPassword) {
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
  if (currPassword === newPassword) {
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
  const validatePassword = await user.isPasswordCorrect(currPassword);

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
    { new: true, runValidators: true }
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

export const updateUserPreferences: Controller = async (req, res) => {
  const { theme, nsfwContent, publishStatus, category } = req.body;

  // Check If recieved all preferences in req body
  if (!theme || !nsfwContent || !publishStatus || !category) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Update User's preferences
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      preferences: {
        theme,
        nsfwContent,
        publishStatus,
        category,
      },
    },
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
      data: unpackUserData(user),
    })
  );
};

export const toggleSearchAndWatchHistory: Controller = async (req, res) => {
  const { saveSearchHistory, saveWatchHistory } = req.body;

  // Toggle User's Search and Watch History
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      "preferences.saveSearchHistory": saveSearchHistory,
      "preferences.saveWatchHistory": saveWatchHistory,
    },
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
      data: unpackUserData(user),
    })
  );
};

export const updateUserAbout: Controller = async (req, res) => {
  const { about } = req.body;
  // Remove extra spaces
  const trimmedAbout = trimAndClean(about || "");

  // Check if about field exist in
  if (!trimmedAbout) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Extract relevant tags and keywords from About
  const extTags = extractTagsAndKeywords(about, "");
  console.log(extTags);
  // Update User's about (bio)
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { about: trimmedAbout, $push: { tags: { $each: extTags } } },
    { new: true, runValidators: true }
  ).select("-_id fullName username about");

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
