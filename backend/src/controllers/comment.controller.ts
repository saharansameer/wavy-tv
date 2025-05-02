import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { Types } from "mongoose";
import { getLoggedInUserInfo } from "../utils/authUtils.js";

export const addCommentOnVideo: Controller = async (req, res) => {
  const videoPublicId = req.query.videoPublicId as string;
  const { content } = req.body;

  // Check for valid query params
  if (!videoPublicId) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?videoPublicId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find Video by publicId
  const video = await Video.findOne({
    publicId: videoPublicId,
    $or: [
      { publishStatus: { $in: ["PUBLIC", "UNLISTED"] } },
      {
        publishStatus: "PRIVATE",
        owner: req?.user?._id,
      },
    ],
  });

  // What If video is private or does not exist
  if (!video) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Create Comment for Video
  const comment = await Comment.create({
    content: content,
    owner: req?.user?._id,
    video: video._id,
  });

  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_SUCCESS,
      data: { content: comment.content },
    })
  );
};

export const addCommentOnPost: Controller = async (req, res) => {
  const postPublicId = req.query.postPublicId as string;
  const { content } = req.body;

  // Check for valid query params
  if (!postPublicId) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?postPublicId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Find Post by publicId
  const post = await Post.findOne({ publicId: postPublicId });

  // What If post does not exist
  if (!post) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Create Comment for Post
  const comment = await Comment.create({
    content: content,
    owner: req?.user?._id,
    post: post._id,
  });

  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_SUCCESS,
      data: { content: comment.content },
    })
  );
};

export const addReplyComment: Controller = async (req, res) => {
  /* commentPublicId - It is not publicId, it is mongodb's ObjectId, 
  Adjusted names with frontend convention (only for comment) */
  const commentPublicId = req.query.commentPublicId as string;
  const { content } = req.body;

  // Check for valid query params
  if (!commentPublicId) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?commentPublicId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Comment Id
  const commentId = commentPublicId;

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Fetch Comment by id
  const comment = await Comment.findById(commentId);

  // What If Comment does not exist
  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.NOT_FOUND,
    });
  }

  // Create Reply comment for Comment
  const replyComment = await Comment.create({
    content: content,
    owner: req?.user?._id,
    parentComment: commentId,
  });

  if (!replyComment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.CREATE_SUCCESS,
      data: { content: replyComment.content },
    })
  );
};

export const updateCommentById: Controller = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Update Comment Content
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req?.user?._id },
    { content: content },
    { new: true, runValidators: true }
  );

  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.UPDATE_SUCCESS,
      data: { content: comment.content },
    })
  );
};

export const deleteCommentById: Controller = async (req, res) => {
  const { commentId } = req.params;

  // Delete Comment
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req?.user?._id,
  });

  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.DELETE_SUCCESS,
    })
  );
};

export const getEntityComments: Controller = async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;

  // The term "entity" refers to 'video' or 'post'
  const entity = req.query.entity as string;
  const entityId = req.query.entityId as string;

  // Check for valid query params
  if (!entityId || !entity) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?entity=<>&entityId=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Check for invalid entity type
  if (!["video", "post"].includes(entity)) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message:
        "Inavlid Entity Type, Valid Types are: [video, post, parentComment]",
    });
  }

  // Verify logged-in User and Extract user info
  let userObjectId = null;
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);
  if (userInfo?._id && Types.ObjectId.isValid(userInfo._id)) {
    userObjectId = new Types.ObjectId(String(userInfo._id));
  }

  // Aggregate Query
  const commentsAggregateQuery = Comment.aggregate([
    {
      $match: {
        [entity]: new Types.ObjectId(String(entityId)),
      },
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
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "comment",
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
        foreignField: "comment",
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
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "parentComment",
        as: "replies",
        pipeline: [
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
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        currUserVoteType: {
          $cond: {
            if: { $in: [userObjectId, "$upvotes.votedBy"] },
            then: "UPVOTE",
            else: {
              $cond: {
                if: { $in: [userObjectId, "$downvotes.votedBy"] },
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
        hasReplies: { $gt: [{ $size: "$replies" }, 0] },
      },
    },
  ]);

  // Paginate Options
  const options = {
    page,
    limit,
  };

  // Paginated Response
  const paginatedComments = await Comment.aggregatePaginate(
    commentsAggregateQuery,
    options
  );

  // Validate Page Number
  if (paginatedComments.page! > paginatedComments.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.COMMENT.FETCH_SUCCESS,
      data: paginatedComments,
    })
  );
};
