interface CustomErrorType extends Error {
  status: number;
  message: string;
  errors?: unknown[];
  stack?: string;
}

export const errorHandler: ErrorHandler = (err, _req, res, _next) => {
  // Check if the error is a valid instance of the Error class.
  // This prevents unexpected values from causing issues.
  if (!(err instanceof Error)) {
    return res.status(500).json({
      status: 500,
      message:
        "An unexpected error occurred. Ensure you're throwing errors in proper format.",
      format:
        "throw new ApiError({status: <Status Code>, message: <Error Message>})",
    });
  }

  // Typecast the error to CustomErrorType to access additional properties (status, message, errors, stack).
  const error = err as CustomErrorType;

  return res.status(error.status || 400).json({
    status: error.status || 400,
    message: error.message || "Didn't recieved any error message",
    errors: error.errors,
    stack: error.stack,
  });
};

// Handler for Undefined routes
export const undefinedRoutesHandler: Middleware = (_req, res, _next) => {
  res.status(404).json({
    status: 404,
    message: "oops! Route is not defined",
  });
};
