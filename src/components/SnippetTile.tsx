import { h, FunctionComponent } from "preact";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { DateTime } from "./DateTime";

interface SnippetTileProps {
  snippet: Snippet;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SnippetTile: FunctionComponent<SnippetTileProps> = ({
  snippet,
  onRun,
  onEdit,
  onDelete,
}) => {
  const title = snippet.title.trim() || FALLBACK_TITLE;
  return (
    <Box
      className="snippet-tile"
      justifyContent="space-between"
      onDblClick={onRun}
    >
      <Box p={0.5} flexDirection="column" gap={0.75}>
        <h3 className="snippet-tile__heading h3 ellipses">{title}</h3>
        <p>
          Updated: <DateTime date={snippet.updatedAt} />
        </p>
        <Box>
          <Button onClick={onEdit}>Edit</Button>
          <Button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${title}"?`))
                onDelete();
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
      <Button onClick={onRun}>Run</Button>
    </Box>
  );
};

const FALLBACK_TITLE = `Untitled Snippet`;
