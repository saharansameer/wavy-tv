import axios from "axios";
import { apiConfig } from "@/app/config/env";

const axiosInstance = axios.create({
  baseURL: apiConfig.API_BASE_URL,
  withCredentials: true,
});

export { axiosInstance as axios };
