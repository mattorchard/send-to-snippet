import { JSX } from "preact";

export type PromiseState<ResultType, ResultKey extends string = "result"> = {
  isLoading: boolean;
  error: Error | null;
} & Record<ResultKey, ResultType>;

export type Renderable =
  | JSX.Element
  | string
  | number
  | false
  | null
  | undefined;

export type ValueOf<T> = T[keyof T];
