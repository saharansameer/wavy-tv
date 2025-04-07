import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { excludedTags } from "../utils/constants.js";

const extractTagsAndKeywords = (title: string, description: string) => {
  const tagsSet = new Set<string>(); // To store unique tags

  // Convert to lowercase and remove non-alphanumerics
  const cleanWord = (word: string) => {
    return word.toLowerCase().replace(/[^\w]/g, "");
  };

  // Extract tags from title
  title.split(" ").forEach((word: string) => {
    const tag = cleanWord(word);

    if (tag && !excludedTags.includes(tag)) {
      tagsSet.add(tag); // Add cleaned tag if not excluded
    }
  });

  // Extract max 5 hashtags from description (if any)
  if (description !== undefined) {
    description
      .split(" ")
      .filter((word: string) => word.startsWith("#")) // Only hashtags
      .slice(0, 5) // Limit to first 5
      .map((word: string) => cleanWord(word)) // Clean them
      .forEach((tag: string) => {
        if (tag && !excludedTags.includes(tag)) {
          tagsSet.add(tag); // Add cleaned hashtag if not excluded
        }
      });
  }

  // Return array of unique and cleaned tags
  return Array.from(tagsSet);
};

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
          { publishStatus: "PRIVATE", owner: userInfo._id },
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
            if: { $in: [userInfo._id, "$upvotes.votedBy"] },
            then: "UPVOTE",
            else: {
              $cond: {
                if: { $in: [userInfo._id, "$downvotes.votedBy"] },
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

  // Extract relevant tags and keywords from Title and Description
  const tags = extractTagsAndKeywords(trimmedTitle, description);

  // Update Video Details (i.e title, description, publishStatus)
  const video = await Video.findOneAndUpdate(
    { publicId: videoPublicId, owner: req.user?._id },
    {
      title: trimmedTitle,
      description,
      publishStatus,
      tags,
    },
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
