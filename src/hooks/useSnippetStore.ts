import { useEffect, useState } from "preact/hooks";
import { snippetStore } from "../stores/SnippetStore";

export const useSnippetStore = () => {
  const [state, setState] = useState(snippetStore.getCurrentValue());

  useEffect(() => {
    setState(snippetStore.getCurrentValue());
    return snippetStore.subscribe(setState);
  }, []);

  return {
    ...state,
    upsertSnippet: snippetStore.upsertSnippet,
    createSnippet: snippetStore.createSnippet,
    deleteSnippet: snippetStore.deleteSnippet,
  };
};
