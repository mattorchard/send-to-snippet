export const wrapError = (error: unknown) => {
  if (error instanceof Error) return error;
  const message = extractMessage(error);
  if (message) return new Error(message, { cause: error });
  return new Error(`Unknown error "${error}"`, { cause: error });
};

const extractMessage = (error: unknown): string | null => {
  if (typeof error === "string") return error;
  if (error === null) return `Received null error`;
  if (error === undefined) return `Received undefined error`;
  // @ts-ignore
  if (error && typeof error.message === "string") return error.message;

  return null;
};
