import { h, FunctionComponent, Fragment } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { useSnippetRepo } from "../hooks/useSnippetRepo";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { SnippetOptionsModal } from "./SnippetOptionsModal";

export const SnippetTable: FunctionComponent<{
  onRunSnippet: (script: string) => void;
}> = ({ onRunSnippet }) => {
  const { snippets, isLoading, upsertSnippet, deleteSnippet } =
    useSnippetRepo();
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const editingSnippet = useMemo(
    () => snippets?.find((snippet) => snippet.id === editingSnippetId) ?? null,
    [snippets, editingSnippetId]
  );
  const stopEditingSnippet = useCallback(() => setEditingSnippetId(null), []);
  const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);

  return (
    <Fragment>
      <table className="snippet-table">
        <thead className="sr-only">
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <RowSkeleton span={6} />
          ) : (
            snippets?.map((snippet) => (
              <tr
                key={snippet.id}
                id={`snippet-row-${snippet.id}`}
                tabIndex={0}
                className={`snippet-row ${
                  activeSnippetId === snippet.id && "snippet-row--active"
                }`}
              >
                <td>
                  <h3>
                    <input
                      name="title"
                      aria-label="Title"
                      placeholder="Snippet title"
                      defaultValue={snippet.title}
                      onBlur={(e) => {
                        const title = e.currentTarget.value;
                        if (title !== snippet.title)
                          upsertSnippet({ ...snippet, title });
                      }}
                      className="subtle-input interactive"
                      type="text"
                    />
                  </h3>
                </td>
                <td>
                  <Box
                    className="action-cell__content"
                    justifyContent="flex-end"
                  >
                    <Button
                      onClick={() => {
                        onRunSnippet(snippet.script);
                        setActiveSnippetId(snippet.id);
                      }}
                    >
                      Run
                    </Button>
                    <Button onClick={() => setEditingSnippetId(snippet.id)}>
                      Edit
                    </Button>
                    <Button
                      intent="warning"
                      onClick={() => {
                        if (confirmSnippetDelete(snippet))
                          deleteSnippet(snippet.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {editingSnippet && (
        <SnippetOptionsModal
          snippet={editingSnippet}
          onSave={upsertSnippet}
          onClose={stopEditingSnippet}
        />
      )}
    </Fragment>
  );
};

const RowSkeleton: FunctionComponent<{ span: number }> = ({ span }) => (
  <tr colSpan={span}>
    <div className="sr-only">Loading</div>
  </tr>
);

const confirmSnippetDelete = (snippet: Snippet) =>
  window.confirm(
    `Are you sure you want to delete "${snippet.title || "Unnamed snippet"}"?`
  );
