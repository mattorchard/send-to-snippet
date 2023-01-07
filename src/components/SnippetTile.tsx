import { h, FunctionComponent } from "preact";
import { bem } from "../helpers/StyleHelper";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { DateTime } from "./DateTime";
import { Overlapper } from "./Overlapper";

interface SnippetTileProps {
  snippet: Snippet;
  isActiveRunner: boolean;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SnippetTile: FunctionComponent<SnippetTileProps> = ({
  snippet,
  isActiveRunner,
  onRun,
  onEdit,
  onDelete,
}) => {
  const title = snippet.title.trim() || FALLBACK_TITLE;
  return (
    <div
      className="snippet-tile tile"
      onClick={({ target }) => {
        if (!(target instanceof Node)) return;
        const element =
          target instanceof HTMLElement ? target : target.parentElement!;

        // Action buttons do not trigger run
        if (element.closest("[data-action-buttons]")) return;

        onRun();
      }}
    >
      <Box
        p={0.75}
        pr={0}
        flexDirection="column"
        gap={0.75}
        style={{ minWidth: 0 }}
        mr="auto"
      >
        <h3 className="snippet-tile__heading h3 ellipses" title={title}>
          {title}
        </h3>
        <p>
          Updated: <DateTime date={snippet.updatedAt} />
        </p>
        <Box data-action-buttons={true}>
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

      <button
        type="button"
        className={bem("run-btn", { rerun: isActiveRunner })}
      >
        <Overlapper
          sections={[
            {
              content: "Rerun",
              isActive: isActiveRunner,
            },
            {
              content: "Run",
              isActive: !isActiveRunner,
            },
          ]}
        />
      </button>
    </div>
  );
};

const FALLBACK_TITLE = `Untitled Snippet`;
