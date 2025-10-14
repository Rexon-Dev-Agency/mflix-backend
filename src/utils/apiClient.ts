import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const apiClient = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await axios(url, config);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "API request failed");
  }
};
