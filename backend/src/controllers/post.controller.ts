import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { generatePublicId } from "../utils/crypto.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { Types } from "mongoose";

export const createPost: Controller = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Create Post
  const post = await Post.create({
    publicId: generatePublicId(),
    content: content,
    owner: req?.user?._id,
  });

  if (!post) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.POST.CREATE_SUCCESS,
      data: { publicId: post.publicId, content: post.content },
    })
  );
};

export const updatePost: Controller = async (req, res) => {
  const { postPublicId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Find and Update Post
  const post = await Post.findOneAndUpdate(
    {
      publicId: postPublicId,
      owner: req?.user?._id,
    },
    { content: content },
    { new: true, runValidators: true }
  ).select("-_id -owner");

  if (!post) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.POST.UPDATE_SUCCESS,
      data: post,
    })
  );
};

export const deletePost: Controller = async (req, res) => {
  const { postPublicId } = req.params;

  // Find and Delete Post
  const post = await Post.findOneAndDelete({
    publicId: postPublicId,
    owner: req?.user?._id,
  });

  if (!post) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.POST.DELETE_SUCCESS,
    })
  );
};

export const getPostByPublicId: Controller = async (req, res) => {
  const { postPublicId } = req.params;

  // Verify logged-in User and Extract user info
  let userObjectId = null;
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);
  if (userInfo?._id && Types.ObjectId.isValid(userInfo._id)) {
    userObjectId = new Types.ObjectId(String(userInfo._id));
  }

  // Find Post and Owner Details
  const post = await Post.aggregate([
    {
      $match: {
        publicId: postPublicId,
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
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "post",
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
        foreignField: "post",
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

  // What If post does not exist
  if (post.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.POST.FETCH_SUCCESS,
      data: post,
    })
  );
};

export const getAllPosts: Controller = async (req, res) => {
  const page = (req.query.page as string) || "1";
  const limit = (req.query.limit as string) || "12";

  // Get optional username filter
  const username = (req.query.username as string) || null;

  // Default match stage
  let matchStage;
  matchStage = {};

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
      owner: new Types.ObjectId(String(user._id)),
    };
  }

  // Verify logged-in User and Extract user info
  let userObjectId = null;
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);
  if (userInfo?._id && Types.ObjectId.isValid(userInfo._id)) {
    userObjectId = new Types.ObjectId(String(userInfo._id));
  }

  // Aggregate Query
  const postAggregateQuery = Post.aggregate([
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
        foreignField: "post",
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
        foreignField: "post",
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

  // Paginate Options
  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  // Paginated Response
  const paginatedPosts = await Post.aggregatePaginate(
    postAggregateQuery,
    options
  );

  // Validate Page Number
  if (paginatedPosts.page! > paginatedPosts.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.POST.FETCH_SUCCESS,
      data: paginatedPosts,
    })
  );
};
