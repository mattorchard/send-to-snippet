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
      <li key={snippet.id} className="snippet-list__item">
        <div className="snippet-list__item__title-container">
          <h3 className="h4 ellipses" title={snippet.title}>
            {snippet.title}
          </h3>
        </div>

        <Box>
          <Button onClick={() => onRun(snippet.id)}>Run</Button>
          <Button onClick={() => onEdit(snippet.id)}>Edit</Button>
          <Button intent="warning" onClick={() => onDelete(snippet.id)}>
            Delete
          </Button>
        </Box>
      </li>
    ))}
  </ol>
);
