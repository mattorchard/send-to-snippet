import { h, FunctionComponent } from "preact";
import { Snippet, SnippetOutputTypeDataRecord } from "../types/Domain";
import { AutosizedTextarea } from "./AutosizedTextarea";
import { Box } from "./Box";
import { Button } from "./Button";
import { DateTime } from "./DateTime";

export const SnippetCard: FunctionComponent<{
  snippet: Snippet;
  onSnippetChange: (snippet: Snippet) => void;
  onDeleteSnippet: (id: string) => void;
  onSelectSnippet: (id: string) => void;
}> = ({ snippet, onSnippetChange, onDeleteSnippet, onSelectSnippet }) => (
  <article>
    <form onSubmit={(e) => e.preventDefault()} className="snippet-card">
      <Box as="header" className="snippet-card__header">
        <Box as="h3" className="h3" flexGrow={2}>
          <input
            name="title"
            aria-label="Title"
            placeholder="Snippet title"
            defaultValue={snippet.title}
            onBlur={(e) =>
              onSnippetChange({
                ...snippet,
                title: e.currentTarget.value,
              })
            }
            className="subtle-input interactive"
            type="text"
          />
        </Box>

        <Box ml="auto">
          <Button onClick={() => onSelectSnippet(snippet.id)}>
            Edit script
          </Button>

          <Button
            intent="warning"
            onClick={() => {
              const title = snippet.title.trim() || "Unnamed snippet";
              if (window.confirm(`Are you sure you want to delete "${title}"?`))
                onDeleteSnippet(snippet.id);
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <AutosizedTextarea
        name="description"
        aria-label="Description"
        placeholder="Snippet description"
        defaultValue={snippet.description}
        onBlur={(e) =>
          onSnippetChange({
            ...snippet,
            description: e.currentTarget.value,
          })
        }
        className="subtle-textarea interactive"
      />

      <footer>
        <Box
          as="dl"
          className="subtle-text"
          gap={2}
          p={0.125}
          justifyContent="space-between"
        >
          <Box>
            <dt>Output&nbsp;</dt>
            <dd
              title={
                SnippetOutputTypeDataRecord[snippet.outputType].description
              }
            >
              {SnippetOutputTypeDataRecord[snippet.outputType].label}
            </dd>
          </Box>
          <Box>
            <dt>Updated&nbsp;</dt>
            <dd>
              <DateTime date={snippet.updatedAt} />
            </dd>
          </Box>
        </Box>
      </footer>
    </form>
  </article>
);
