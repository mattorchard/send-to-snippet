import { wrapError } from "../helpers/errorHelpers";
import { onFirstMutation } from "../helpers/mutationHelpers";
import { FromSandboxMessage, ToSandboxMessage } from "../types/Protocol";

const reply = (message: FromSandboxMessage) =>
  window.top!.postMessage(message, "*");

window.onmessage = async ({ data }: { data: ToSandboxMessage }) => {
  console.log("Sandbox received data", data);
  const { script, inputText, runId } = data;
  try {
    onFirstMutation(() => reply({ kind: "dom-mutation", runId }));

    const func = new Function("input", script);
    const result = await func.apply(window, [inputText]);

    console.log("Sandbox calculated result", result);
    reply({ kind: "resolve", runId, result });
  } catch (rawError) {
    console.error(`Sandbox encounterd error`, rawError);
    const error = wrapError(rawError);
    reply({ kind: "error", runId, error });
  }
};
