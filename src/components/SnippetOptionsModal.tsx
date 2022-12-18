import { FunctionComponent, h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { Snippet, Upsertable } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { MonacoWrapper } from "./MonacoWrapper";

export const SnippetOptionsModal: FunctionComponent<{
  snippet: Snippet;
  onSave: (snippet: Upsertable<Snippet>) => void;
  onClose: () => void;
}> = ({ snippet, onClose, onSave }) => {
  const [draftScript, setDraftScript] = useState(snippet.script);
  const ref = useRef<HTMLDialogElement>(undefined!);

  useLayoutEffect(() => {
    ref.current.showModal();
  }, []);

  const hasUnsavedChanges = snippet.script !== draftScript;

  const confirmCancel = useCallback(() => {
    if (!hasUnsavedChanges) return true;
    return window.confirm(
      "Are you sure you want to discard your unsaved changes?"
    );
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const dialiog = ref.current;
    const handleCancel = (event: Event) => {
      if (!confirmCancel()) {
        event.preventDefault();
      }
    };
    dialiog.addEventListener("cancel", handleCancel);
    return () => dialiog.removeEventListener("cancel", handleCancel);
  }, [confirmCancel]);

  useEffect(() => {
    const dialiog = ref.current;
    const handleClose = () => {
      console.debug("In close event, closing");
      onClose();
    };
    dialiog.addEventListener("close", handleClose);
    return () => dialiog.removeEventListener("close", handleClose);
  }, []);

  return (
    <div>
      <dialog ref={ref} className="snippet-options-modal">
        <form
          class="snippet-options-modal__form"
          method="dialog"
          onSubmit={() =>
            onSave({
              ...snippet,
              script: draftScript,
            })
          }
          onReset={() => {
            if (confirmCancel()) onClose();
          }}
        >
          <Box as="header" className="snippet-options-modal__header">
            <Box as="h3" className="h3" p={0.5}>
              {snippet.title}
            </Box>
            <Box ml="auto">
              <Button type="submit">Save changes</Button>
              <Button type="reset" intent="warning">
                Cancel
              </Button>
            </Box>
          </Box>
          <MonacoWrapper
            initialValue={snippet.script}
            onChange={setDraftScript}
            language="typescript"
          />
        </form>
      </dialog>
    </div>
  );
};
