import { useEffect, useState } from "preact/hooks";
import { ContextMenuInfo } from "../types/Domain";

const sentDataPromise = new Promise<ContextMenuInfo>((resolve, reject) =>
  chrome.runtime.sendMessage("init", (message) =>
    chrome.runtime.lastError
      ? reject(chrome.runtime.lastError)
      : resolve(message)
  )
);

interface PromiseState {
  isLoading: boolean;
  error: Error | null;
  result: ContextMenuInfo | null;
}

let promiseState: PromiseState = { isLoading: true, error: null, result: null };
const promiseStatePromise = sentDataPromise.then(
  (result) => (promiseState = { isLoading: false, result, error: null }),
  (error) => (promiseState = { isLoading: false, result: null, error })
);

export const useSentContextData = (): PromiseState => {
  const [state, setState] = useState(promiseState);
  useEffect(() => {
    if (!state.isLoading) return () => {};

    let isCancelled = false;
    promiseStatePromise.finally(() => {
      if (!isCancelled) setState(promiseState);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
};
