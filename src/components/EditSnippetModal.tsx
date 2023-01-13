import { FunctionComponent, h } from "preact";
import { useCallback, useRef, useState } from "preact/hooks";
import { useLiveCallback } from "../hooks/useLiveCallback";
import { useWindowEvent } from "../hooks/useWindowEvent";
import { Snippet, Upsertable } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { MonacoWrapper, MonacoWrapperRef } from "./MonacoWrapper";

export const EditSnippetModal: FunctionComponent<{
  snippet: Snippet;
  onSave: (snippet: Upsertable<Snippet>) => void;
  onClose: () => void;
}> = ({ snippet, onClose, onSave }) => {
  const [focusReady, setFocusReady] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(undefined!);
  const scriptEditorRef = useRef<MonacoWrapperRef>(undefined!);

  const hasUnsavedChanges = useCallback(
    () =>
      snippet.title !== titleInputRef.current.value ||
      snippet.script !== scriptEditorRef.current.getValue(),
    []
  );

  const confirmDiscard = useCallback(() => {
    if (!hasUnsavedChanges()) return true;
    return window.confirm(
      "Are you sure you want to discard your unsaved changes?"
    );
  }, [hasUnsavedChanges]);

  const handleEditorEscape = useCallback(() => {
    if (confirmDiscard()) onClose();
  }, [confirmDiscard, onClose]);

  const handleCancel = useCallback(
    (event: Event) => {
      if (!confirmDiscard()) event.preventDefault();
    },
    [confirmDiscard]
  );

  const handleSave = () =>
    onSave({
      ...snippet,
      title: titleInputRef.current.value,
      script: scriptEditorRef.current.getValue() ?? "",
    });

  useWindowEvent(
    "keydown",
    useLiveCallback((event) => {
      if (!event.ctrlKey) return;
      if (event.key.toLowerCase() !== "s") return;
      event.preventDefault();
      handleSave();
      onClose();
    })
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
        onSubmit={handleSave}
        onReset={() => {
          if (confirmDiscard()) onClose();
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
              defaultValue={snippet.title}
              className="edit-snippet-modal__title-input"
              type="text"
              ref={titleInputRef}
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
            language="typescript"
            autoFocus={focusReady}
            ref={scriptEditorRef}
            onEscape={handleEditorEscape}
          />
        </div>
      </form>
    </Dialog>
  );
};
