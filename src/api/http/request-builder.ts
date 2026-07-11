import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { ErrorRequest } from "./error-request";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

// Chainable wrapper around apiClient: new RequestBuilder<T>()
//   .withMethod("post").withUrl("/invoices").withData(payload).send()
// This is the one way every fetch in this app is made — see error-request.ts
// for the 401-redirect behavior baked into .send() via ErrorRequest.
export class RequestBuilder<T = unknown> extends ErrorRequest {
  private config: AxiosRequestConfig = {};
  private redirectOn401 = true;

  // Opt out of the default 401 -> redirect("/login") behavior. Needed by
  // callers that back a fetch/axios call from client code rather than a
  // page render (see error-request.ts's handleError for the full reasoning).
  withRedirectOn401(enabled: boolean): this {
    this.redirectOn401 = enabled;
    return this;
  }

  withMethod(method: HttpMethod): this {
    this.config.method = method;
    return this;
  }

  withUrl(url: string): this {
    this.config.url = url;
    return this;
  }

  withData(data: unknown): this {
    this.config.data = data;
    return this;
  }

  withParams(params: Record<string, unknown>): this {
    this.config.params = params;
    return this;
  }

  withHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  async send(): Promise<T> {
    try {
      const { data } = await apiClient.request<T>(this.config);
      return data;
    } catch (error) {
      this.handleError(error, this.redirectOn401);
    }
  }
}
