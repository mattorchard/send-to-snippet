import { FunctionComponent, h } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Box } from "../components/Box";
import { useLocationHash } from "../hooks/useLocationHash";
import { useSnippetRepo } from "../hooks/useSnippetRepo";
import { Button } from "./Button";
import { SnippetCard } from "./SnippetCard";
import { SnippetOptionsModal } from "./SnippetOptionsModal";
import { SnippetRunner } from "./SnippetRunner";

export const SnippetOptionList: FunctionComponent<{ inputText: string }> = ({
  inputText,
}) => {
  const { snippets, upsertSnippet, createSnippet, deleteSnippet } =
    useSnippetRepo();
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    null
  );
  const clearSelection = useCallback(() => setSelectedSnippetId(null), []);
  const selectedSnippet = useMemo(() => {
    if (!selectedSnippetId) return null;
    return (
      snippets?.find((snippet) => snippet.id === selectedSnippetId) ?? null
    );
  }, [selectedSnippetId, snippets]);

  return (
    <Box as="section" flexDirection="column" gap={1.5}>
      <Box as="header">
        <Box as="h2" className="h2" p={0.25}>
          Saved Snippets
        </Box>
        <Box ml="auto">
          <Button id="add-snippet" onClick={createSnippet}>
            + Add snippet
          </Button>
        </Box>
      </Box>

      <Box as="ol" flexDirection="column" gap={3}>
        {snippets?.map((snippet) => (
          <li key={snippet.id}>
            <SnippetCard
              snippet={snippet}
              onSnippetChange={upsertSnippet}
              onDeleteSnippet={deleteSnippet}
              onSelectSnippet={setSelectedSnippetId}
            />
            <SnippetRunner snippet={snippet} inputText={inputText} />
          </li>
        ))}
      </Box>
      {snippets?.length === 0 && (
        <p>
          Looks like you don't have any Snippets yet. Click the the{" "}
          <a href="#add-snippet">add snippet button</a> to create a new snippet.
        </p>
      )}
      {selectedSnippet && (
        <SnippetOptionsModal
          snippet={selectedSnippet}
          onSave={upsertSnippet}
          onClose={clearSelection}
        />
      )}
    </Box>
  );
};
