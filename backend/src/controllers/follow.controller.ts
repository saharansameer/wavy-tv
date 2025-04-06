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
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;
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

  // Aggregate Query
  const followersAggregateQuery = Follow.aggregate([
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

  // Paginate Options
  const options = {
    page,
    limit,
  };

  // Paginated Response
  const paginatedFollowers = await Follow.aggregatePaginate(
    followersAggregateQuery,
    options
  );

  // Validate Page Number
  if (paginatedFollowers.page! > paginatedFollowers.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.NOT_FOUND,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.FOLLOW.FOLLOWER_FETCH_SUCCESS,
      data: paginatedFollowers,
    })
  );
};

export const getFollowing: Controller = async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;
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

  // Aggregate Query
  const followingAggregateQuery = Follow.aggregate([
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

  // Paginate Options
  const options = {
    page,
    limit,
  };

  // Following Paginated Response
  const paginatedFollowing = await Follow.aggregatePaginate(
    followingAggregateQuery,
    options
  );

  // Validate Page Number
  if (paginatedFollowing.page! > paginatedFollowing.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.NOT_FOUND,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.FOLLOW.FOLLOWING_FETCH_SUCCESS,
      data: paginatedFollowing,
    })
  );
};
