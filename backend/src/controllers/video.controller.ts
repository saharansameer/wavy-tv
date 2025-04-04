import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { getLoggedInUserId } from "../utils/authUtils.js";

export const getAllVideos: Controller = async (_req, res) => {
  // Fetch videos including owner details
  const videos = await Video.aggregate([
    {
      $match: {
        publishStatus: "PUBLIC",
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
              _id: 0,
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
  ]);

  if (videos.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message:
        "Unable to retrieve videos, aggregation pipeline failure or internal server error",
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VIDEO.FETCH_SUCCESS,
      data: videos,
    })
  );
};

export const getVideoByPublicId: Controller = async (req, res) => {
  const { videoPublicId } = req.params;

  // Verify logged-in User and Extract user ID
  const userId = getLoggedInUserId(req?.cookies?.refreshToken);

  // Fetch video by publicId
  const video = await Video.aggregate([
    {
      $match: {
        publicId: videoPublicId,
        $or: [
          { publishStatus: { $in: ["PUBLIC", "UNLISTED"] } },
          { publishStatus: "PRIVATE", owner: userId },
        ],
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
              _id: 0,
              publicId: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "video",
        as: "upvotes",
        pipeline: [
          {
            $match: {
              vote: "UPVOTE",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "video",
        as: "downvotes",
        pipeline: [
          {
            $match: {
              vote: "DOWNVOTE",
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
        upvotes: {
          $size: "$upvotes",
        },
        downvotes: {
          $size: "$downvotes",
        },
      },
    },
  ]);

  // What If video is private or publicId is invalid
  if (video.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VIDEO.FETCH_SUCCESS,
      data: video,
    })
  );
};

export const updateVideoDetails: Controller = async (req, res) => {
  const { videoPublicId } = req.params;
  const { title, description, publishStatus } = req.body;

  // Remove extra spaces from title
  const trimmedTitle = trimAndClean(title || "");

  // Check all fields (i.e title, description, publishStatus) are provided
  if (!trimmedTitle || !description || !publishStatus) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Update Video Details (i.e title, description, publishStatus)
  const video = await Video.findOneAndUpdate(
    { publicId: videoPublicId, owner: req.user?._id },
    { title: trimmedTitle, description, publishStatus },
    { new: true, runValidators: true }
  ).select("publicId title description publishStatus");

  if (!video) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VIDEO.UPDATE_SUCCESS,
      data: video,
    })
  );
};

export const deleteVideo: Controller = async (req, res) => {
  const { videoPublicId } = req.params;

  // Video Deletion
  const video = await Video.findOneAndDelete({
    publicId: videoPublicId,
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VIDEO.DELETE_SUCCESS,
    })
  );
};
