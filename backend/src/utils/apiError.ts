interface ApiErrorParams {
  status: number;
  message: string;
  errors?: string[];
  stack?: string;
}

class ApiError extends Error {
  public status: number;
  public data: null;
  public errors: string[];
  public success: boolean;
  public stack: string | undefined;

  constructor({ status, message, errors = [], stack = "" }: ApiErrorParams) {
    super(message);
    this.status = status;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
