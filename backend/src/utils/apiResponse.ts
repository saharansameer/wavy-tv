interface ApiResponseParams {
  status: number;
  message: string;
  data?: object;
  success?: boolean;
}

class ApiResponse {
  public status: number;
  public message: string;
  public data: object | undefined;
  public success: boolean;

  constructor({ status, message, data }: ApiResponseParams) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export default ApiResponse;
