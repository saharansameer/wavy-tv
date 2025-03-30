export const SIZE_LIMIT = "1mb";

export const cookiesOptions = {
  httpOnly: true,
  secure: true,
};

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
    ACCESS_TOKEN_EXPIRED: "Access token is expired or invalid",
    REFRESH_TOKEN_EXPIRED: "Refresh token is expired or invalid",
  },
  VIDEO: {
    NOT_FOUND: "Video is private or does not exist",
    FETCH_SUCCESS: "Video fetched successfully",
    UPDATE_SUCCESS: "Video details updated successfully",
    DELETE_SUCCESS: "Video deleted successfully",
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
};
