import { useCallback, useEffect, useRef, useState } from "preact/hooks";
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

const logger = new Logger("SandboxReply");

export const useSandboxReply = (key: string) => {
  const iframeRef = useRef<HTMLIFrameElement>(undefined!);
  const [state, setState] = useState(initialReplyState);
  const keyRef = useRef(key);

  useEffect(() => {
    setState(initialReplyState);
    keyRef.current = key;
  }, [key]);

  useWindowEvent(
    "message",
    useCallback((event: MessageEvent<FromSandboxMessage>) => {
      if (event.source !== iframeRef.current.contentWindow) return;
      const { data } = event;
      if (data.runId !== keyRef.current) return;
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
    ref: iframeRef,
    state,
    isLoading: !state.hasMutated && !state.hasError && !state.hasResolved,
  };
};
