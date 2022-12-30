import { wrapError } from "../helpers/errorHelpers";
import { Logger } from "../helpers/Logger";
import { onFirstMutation } from "../helpers/mutationHelpers";
import { FromSandboxMessage, ToSandboxMessage } from "../types/Protocol";

const reply = (message: FromSandboxMessage) =>
  window.top!.postMessage(message, "*");

const logger = new Logger("Sandbox");

window.onmessage = async ({ data }: { data: ToSandboxMessage }) => {
  logger.info("Received data", data);
  const { script, inputText, runId } = data;
  try {
    onFirstMutation(() => reply({ kind: "dom-mutation", runId }));

    const func = new Function("input", script);
    const result = await func.apply(window, [inputText]);

    logger.info("Calculated result", result);
    reply({ kind: "resolve", runId, result });
  } catch (rawError) {
    logger.error(`Error`, rawError);
    const error = wrapError(rawError);
    reply({ kind: "error", runId, error });
  }
};
