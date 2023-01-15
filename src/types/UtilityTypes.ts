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

export type JsonPrimitives = string | number | boolean | null;

// prettier-ignore
export type Jsonified<T> = T extends JsonPrimitives
  ? T
  : T extends Date
    ? string
    : T extends any[]
      ? Array<T[number]>
      : { [key in keyof T]: Jsonified<T[key]> };
