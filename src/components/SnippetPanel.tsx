import { h, FunctionComponent, Fragment } from "preact";
import { useMemo, useState } from "preact/hooks";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { MainPanel } from "./MainPanel";
import { Skeleton } from "./Skeleton";
import { SnippetTile } from "./SnippetTile";
import { SearchInput } from "./SearchInput";

type SnippetIdHandler = (id: Snippet["id"]) => void;

interface SnippetPanelProps {
  snippets: Snippet[] | null;
  runningSnippetId: string | null;
  onDelete: SnippetIdHandler;
  onEdit: SnippetIdHandler;
  onRun: SnippetIdHandler;
  onAdd: () => void;
}

export const SnippetPanel: FunctionComponent<SnippetPanelProps> = ({
  snippets,
  runningSnippetId,
  onDelete,
  onEdit,
  onRun,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const snippetsMatchingQuery = useMemo(() => {
    const cleanQuery = clean(searchQuery);
    if (!snippets || !cleanQuery) return snippets;
    const matchedSnippets = new Set<Snippet>();
    for (const snippet of snippets) {
      if (clean(snippet.title).startsWith(cleanQuery))
        matchedSnippets.add(snippet);
    }
    for (const snippet of snippets) {
      if (clean(snippet.title).includes(cleanQuery))
        matchedSnippets.add(snippet);
    }
    return [...matchedSnippets];
  }, [searchQuery, snippets]);

  return (
    <MainPanel
      title="Snippets"
      action={
        <>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <Button onClick={onAdd}>Add</Button>
        </>
      }
      content={
        <>
          {snippets?.length === 0 && <p>Add some snippets to get started</p>}
          {snippets?.length !== 0 && snippetsMatchingQuery?.length === 0 && (
            <p>0 results for query "{searchQuery.trim()}"</p>
          )}
          <Box as="ol" flexDirection="column" gap={1}>
            {snippetsMatchingQuery ? (
              <Fragment>
                {snippetsMatchingQuery.map((snippet) => (
                  <li key={snippet.id}>
                    <SnippetTile
                      snippet={snippet}
                      isActiveRunner={snippet.id === runningSnippetId}
                      onDelete={() => onDelete(snippet.id)}
                      onEdit={() => onEdit(snippet.id)}
                      onRun={() => onRun(snippet.id)}
                    />
                  </li>
                ))}
              </Fragment>
            ) : (
              <Fragment>
                <li>
                  <Skeleton height={7} />
                </li>
                <li>
                  <Skeleton height={7} />
                </li>
                <li>
                  <Skeleton height={7} />
                </li>
              </Fragment>
            )}
          </Box>
        </>
      }
    />
  );
};

const clean = (text: string) => text.trim().toLocaleLowerCase();
