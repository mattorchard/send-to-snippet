export type PromiseState<ResultType, ResultKey extends string = "result"> = {
  isLoading: boolean;
  error: Error | null;
} & Record<ResultKey, ResultType>;
