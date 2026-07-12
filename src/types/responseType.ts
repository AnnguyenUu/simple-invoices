import { Metadata } from "./meta";

export interface AxiosResponseListType<T> extends Metadata {
  data: T[];
}