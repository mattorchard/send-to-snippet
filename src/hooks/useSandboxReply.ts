import { useCallback, useRef, useState } from "preact/hooks";
import { Logger } from "../helpers/Logger";
import { FromSandboxMessage } from "../types/Protocol";
import { useWindowEvent } from "./useWindowEvent";

interface SandboxReplyState {
  error: Error | null;
  result: unknown | null;
  hasMutated: boolean;
  hasError: boolean;
  hasResolved: boolean;
}

const initialReplyState: SandboxReplyState = {
  error: null,
  result: null,
  hasMutated: false,
  hasError: false,
  hasResolved: false,
};

const logger = new Logger("useSandboxReply");

export const useSandboxReply = () => {
  const ref = useRef<HTMLIFrameElement>(undefined!);
  const [state, setState] = useState(initialReplyState);

  useWindowEvent(
    "message",
    useCallback((event: MessageEvent<FromSandboxMessage>) => {
      if (event.source !== ref.current.contentWindow) return;
      const { data } = event;
      logger.debug("Main thread received reply", data);
      switch (data.kind) {
        case "dom-mutation":
          setState((state) => ({ ...state, hasMutated: true }));
          break;
        case "resolve":
          setState((state) => ({
            ...state,
            hasResolved: true,
            result: data.result,
          }));
          break;
        case "error":
          setState((state) => ({
            ...state,
            hasError: true,
            error: data.error,
          }));
          break;
        default:
          logger.warn("Received unexpected message kind", data);
      }
    }, [])
  );

  return {
    ref,
    state,
    isLoading: !state.hasMutated && !state.hasError && !state.hasResolved,
  };
};
