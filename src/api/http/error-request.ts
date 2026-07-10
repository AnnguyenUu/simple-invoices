import axios from "axios";
import { redirect } from "next/navigation";

export class ErrorRequest {
  protected handleError(error: unknown, redirectOn401 = true): never {
    if (redirectOn401 && axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window === "undefined") {
        // Server (Server Component / Server Action): next/navigation's
        // redirect() is the idiomatic way to bail out to /login.
        redirect("/login");
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw error;
  }
}
