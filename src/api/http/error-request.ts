import axios from "axios";
import { redirect } from "next/navigation";

// Base class for RequestBuilder. Centralizes what happens when an
// authenticated request comes back 401: redirect the browser to /login.
export class ErrorRequest {
  // redirectOn401 defaults to true: Server Component/Action and Client
  // Component callers render pages, where redirecting to /login on an
  // expired/invalid session is the desired behavior. Route Handlers acting
  // as a proxy (e.g. src/api/http/neobank-proxy.ts) back a fetch/axios call
  // from client code rather than a page navigation — a redirect response
  // there gets silently followed by the HTTP client instead of navigating
  // the browser, so those callers pass redirectOn401: false and forward
  // the real upstream status/body themselves.
  protected handleError(error: unknown, redirectOn401 = true): never {
    if (redirectOn401 && axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window === "undefined") {
        // Server (Server Component / Server Action): next/navigation's
        // redirect() is the idiomatic way to bail out to /login.
        redirect("/login");
      } else if (window.location.pathname !== "/login") {
        // Client Component: redirect() is only supported during render,
        // not from an event handler / async call like this one, so a
        // hard redirect is the reliable equivalent here.
        window.location.href = "/login";
      }
    }

    throw error;
  }
}
