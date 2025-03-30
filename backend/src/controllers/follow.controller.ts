import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";

export const toggleFollow: Controller = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find channel (i.e User) with the given username
  const channel = await User.findOne({ username });

  // What If no creator exist with that username
  if (!channel) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_FOUND,
    });
  }

  // User is already a follower, So Unfollow
  const unfollow = await Follow.findOneAndDelete({
    channel: channel._id,
    follower: req.user?._id,
  });

  // Response Unfollow
  if (unfollow) {
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.FOLLOW.UNFOLLOWED,
      })
    );
  }

  // User is not a follower, So Follow
  const follow = await Follow.create({
    channel: channel._id,
    follower: req.user?._id,
  });

  if (!follow) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.FOLLOW.TOGGLE_FAILURE,
    });
  }

  // Response Followed
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.FOLLOW.FOLLOWING,
    })
  );
};

export const getFollowers: Controller = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find channel (i.e User) with the given username
  const channel = await User.findOne({ username });

  if (!channel) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_FOUND,
    });
  }

  // Get followers
  const followers = await Follow.aggregate([
    {
      $match: {
        channel: channel?._id,
      },
    },
    {
      $project: {
        _id: 0,
        channel: 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "follower",
        foreignField: "_id",
        as: "follower",
        pipeline: [
          {
            $project: {
              _id: 0,
              fullName: 1,
              username: 1,
              avatar: 1,
              creatorMode: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        follower: {
          $first: "$follower",
        },
      },
    },
  ]);

  // What If channel (i.e User) has no followers
  if (followers.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.FOLLOW.ZERO_FOLLOWER,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.FOLLOW.FOLLOWER_FETCH_SUCCESS,
      data: followers,
    })
  );
};

export const getFollowing: Controller = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find channel (i.e User) with the given username
  const channel = await User.findOne({ username });

  if (!channel) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.USER.NOT_FOUND,
    });
  }

  // Get Following
  const following = await Follow.aggregate([
    {
      $match: {
        follower: channel?._id,
      },
    },
    {
      $project: {
        _id: 0,
        follower: 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              _id: 0,
              fullName: 1,
              username: 1,
              avatar: 1,
              creatorMode: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
  ]);

  // What If user has not followed anyone
  if (following.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.FOLLOW.ZERO_FOLLOWING,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.FOLLOW.FOLLOWING_FETCH_SUCCESS,
      data: following,
    })
  );
};
