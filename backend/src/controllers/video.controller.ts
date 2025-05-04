import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean, extractTagsAndKeywords } from "../utils/stringUtils.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { generatePublicId } from "../utils/crypto.js";
import { destroyAssetFromCloudinary } from "../services/cloudinary.js";
import { Types } from "mongoose";

export const getAllVideos: Controller = async (req, res) => {
  const page = (req.query.page as string) || "1";
  const limit = (req.query.limit as string) || "12";

  // Get optional username filter
  const username = (req.query.username as string) || null;

  // Default match stage
  let matchStage;
  matchStage = { publishStatus: "PUBLIC" };

  if (username) {
    // Ensure user exists
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError({
        status: HTTP_STATUS.BAD_REQUEST,
        message: RESPONSE_MESSAGE.USER.NOT_FOUND,
      });
    }
    // Update match stage
    matchStage = {
      publishStatus: "PUBLIC",
      owner: new Types.ObjectId(String(user._id)),
    };
  }

  // Aggregate Query
  const videoAggregateQuery = Video.aggregate([
    {
      $match: matchStage,
    },
    {
      $sort: { createdAt: -1 },
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
    page: Number(page),
    limit: Number(limit),
  };

  // Paginated Response
  const paginatedVideos = await Video.aggregatePaginate(
    videoAggregateQuery,
    options
  );

  // Validate Page Number
  if (paginatedVideos.page! > paginatedVideos.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
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
  let userObjectId = null;
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);
  if (userInfo?._id && Types.ObjectId.isValid(userInfo._id)) {
    userObjectId = new Types.ObjectId(String(userInfo._id));
  }

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
            if: {
              $in: [userObjectId, "$upvotes.votedBy"],
            },
            then: "UPVOTE",
            else: {
              $cond: {
                if: {
                  $in: [userObjectId, "$downvotes.votedBy"],
                },
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

  // Increment Video View
  await Video.findByIdAndUpdate(
    video[0]._id,
    { $inc: { views: 1 } },
    { new: true }
  );

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
  const { title, description, thumbnail, publishStatus, category, nsfw } =
    req.body;

  // Remove extra spaces from title
  const trimmedTitle = trimAndClean(title || "");

  // Check all fields (i.e title, description, publishStatus) are provided
  if (!trimmedTitle || !publishStatus || !category || nsfw === undefined) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Extract relevant tags and keywords from Title and Description
  const tags = extractTagsAndKeywords(trimmedTitle, description);

  // New Details of Video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newDetails: Record<string, any> = {
    title: trimmedTitle,
    description: description || "",
    publishStatus,
    category,
    tags,
    nsfw,
  };

  // Add new thumbnail details (if recieved any)
  if (thumbnail) {
    newDetails.thumbnail = {
      url: thumbnail.secure_url,
      public_id: thumbnail.public_id,
      format: thumbnail.format,
      bytes: thumbnail.bytes,
      height: thumbnail.height,
      width: thumbnail.width,
    };

    /* User provided thumbnail in new details, 
    So delete the old thumbnail from cloud */
    const existingVideo = await Video.findOne({
      publicId: videoPublicId,
      owner: req.user?._id,
    });
    destroyAssetFromCloudinary(
      existingVideo?.thumbnail.public_id as string,
      "image"
    );
  }

  // Update Video Details in Database
  const video = await Video.findOneAndUpdate(
    { publicId: videoPublicId, owner: req.user?._id },
    {
      ...newDetails,
    },
    { new: true, runValidators: true }
  );

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
    })
  );
};

export const deleteVideo: Controller = async (req, res) => {
  const { videoPublicId } = req.params;

  // Video Deletion
  const video = await Video.findOne({
    publicId: videoPublicId,
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Delete Video and Thumbnail from cloudinary
  const destroyVideo = await destroyAssetFromCloudinary(
    video.videoFile.public_id,
    "video"
  );
  const destroyThumbnail = await destroyAssetFromCloudinary(
    video.thumbnail.public_id,
    "image"
  );

  if (!destroyVideo && !destroyThumbnail) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Unable to destroy assets from Cloudinary",
    });
  }

  // Delete video document from DB
  await Video.findByIdAndDelete(video._id);

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
      url: video.secure_url,
      public_id: video.public_id,
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
      url: thumbnail.secure_url,
      public_id: thumbnail.public_id,
      format: thumbnail.format,
      bytes: thumbnail.bytes,
      height: thumbnail.height,
      width: thumbnail.width,
    },
    tags,
    owner: req?.user?._id,
  });

  // If any error occurs while creating video document
  if (!createVideo) {
    // Delete Video and Thumbnail from cloudinary
    await destroyAssetFromCloudinary(video.public_id, "video");
    await destroyAssetFromCloudinary(thumbnail.public_id, "image");

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
