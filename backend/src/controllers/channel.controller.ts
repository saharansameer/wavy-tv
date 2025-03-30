import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { getLoggedInUserId } from "../utils/authUtils.js";

export const getChannelProfile: Controller = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }
  
  // Verify logged-in User and Extract user ID
  const userId = getLoggedInUserId(req?.cookies?.refreshToken);

  // Fetch User's Channel Profile
  const channelProfile = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
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
        followersCount: {
          $size: "$followers",
        },
        followingCount: {
          $size: "$following",
        },
        isSelf: {
          $cond: {
            if: { $eq: ["$_id", userId] },
            then: true,
            else: false,
          },
        },
        isFollower: {
          $cond: {
            if: { $in: [userId, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        creatorMode: 1,
        followersCount: 1,
        followingCount: 1,
        isSelf: 1,
        isFollower: 1,
      },
    },
  ]);

  // What If no channel (i.e User) exist with that username
  if (channelProfile.length === 0) {
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
      data: channelProfile,
    })
  );
};
