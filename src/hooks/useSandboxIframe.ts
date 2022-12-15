import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { LinkHrefs } from "../helpers/LinkHrefs";
import { useWindowEvent } from "./useWindowEvent";

const src = LinkHrefs.sandbox;

export const useSandboxIframe = () => {
  const ref = useRef<HTMLIFrameElement>(undefined!);
  const [response, setResponse] = useState<any>(null);
  const firstLoadRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    firstLoadRef.current = waitForLoad(ref.current);
  }, []);

  const runScript = useCallback(async (script: string, inputText: string) => {
    if (!firstLoadRef.current)
      throw new Error(`Cant run script before first load initiated`);
    await firstLoadRef.current;

    const loadingPromise = waitForLoad(ref.current);
    ref.current.contentWindow!.location.replace(src);
    await loadingPromise;

    ref.current.contentWindow!.postMessage({ script, inputText }, "*");
  }, []);

  useWindowEvent(
    "message",
    useCallback((event: MessageEvent) => {
      if (event.source === ref.current.contentWindow) setResponse(event.data);
    }, [])
  );

  return {
    src,
    ref,
    response,
    runScript,
  };
};

const waitForLoad = (iframe: HTMLIFrameElement) =>
  new Promise<void>((resolve) => {
    iframe.addEventListener("load", () => resolve(), { once: true });
  });
