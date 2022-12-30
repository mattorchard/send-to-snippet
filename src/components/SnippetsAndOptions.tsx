import { FunctionComponent, h } from "preact";
import { Box } from "../components/Box";
import { PermissionAlert } from "../components/PermissionAlert";
import { useSavedContextMenuInfo } from "../hooks/useSavedContextMenuInfo";
import { useEffect, useMemo, useState } from "preact/hooks";
import { MonacoWrapper } from "./MonacoWrapper";
import { sampleText } from "../helpers/sampleData";
import { SnippetOutput } from "./SnippetOutput";
import { createId } from "../helpers/idHelpers";
import { Button } from "./Button";
import { ContextMenuInfo } from "../types/Domain";
import { useSnippetStore } from "../hooks/useSnippetStore";
import { Panel } from "./Panel";
import { EditSnippetModal } from "./EditSnippetModal";
import { useSelectedEntity } from "../hooks/useSelectedEntity";
import { SnippetList } from "./SnippetList";

interface RunState {
  runId: string;
  script: string;
  inputText: string;
}

export const SnippetsAndOptions: FunctionComponent<{
  title: string;
  mockInput: boolean;
}> = ({ title, mockInput }) => {
  const { snippets, upsertSnippet, createSnippet, deleteSnippet } =
    useSnippetStore();
  const contextState = useSavedContextMenuInfo();
  const [editingSnippet, setEditingSnippetId] = useSelectedEntity(snippets);
  const [runningSnippet, setRunningSnippetId] = useSelectedEntity(snippets);
  const [runState, setRunState] = useState<RunState | null>(null);
  const { rawInputText, inputText, setInputText } = useInputText(
    mockInput,
    contextState.contextMenuInfo
  );

  useEffect(() => {
    if (!runningSnippet) return;
    setRunState({
      script: runningSnippet.script,
      runId: createId(),
      inputText, // Grab the new input text
    });
  }, [runningSnippet]);

  const shouldShowInput = mockInput || !contextState.isLoading;

  return (
    <div className="snippets-and-options">
      <Box as="header">
        <Box as="h1" className="h1">
          {title}
        </Box>
      </Box>
      <div className="content-grid">
        <Panel title="Input">
          {shouldShowInput ? (
            <div className="input-text-editor">
              <PermissionAlert />
              <MonacoWrapper
                language={null}
                initialValue={rawInputText}
                onChange={setInputText}
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Panel>

        <Panel
          title="Snippet"
          action={<Button onClick={createSnippet}>+ Add Snippet</Button>}
        >
          <div>
            {snippets && (
              <SnippetList
                snippets={snippets}
                onDelete={deleteSnippet}
                onEdit={setEditingSnippetId}
                // Todo: Allow rerunning
                onRun={setRunningSnippetId}
              />
            )}
          </div>
          {editingSnippet && (
            <EditSnippetModal
              snippet={editingSnippet}
              onClose={() => setEditingSnippetId(null)}
              onSave={upsertSnippet}
            />
          )}
        </Panel>

        <Panel
          title="Output"
          action={
            runState && (
              <Button
                onClick={() => {
                  if (runningSnippet)
                    setRunState({
                      script: runningSnippet.script,
                      runId: createId(),
                      inputText,
                    });
                }}
              >
                Rerun
              </Button>
            )
          }
        >
          {runState ? (
            <SnippetOutput
              key={runState.runId}
              inputText={runState.inputText}
              script={runState.script}
            />
          ) : (
            <p>Run a snippet to view your output here</p>
          )}
        </Panel>
      </div>
    </div>
  );
};

const useInputText = (
  mockInput: boolean,
  contextInfo: ContextMenuInfo | null
) => {
  const [inputText, setInputText] = useState("");

  const rawInputText = useMemo(() => {
    if (mockInput) return sampleText;
    if (!contextInfo) return "No input";
    return (
      contextInfo.manualSelectionText ||
      contextInfo.selectionText ||
      contextInfo.linkUrl ||
      "No input"
    );
  }, [mockInput, contextInfo]);

  useEffect(() => {
    setInputText(rawInputText);
  }, [rawInputText]);

  return { inputText, setInputText, rawInputText };
};
