import { useEffect, useState } from "preact/hooks";
import { wrapError } from "../helpers/errorHelpers";
import { mailboxRepository } from "../helpers/MailboxRepository";
import { getQueryParam } from "../helpers/UrlHelpers";
import { ContextMenuInfo } from "../types/Domain";
import { PromiseState } from "../types/UtilityTypes";

const getDropForTab = async () => {
  const tabId = getQueryParam("targetId");
  if (!tabId) return null;
  return await mailboxRepository.getDropForTab(tabId);
};

type CmiPromiseState = PromiseState<ContextMenuInfo | null, "contextMenuInfo">;

let promiseState: CmiPromiseState = {
  isLoading: true,
  error: null,
  contextMenuInfo: null,
};
const getMenuInfoPromise = getDropForTab().then(
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
