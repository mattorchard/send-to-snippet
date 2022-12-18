type ToSandboxRunMessage = {
  kind: "run";
  runId: string;
  inputText: string;
  script: string;
};

export type ToSandboxMessage = ToSandboxRunMessage;

type FromSandboxResolveMessage = {
  kind: "resolve";
  runId: string;
  result: unknown;
};

type FromSandboxErrorMessage = { kind: "error"; runId: string; error: Error };

type FromSandboxMutateMessage = {
  kind: "dom-mutation";
  runId: string;
};

export type FromSandboxMessage =
  | FromSandboxResolveMessage
  | FromSandboxErrorMessage
  | FromSandboxMutateMessage;
