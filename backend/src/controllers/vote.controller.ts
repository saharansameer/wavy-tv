import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Vote } from "../models/vote.model.js";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";

// Mini Toggle Services (Used in Services which are already being used in Controllers)

const addUpvote: ToggleEntityType = async (entity, entityId, userId, res) => {
  // "Entity" refers to video or post or comment

  const addUpvote = await Vote.create({
    votedBy: userId,
    [entity]: entityId,
    vote: "UPVOTE",
  });

  // Handle Edge Case Issues
  if (!addUpvote) {
    throw new ApiError({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.UPVOTE_FAILURE,
    });
  }

  // Response - Add Upvote
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.UPVOTE_SUCCESS,
    })
  );
};

const removeUpvote: VoteServiceType = async (entity, entityId, userId) => {
  // "Entity" refers to video or post or comment

  // If Entity is already Upvoted, So remove upvote
  const removeUpvote = await Vote.findOneAndDelete({
    votedBy: userId,
    [entity]: entityId,
    vote: "UPVOTE",
  });

  // Handle Edge Case Issues
  if (!removeUpvote) {
    return false;
  }

  return true;
};

const addDownvote: ToggleEntityType = async (entity, entityId, userId, res) => {
  // "Entity" refers to video or post or comment

  const addDownvote = await Vote.create({
    votedBy: userId,
    [entity]: entityId,
    vote: "DOWNVOTE",
  });

  // Handle Edge Case Issues
  if (!addDownvote) {
    throw new ApiError({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.DOWNVOTE_FAILURE,
    });
  }

  // Response - Add Downvote
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.DOWNVOTE_SUCCESS,
    })
  );
};

const removeDownvote: VoteServiceType = async (entity, entityId, userId) => {
  // "Entity" refers to video or post or comment

  // If Entity is already Downvoted, So remove downvote
  const removeDownvote = await Vote.findOneAndDelete({
    votedBy: userId,
    [entity]: entityId,
    vote: "DOWNVOTE",
  });

  // Handle Edge Case Issues
  if (!removeDownvote) {
    return false;
  }

  return true;
};

// Toggle Services (Used in Controllers)

const toggleEntityUpvote: ToggleEntityType = async (
  entity,
  entityId,
  userId,
  res
) => {
  // Remove a downvote if it exists
  const rmDownvote = await removeDownvote(entity, entityId, userId);

  // If a downvote was removed, attempt to add an upvote
  if (rmDownvote) {
    return await addUpvote(entity, entityId, userId, res);
  }

  // Remove Upvote if it exist
  const rmUpvote = await removeUpvote(entity, entityId, userId);

  // If Upvote dont exist
  if (!rmUpvote) {
    return await addUpvote(entity, entityId, userId, res);
  }

  // Response - Removed Upvote
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.REMOVE_UPVOTE_SUCCESS,
    })
  );
};

const toggleEntityDownvote: ToggleEntityType = async (
  entity,
  entityId,
  userId,
  res
) => {
  // Remove a upvote if it exists
  const rmUpvote = await removeUpvote(entity, entityId, userId);

  // If a upvote was removed, attempt to add a downvote
  if (rmUpvote) {
    return await addDownvote(entity, entityId, userId, res);
  }

  // Remove Downvote if it exist
  const rmDownvote = await removeDownvote(entity, entityId, userId);

  // If Downvote dont exist
  if (!rmDownvote) {
    return await addDownvote(entity, entityId, userId, res);
  }

  // Response - Removed Downvote
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.VOTES.REMOVE_DOWNVOTE_SUCCESS,
    })
  );
};

const validateQueryParams = (
  entity: string,
  entityPublicId: string | undefined,
  toggle: string | undefined
) => {
  // Check for both query params
  if (!entityPublicId || !toggle) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?${entity}PublicId=<>&toggle=<> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Check for Toggle Type
  if (!["UPVOTE", "DOWNVOTE"].includes(toggle)) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `${toggle} : Toggle Type is Invalid`,
    });
  }
};

// Controllers
export const toggleVideoVotes: Controller = async (req, res) => {
  const videoPublicId = req.query.videoPublicId as string;
  const toggle = req.query.toggle as string;

  // Validation Check for Query Params and Toggle Type
  validateQueryParams("video", videoPublicId, toggle);

  // Get video by public Id
  const video = await Video.findOne({
    publicId: videoPublicId,
    $or: [
      { publishStatus: { $in: ["PUBLIC, UNLISTED"] } },
      {
        publishStatus: "PRIVATE",
        owner: req?.user?._id,
      },
    ],
  });

  // What If video is private or do not exist
  if (!video) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.VIDEO.NOT_FOUND,
    });
  }

  // Final Response - According to Toggle Type
  if (toggle === "UPVOTE") {
    // Toggle Upvote and Send Response Accordingly
    return toggleEntityUpvote(
      "video",
      String(video?._id),
      String(req?.user?._id),
      res
    );
  } else {
    // if (toggle === "DOWNVOTE")
    // Toggle Downvote and Send Response Accordingly
    return toggleEntityDownvote(
      "video",
      String(video?._id),
      String(req?.user?._id),
      res
    );
  }
};

export const togglePostVotes: Controller = async (req, res) => {
  const postPublicId = req.query.postPublicId as string;
  const toggle = req.query.toggle as string;

  // Validation Check for Query Params and Toggle Type
  validateQueryParams("post", postPublicId, toggle);

  // Fetch Post by public Id
  const post = await Post.findOne({ publicId: postPublicId });

  // What If Post does not exist
  if (!post) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.POST.NOT_FOUND,
    });
  }

  // Final Response - According to Toggle Type
  if (toggle === "UPVOTE") {
    // Toggle Upvote and Send Response Accordingly
    return toggleEntityUpvote(
      "post",
      String(post?._id),
      String(req?.user?._id),
      res
    );
  } else {
    // if (toggle === "DOWNVOTE")
    // Toggle Downvote and Send Response Accordingly
    return toggleEntityDownvote(
      "post",
      String(post?._id),
      String(req?.user?._id),
      res
    );
  }
};

export const toggleCommentVotes: Controller = async (req, res) => {
  const commentPublicId = req.query.commentPublicId as string;
  const toggle = req.query.toggle as string;

  // Validation Check for Query Params and Toggle Type
  validateQueryParams("comment", commentPublicId, toggle);

  // Fetch Comment by public Id
  const comment = await Comment.findOne({ publicId: commentPublicId });

  // What If Comment does not exist
  if (!comment) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMENT.NOT_FOUND,
    });
  }

  // Final Response - According to Toggle Type
  if (toggle === "UPVOTE") {
    // Toggle Upvote and Send Response Accordingly
    return toggleEntityUpvote(
      "comment",
      String(comment?._id),
      String(req?.user?._id),
      res
    );
  } else {
    // if (toggle === "DOWNVOTE")
    // Toggle Downvote and Send Response Accordingly
    return toggleEntityDownvote(
      "comment",
      String(comment?._id),
      String(req?.user?._id),
      res
    );
  }
};
