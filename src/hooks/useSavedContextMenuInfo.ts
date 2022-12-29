import { useEffect, useState } from "preact/hooks";
import { wrapError } from "../helpers/errorHelpers";
import { mailboxRepository } from "../helpers/MailboxRepository";
import { ContextMenuInfo } from "../types/Domain";
import { PromiseState } from "../types/UtilityTypes";

const getDrop = async () => {
  if (!chrome?.tabs) return null;
  const tab = await chrome.tabs.getCurrent();
  if (!tab || !tab.id) return null;
  return await mailboxRepository.getDropForTab(tab.id);
};

type CmiPromiseState = PromiseState<ContextMenuInfo | null, "contextMenuInfo">;

let promiseState: CmiPromiseState = {
  isLoading: true,
  error: null,
  contextMenuInfo: null,
};
const getMenuInfoPromise = getDrop().then(
  (drop) =>
    (promiseState = {
      isLoading: false,
      contextMenuInfo: drop?.contextMenuInfo ?? null,
      error: null,
    }),
  (error) =>
    (promiseState = {
      isLoading: false,
      contextMenuInfo: null,
      error: wrapError(error),
    })
);

export const useSavedContextMenuInfo = (): CmiPromiseState => {
  const [state, setState] = useState(promiseState);
  useEffect(() => {
    if (!state.isLoading) return () => {};

    let isCancelled = false;
    getMenuInfoPromise.finally(() => {
      if (!isCancelled) setState(promiseState);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
};
