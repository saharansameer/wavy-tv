import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { History } from "../models/history.model.js";
import { Types } from "mongoose";

export const getWatchHistory: Controller = async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;

  // Aggregate Query
  const watchHistoryAggregateQuery = History.aggregate([
    {
      $match: {
        user: req?.user?._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $project: {
              videoFile: 0,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  // Paginate Options
  const options = {
    page,
    limit,
  };

  // Paginated Result
  const watchHistoryPaginatedResult = await History.aggregatePaginate(
    watchHistoryAggregateQuery,
    options
  );

  if (
    watchHistoryPaginatedResult.page! > watchHistoryPaginatedResult.totalPages
  ) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.HISTORY.FETCH_SUCCESS,
      data: watchHistoryPaginatedResult,
    })
  );
};

export const deleteWatchHistory: Controller = async (req, res) => {
  // type RangeType = 0 | 1 | 24 | 168 | 720 | 2160
  const range = Number(req.query.range as string) || 1;

  // Check for valid query params
  if (!range) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?range=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Delete lifetime Watch History
  if (range === 0) {
    const deleteAllWatchHistory = await History.deleteMany({
      user: req?.user?._id,
    });

    if (!deleteAllWatchHistory) {
      throw new ApiError({
        status: HTTP_STATUS.BAD_REQUEST,
        message: RESPONSE_MESSAGE.HISTORY.DELETE_FAILURE,
      });
    }

    // Response - Deleted All Watch History
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.HISTORY.DELETE_SUCCESS,
      })
    );
  }

  // Delete Watch History by time range
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - range * 60 * 60 * 1000);

  const deleteWatchHistory = await History.deleteMany({
    user: req?.user?._id,
    createdAt: cutoffDate,
  });

  if (!deleteWatchHistory) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.HISTORY.DELETE_FAILURE,
    });
  }

  // Response - Deleted Watch History by time range
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.HISTORY.DELETE_SUCCESS,
    })
  );
};

export const addVideoToWatchHistory: Controller = async (req, res) => {
  const videoId = req.query.videoId as string;

  // Check for valid query params
  if (!videoId) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?videoId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Delete older video log from Watch History
  await History.deleteOne({ user: req?.user?._id, video: videoId });

  // Add video log to Watch History
  const toWatchHistory = await History.create({
    user: req?.user?._id,
    video: videoId,
  });

  if (!toWatchHistory) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.HISTORY.VIDEO_ADD_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.HISTORY.VIDEO_ADD_SUCCESS,
    })
  );
};

export const removeVideoFromWatchHistory: Controller = async (req, res) => {
  const { videos }: { videos: Types.ObjectId[] } = req.body;

  // Check for valid query params
  if (videos.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?videoId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Remove Videos from Watch History
  const fromWatchHistory = await History.deleteMany({
    user: req?.user?._id,
    video: { $in: videos },
  });

  if (!fromWatchHistory) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.HISTORY.VIDEO_REMOVE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.HISTORY.VIDEO_REMOVE_SUCCESS,
    })
  );
};
