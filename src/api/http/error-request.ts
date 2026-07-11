import axios from "axios";
import { redirect } from "next/navigation";

export class ErrorRequest {
  protected handleError(error: unknown, redirectOn401 = true): never {
    if (redirectOn401 && axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window === "undefined") {
        redirect("/login");
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw error;
  }
}
