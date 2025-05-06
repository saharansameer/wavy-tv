import { NODE_ENV } from "../config/env.js";

const isProduction = String(NODE_ENV) === "production";
export const cookiesOptions = isProduction
  ? {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      domain: ".sameersaharan.com",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  : {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
    };

export const SIZE_LIMIT = "1mb";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const RESPONSE_MESSAGE = {
  COMMON: {
    ALL_REQUIRED_FIELDS: "All fields are required",
    REQ_NOT_FOUND: "No such property found in Request Object",
    ALL_QUERY_PARAMS_REQUIRED: "All Query Parameters are Required",
  },
  AUTH: {
    SIGNUP_SUCCESS: "New user registered successfully",
    SIGNUP_FAILED: "Failed to register new user",
    SIGNUP_REQUIRED_FIELDS:
      "All fields are required (i.e Fullname, Username, Email, Password)",
    LOGIN_SUCCESS: "User logged-in successfully",
    LOGIN_FAILED: "Failed to login user",
    LOGIN_REQUIRED_FIELDS: "Email and Password both are required",
    INVALID_LOGIN_CREDS: "Invalid Email or Username",
    INCORRECT_PASSWORD: "Password is incorrect",
    LOGOUT_SUCCESS: "User logged out successfully",
    LOGIN_AGAIN: "Session expired. Please log in again",
  },
  USER: {
    NOT_FOUND: "User does not exist",
    NOT_AUTHORIZED: "User is not authorized",
    UPDATE_SUCCESS: "User details updated successfully",
    UPDATE_FAILED: "Failed to update user details",
    FETCH_DETAILS_SUCCESS: "User details fetched successfully",
  },
  COOKIES: {
    TOKEN_GENERATED: "New Tokens generated successfully",
    NOT_FOUND: "Requested cookies does not exist",
    TOKEN_EXPIRED: "Token is expired or invalid",
    TOKEN_VALID: "Token is valid",
    ACCESS_TOKEN_EXPIRED: "Access token is expired or invalid",
    REFRESH_TOKEN_EXPIRED: "Refresh token is expired or invalid",
    DELETE_SUCCESS: "Token cookies deleted successfully from ",
  },
  VIDEO: {
    NOT_FOUND: "Video is private or does not exist",
    FETCH_SUCCESS: "Video fetched successfully",
    UPDATE_SUCCESS: "Video details updated successfully",
    DELETE_SUCCESS: "Video deleted successfully",
    CREATE_SUCCESS: "Video doc created successfully",
    CREATE_FAILURE: "Failed to create Video doc",
  },
  FOLLOW: {
    FOLLOWING: "Followed successfully",
    UNFOLLOWED: "Unfollowed successfully",
    TOGGLE_FAILURE: "Failed to toggle follow",
    FOLLOWER_FETCH_SUCCESS: "Followers fetched successfully",
    ZERO_FOLLOWER: "User has zero follower",
    FOLLOWING_FETCH_SUCCESS: "Following fetched successfully",
    ZERO_FOLLOWING: "User has zero following ",
  },
  PLAYLIST: {
    NOT_FOUND: "Playlist is private or does not exist",
    CREATE_SUCCESS: "Playlist created successfully",
    CREATE_FAILURE: "Failed to create new playlist",
    UPDATE_SUCCESS: "Playlist updated successfully",
    DELETE_SUCCESS: "Playlist deleted successfully",
    FETCH_SUCCESS: "Playlist fetched successfully",
  },
  VOTES: {
    UPVOTE_SUCCESS: "Upvoted successfully",
    UPVOTE_FAILURE: "Failed to add Upvote",
    REMOVE_UPVOTE_SUCCESS: "Removed upvote successfully",
    REMOVE_UPVOTE_FAILURE: "Failed to remove upvote",
    DOWNVOTE_SUCCESS: "Downvoted successfully",
    DOWNVOTE_FAILURE: "Failed to add Downvote",
    REMOVE_DOWNVOTE_SUCCESS: "Removed downvote successfully",
    REMOVE_DOWNVOTE_FAILURE: "Failed to remove downvote",
  },
  POST: {
    NOT_FOUND: "Post no longer exist",
    CREATE_SUCCESS: "Post created successfully",
    CREATE_FAILURE: "Failed to create new Post",
    UPDATE_SUCCESS: "Post updated successfully",
    DELETE_SUCCESS: "Post deleted successfully",
    FETCH_SUCCESS: "Post fetched successfully",
  },
  COMMENT: {
    NOT_FOUND: "Comment no longer exist",
    CREATE_SUCCESS: "Comment created successfully",
    CREATE_FAILURE: "Failed to add Comment",
    UPDATE_SUCCESS: "Comment updated successfully",
    DELETE_SUCCESS: "Comment deleted successfully",
    FETCH_SUCCESS: "Comments fetched successfully",
    ZERO_COMMENTS: "Entity has zero comments or replies",
  },
  PAGINATE: {
    INVALID_PAGE_SELECTION:
      "Invalid Page Selection, No Docs Exist on this page",
  },
  SEARCH: {
    FETCH_SUCCESS: "Search Query fetched successfully",
  },
  HISTORY: {
    DELETE_SUCCESS: "Watch History deleted successfully",
    DELETE_FAILURE: "Failed to delete Watch History",
    VIDEO_ADD_SUCCESS: "Video added to Watch History",
    VIDEO_ADD_FAILURE: "Failed to add Video to Watch History",
    VIDEO_REMOVE_SUCCESS: "Videos removed from Watch History",
    VIDEO_REMOVE_FAILURE: "Failed to remove Videos from Watch History",
    FETCH_SUCCESS: "Watch History fetched successfully",
  },
};
