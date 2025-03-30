import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { trimAndClean } from "../utils/stringUtils.js";
import { generatePublicId } from "../utils/crypto.js";
import { getLoggedInUserId } from "../utils/authUtils.js";

export const createPlaylist: Controller = async (req, res) => {
  const { title, description, publishStatus } = req.body;

  // Removes Extra Spaces from title and description
  const trimmedTitle = trimAndClean(title || "");
  const trimmedDescription = trimAndClean(description || "");

  // Check for all required fields exist
  if (!trimmedTitle || !publishStatus) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Create new playlist
  const playlist = await Playlist.create({
    publicId: generatePublicId(),
    title: trimmedTitle,
    description: trimmedDescription,
    owner: req?.user?._id,
    publishStatus,
  });

  if (!playlist) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.CREATE_FAILURE,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.CREATE_SUCCESS,
      data: {
        publicId: playlist.publicId,
        title: playlist.title,
        publishStatus: playlist.publishStatus,
      },
    })
  );
};

export const getPlaylistByPublicId: Controller = async (req, res) => {
  const { playlistPublicId } = req.params;

  // Verify logged-in User and Extract user ID
  const userId = getLoggedInUserId(req?.cookies?.refreshToken);

  // Find playlist by publicId
  const playlist = await Playlist.aggregate([
    {
      $match: {
        publicId: playlistPublicId,
        $or: [
          { publishStatus: { $in: ["PUBLIC", "UNLISTED"] } },
          {
            publishStatus: "PRIVATE",
            owner: userId,
          },
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

  // What If playlist is private or does not exist
  if (playlist.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.FETCH_SUCCESS,
      data: playlist,
    })
  );
};

export const updatePlaylistDetails: Controller = async (req, res) => {
  const { playlistPublicId } = req.params;
  const { title, description, publishStatus } = req.body;

  // Remove Extra space from title and description
  const trimmedTitle = trimAndClean(title || "");
  const trimmedDescription = trimAndClean(description || "");

  // Check for all required fields exist
  if (!trimmedTitle || !publishStatus) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COMMON.ALL_REQUIRED_FIELDS,
    });
  }

  // Update playlist details
  const playlist = await Playlist.findOneAndUpdate(
    { publicId: playlistPublicId, owner: req?.user?._id },
    { title: trimmedTitle, description: trimmedDescription, publishStatus },
    { new: true, runValidators: true }
  ).select("-_id publicId title publishStatus");

  if (!playlist) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.UPDATE_SUCCESS,
      data: playlist,
    })
  );
};

export const addVideoToPlaylist: Controller = async (req, res) => {
  const { playlistPublicId } = req.params;
  const { videos }: { videos: string[] } = req.body;

  if (videos.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `videos: ${RESPONSE_MESSAGE.COMMON.REQ_NOT_FOUND}`,
    });
  }

  // Add video to playlist
  const playlist = await Playlist.findOneAndUpdate(
    {
      publicId: playlistPublicId,
      owner: req?.user?._id,
    },
    {
      $push: { videos: { $each: videos } },
    },
    { new: true, runValidators: true }
  ).select("-_id publicId videos");

  if (!playlist) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.UPDATE_SUCCESS,
      data: playlist,
    })
  );
};

export const removeVideoFromPlaylist: Controller = async (req, res) => {
  const { playlistPublicId } = req.params;
  const { videos }: { videos: string[] } = req.body;

  if (videos.length === 0) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `videos: ${RESPONSE_MESSAGE.COMMON.REQ_NOT_FOUND}`,
    });
  }

  // Remove Video from playlist
  const playlist = await Playlist.findOneAndUpdate(
    { publicId: playlistPublicId, owner: req?.user?._id },
    { $pull: { videos: { $in: videos } } },
    { new: true, runValidators: true }
  ).select("-_id publicId videos");

  if (!playlist) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.UPDATE_SUCCESS,
      data: playlist,
    })
  );
};

export const deletePlaylist: Controller = async (req, res) => {
  const { playlistPublicId } = req.params;

  // Delete Playlist
  const playlist = await Playlist.findOneAndDelete({
    publicId: playlistPublicId,
    owner: req?.user?._id,
  });

  if (!playlist) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PLAYLIST.NOT_FOUND,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.PLAYLIST.DELETE_SUCCESS,
    })
  );
};
