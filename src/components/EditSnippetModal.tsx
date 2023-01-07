import { FunctionComponent, h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { Snippet, Upsertable } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { MonacoWrapper } from "./MonacoWrapper";

export const EditSnippetModal: FunctionComponent<{
  snippet: Snippet;
  onSave: (snippet: Upsertable<Snippet>) => void;
  onClose: () => void;
}> = ({ snippet, onClose, onSave }) => {
  const [draftTitle, setDraftTitle] = useState(snippet.title);
  const [draftScript, setDraftScript] = useState(snippet.script);
  const [focusReady, setFocusReady] = useState(false);

  const hasUnsavedChanges =
    snippet.title !== draftTitle || snippet.script !== draftScript;

  const confirmCancel = useCallback(() => {
    if (!hasUnsavedChanges) return true;
    return window.confirm(
      "Are you sure you want to discard your unsaved changes?"
    );
  }, [hasUnsavedChanges]);

  const handleCancel = useCallback(
    (event: Event) => {
      if (!confirmCancel()) event.preventDefault();
    },
    [confirmCancel]
  );

  return (
    <Dialog
      isOpen
      className="edit-snippet-modal"
      onClose={onClose}
      onCancel={handleCancel}
    >
      <div tabIndex={0} onFocus={() => setFocusReady(true)} />
      <form
        class="edit-snippet-modal__form"
        method="dialog"
        onSubmit={() =>
          onSave({
            ...snippet,
            title: draftTitle,
            script: draftScript,
          })
        }
        onReset={() => {
          if (confirmCancel()) onClose();
        }}
      >
        <Box
          as="header"
          className="edit-snippet-modal__header"
          alignItems="center"
        >
          <Box as="h3" className="h3" flexGrow={2}>
            <input
              name="title"
              aria-label="Title"
              placeholder="Snippet title"
              defaultValue={draftTitle}
              onInput={(e) => setDraftTitle(e.currentTarget.value)}
              className="edit-snippet-modal__title-input"
              type="text"
            />
          </Box>
          <Box p={0.25}>
            <Button type="submit">Save Changes</Button>
            <Button type="reset" intent="warning">
              Cancel
            </Button>
          </Box>
        </Box>
        <div className="edit-snippet-modal__content">
          <MonacoWrapper
            initialValue={snippet.script}
            onChange={setDraftScript}
            language="typescript"
            autoFocus={focusReady}
          />
        </div>
      </form>
    </Dialog>
  );
};
