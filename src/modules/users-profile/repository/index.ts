import { RequestBuilder } from "@/api/http/request-builder";
import { User } from "@/types/user";

export function fetchUserProfile(): Promise<User> {
  return new RequestBuilder<User>()
    .withMethod("get")
    .withUrl("/users/me")
    .send();
}
