import axios from "axios";

// Usable from both Client Components and Server Components/Actions.
// baseURL only applies to relative URLs — pass an absolute URL to
// RequestBuilder.withUrl() to call an external service (e.g. the OAuth
// identity server in src/app/login/actions.ts) and it's used as-is.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 10_000,
  withCredentials: true,
});
