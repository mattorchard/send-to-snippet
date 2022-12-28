import { useCallback, useEffect, useState } from "preact/hooks";
import { sampleSnippetSkeleton } from "../helpers/sampleData";
import { snippetRepository } from "../helpers/SnippetRepository";
import { Snippet, Upsertable } from "../types/Domain";

export const useSnippetRepo = () => {
  const [snippets, setSnippets] = useState<Snippet[] | null>(null);
  const isLoading = snippets === null;

  useEffect(() => {
    snippetRepository.getAllSnippets().then(setSnippets);
  }, []);

  const upsertSnippet = useCallback(
    async (snippet: Upsertable<Snippet>) => {
      if (isLoading)
        throw new Error(`Cannot save snippet before snippets have loaded`);
      const completeSnippet = await snippetRepository.upsertSnippet(snippet);

      setSnippets((oldSnips) =>
        snippet.id
          ? // Update existing snippet
            oldSnips!.map((s) => (s.id === snippet.id ? completeSnippet : s))
          : // Insert new snippet
            [completeSnippet, ...oldSnips!]
      );
    },
    [isLoading]
  );

  const createSnippet = useCallback(
    () =>
      upsertSnippet({
        ...sampleSnippetSkeleton,
      }),
    [upsertSnippet]
  );

  const deleteSnippet = useCallback(
    async (idToDelete: string) => {
      if (isLoading)
        throw new Error(`Cannot delete snippet before snippets have loaded`);
      await snippetRepository.deleteSnippet(idToDelete);
      setSnippets((oldSnips) =>
        oldSnips!.filter((snip) => snip.id !== idToDelete)
      );
    },
    [isLoading]
  );

  return {
    snippets,
    isLoading,
    upsertSnippet,
    createSnippet,
    deleteSnippet,
  };
};
