import axios from "axios";
import { redirect } from "next/navigation";

export class ErrorRequest {
  protected handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
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
