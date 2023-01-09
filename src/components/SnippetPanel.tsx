import { h, FunctionComponent, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { MainPanel } from "./MainPanel";
import { RelativeDateTime } from "./RelativeDateTime";
import { Skeleton } from "./Skeleton";
import { SnippetTile } from "./SnippetTile";

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
}) => (
  <MainPanel
    title="Snippets"
    action={<Button onClick={onAdd}>Add Snippet</Button>}
    content={
      <Box as="ol" flexDirection="column" gap={1}>
        {snippets ? (
          <Fragment>
            {snippets.map((snippet) => (
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
    }
  />
);
