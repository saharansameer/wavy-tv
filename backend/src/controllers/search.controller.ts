import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import { getCorrectSearchQuery } from "../services/fuse.js";
import { getLoggedInUserInfo } from "../utils/authUtils.js";
import { SearchUtility } from "../types/search.js";

const getSearchResultForVideo: SearchUtility = async (
  searchQuery,
  userInfo,
  options,
  res
) => {
  // Video Match Stage
  const videoMatchStage: Record<string, unknown> = {
    $text: { $search: searchQuery },
    publishStatus: "PUBLIC",
  };

  if (userInfo?.preferences.nsfwContent === "HIDE") {
    videoMatchStage.nsfw = false;
  }

  // Video Aggregate Query
  const videoAggregateQuery = Video.aggregate([
    {
      $match: videoMatchStage,
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
  ]);

  // Video Paginated Result
  const videoPaginatedResult = await Video.aggregatePaginate(
    videoAggregateQuery,
    options
  );

  if (videoPaginatedResult.page! > videoPaginatedResult.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.SEARCH.FETCH_SUCCESS,
      data: videoPaginatedResult,
    })
  );
};

const getSearchResultForChannel: SearchUtility = async (
  searchQuery,
  userInfo,
  options,
  res
) => {
  // Channel Match Stage
  const channelMatchStage: Record<string, unknown> = {
    $text: { $search: searchQuery },
  };

  if (userInfo?.preferences.nsfwContent === "HIDE") {
    channelMatchStage.nsfwProfile = false;
  }

  // Channel Aggregate Query
  const channelAggregateQuery = User.aggregate([
    {
      $match: channelMatchStage,
    },
    {
      $project: {
        _id: 0,
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        about: 1,
        creatorMode: 1,
        nsfwProfile: 1,
      },
    },
  ]);

  // Channel Paginated Result
  const channelPaginatedResult = await User.aggregatePaginate(
    channelAggregateQuery,
    options
  );

  if (channelPaginatedResult.page! > channelPaginatedResult.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.SEARCH.FETCH_SUCCESS,
      data: channelPaginatedResult,
    })
  );
};

const getSearchResultForPlaylist: SearchUtility = async (
  searchQuery,
  userInfo,
  options,
  res
) => {
  // Playlist Match Stage
  const playlistMatchStage: Record<string, unknown> = {
    $text: { $search: searchQuery },
    publishStatus: "PUBLIC",
  };

  if (userInfo?.preferences.nsfwContent === "HIDE") {
    playlistMatchStage.nsfw = false;
  }

  // Playlist Aggregate Query
  const playlistAggregateQuery = Playlist.aggregate([
    {
      $match: playlistMatchStage,
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
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
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
                    _id: 0,
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
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
      },
    },
  ]);

  // Playlist Paginated Result
  const playlistPaginatedResult = await Playlist.aggregatePaginate(
    playlistAggregateQuery,
    options
  );

  if (playlistPaginatedResult.page! > playlistPaginatedResult.totalPages) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.PAGINATE.INVALID_PAGE_SELECTION,
    });
  }

  // Final Response
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse({
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.SEARCH.FETCH_SUCCESS,
      data: playlistPaginatedResult,
    })
  );
};

export const getSearchResults: Controller = async (req, res) => {
  const page = Number(req.query.page as string) || 1;
  const limit = Number(req.query.limit as string) || 10;

  // Search Query
  const query = req.query.query as string;
  const type = req.query.type as string;

  if (!query || !type) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `?query=<${query}>&type=<${type}> : ${RESPONSE_MESSAGE.COMMON.ALL_QUERY_PARAMS_REQUIRED}`,
    });
  }

  // Auto-correct misspelled words in the search query
  const correctedSearch = getCorrectSearchQuery(query || "");

  // Verify logged-in User and Extract user info
  const userInfo = getLoggedInUserInfo(req?.cookies?.refreshToken);

  // If user is logged-in and search history is turned on
  if (userInfo?._id) {
    await User.findByIdAndUpdate(
      userInfo._id,
      {
        $push: { searchHistory: query },
      },
      { new: true }
    );
  }

  // Paginate Options
  const options = {
    page,
    limit,
  };

  if (type === "video") {
    return getSearchResultForVideo(correctedSearch, userInfo, options, res);
  } else if (type === "channel") {
    return getSearchResultForChannel(correctedSearch, userInfo, options, res);
  } else if (type === "playlist") {
    return getSearchResultForPlaylist(correctedSearch, userInfo, options, res);
  } else {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: `type=${type} : "type" query is invalid, Correct types are [video, channel, playlist]`,
    });
  }
};
