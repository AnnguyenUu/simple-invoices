import type { Mock } from "vitest";

export function mockRequestBuilderModule(sendMock: Mock<() => unknown>) {
  class RequestBuilder {
    withMethod() {
      return this;
    }
    withUrl() {
      return this;
    }
    withHeaders() {
      return this;
    }
    withData() {
      return this;
    }
    withParams() {
      return this;
    }
    withRedirectOn401() {
      return this;
    }
    send() {
      return sendMock();
    }
  }

  return { RequestBuilder };
}
