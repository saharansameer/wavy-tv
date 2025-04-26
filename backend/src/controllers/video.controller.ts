import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean, extractTagsAndKeywords } from "../utils/stringUtils.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { generatePublicId } from "../utils/crypto.js";

export const getAllVideos: Controller = async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;

  // Aggregate Query
  const videoAggregateQuery = Video.aggregate([
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

  // Paginate Options
  const options = {
    page,
    limit,
  };

  // Paginated Response
  const paginatedVideos = await Video.aggregatePaginate(
    videoAggregateQuery,
    options
  );

  // What If aggregation pipeline or pagination fails
  if (paginatedVideos.totalDocs === 0) {
    throw new ApiError({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message:
        "Unable to retrieve videos, aggregation pipeline or pagination failure",
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VIDEO.FETCH_SUCCESS,
      data: paginatedVideos,
    })
  );
};

export const getVideoByPublicId: Controller = async (req, res) => {
  const { videoPublicId } = req.params;

  // Verify logged-in User and Extract user info
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);

  // Fetch video by publicId
  const video = await Video.aggregate([
    {
      $match: {
        publicId: videoPublicId,
        $or: [
          { publishStatus: { $in: ["PUBLIC", "UNLISTED"] } },
          { publishStatus: "PRIVATE", owner: userInfo?._id },
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
          {
            $project: {
              _id: 0,
              votedBy: 1,
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
          {
            $project: {
              _id: 0,
              votedBy: 1,
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
        currUserVoteType: {
          $cond: {
            if: { $in: [userInfo?._id, "$upvotes.votedBy"] },
            then: "UPVOTE",
            else: {
              $cond: {
                if: { $in: [userInfo?._id, "$downvotes.votedBy"] },
                then: "DOWNVOTE",
                else: null,
              },
            },
          },
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
  const { title, description, publishStatus, category } = req.body;

  // Remove extra spaces from title
  const trimmedTitle = trimAndClean(title || "");

  // Check all fields (i.e title, description, publishStatus) are provided
  if (!trimmedTitle || !description || !publishStatus || !category) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Extract relevant tags and keywords from Title and Description
  const tags = extractTagsAndKeywords(trimmedTitle, description);

  // Update Video Details (i.e title, description, publishStatus)
  const video = await Video.findOneAndUpdate(
    { publicId: videoPublicId, owner: req.user?._id },
    {
      title: trimmedTitle,
      description,
      publishStatus,
      category,
      tags,
    },
    { new: true, runValidators: true }
  ).select("publicId title description publishStatus category tags");

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

export const uploadVideo: Controller = async (req, res) => {
  const {
    title,
    description,
    video,
    thumbnail,
    publishStatus,
    category,
    nsfw,
  } = req.body;

  // Remove extra spaces from title
  const trimmedTitle = trimAndClean(title || "");

  // Check all fields (i.e title, description, publishStatus) are provided
  if (
    !trimmedTitle ||
    !video ||
    !thumbnail ||
    !publishStatus ||
    !category ||
    nsfw === undefined
  ) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Ectract Tags and Keywords from Title and Description
  const tags = extractTagsAndKeywords(title, description || "");

  // Create video document
  const createVideo = await Video.create({
    publicId: generatePublicId(),
    title: trimmedTitle,
    description: description || "",
    publishStatus,
    category,
    nsfw,
    videoFile: {
      url: video.url,
      asset_id: video.asset_id,
      duration: video.duration,
      height: video.height,
      width: video.width,
      frame_rate: video.frame_rate,
      format: video.format,
      bytes: video.bytes,
      bit_rate: video.bit_rate,
      is_audio: video.is_audio,
    },
    thumbnail: {
      url: thumbnail.url,
      asset_id: thumbnail.asset_id,
      format: thumbnail.format,
      bytes: thumbnail.bytes,
      height: thumbnail.height,
      width: thumbnail.width,
    },
    tags,
    owner: req?.user?._id,
  });

  if (!createVideo) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse({
      status: HTTP_STATUS.CREATED,
      message: RESPONSE_MESSAGE.VIDEO.CREATE_SUCCESS,
    })
  );
};
