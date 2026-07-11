import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 10_000,
  withCredentials: true,
});
