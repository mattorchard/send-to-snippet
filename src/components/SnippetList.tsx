import { h, FunctionComponent } from "preact";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";

type SnippetIdHandler = (id: string) => void;

export const SnippetList: FunctionComponent<{
  snippets: Snippet[];
  onDelete: SnippetIdHandler;
  onEdit: SnippetIdHandler;
  onRun: SnippetIdHandler;
}> = ({ snippets, onRun, onEdit, onDelete }) => (
  <ol className="snippet-list">
    {snippets.map((snippet) => (
      <li
        key={snippet.id}
        className="snippet-list__item interactive"
        onClick={() => onRun(snippet.id)}
      >
        <div className="snippet-list__item__title-container">
          <h3 className="h4 ellipses" title={snippet.title}>
            {snippet.title.trim() || (
              <em className="italics">{FALLBACK_TITLE}</em>
            )}
          </h3>
        </div>

        <Box
          className="snippet-list__item__actions"
          onClick={(e: Event) => e.stopPropagation()}
        >
          <Button onClick={() => onRun(snippet.id)}>Run</Button>
          <Button onClick={() => onEdit(snippet.id)}>Edit</Button>
          <Button
            intent="warning"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${
                    snippet.title.trim() || FALLBACK_TITLE
                  }"?`
                )
              )
                onDelete(snippet.id);
            }}
          >
            Delete
          </Button>
        </Box>
      </li>
    ))}
  </ol>
);

const FALLBACK_TITLE = "Untitled snippet";
