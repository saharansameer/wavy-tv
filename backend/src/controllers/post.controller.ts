import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Post } from "../models/post.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { generatePublicId } from "../utils/crypto.js";

export const createPost: Controller = async (req, res) => {
  const { content } = req.body;

  // Remove extra space and Check if content is valid
  const trimmedContent = trimAndClean(content || "");

  if (!trimmedContent) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Create Post
  const post = await Post.create({
    publicId: generatePublicId(),
    content: trimmedContent,
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

  // Remove extra space and Check if content is valid
  const trimmedContent = trimAndClean(content || "");

  if (!trimmedContent) {
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
    { content: trimmedContent },
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        _id: 0,
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
