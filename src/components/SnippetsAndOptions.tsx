import { FunctionComponent, h, JSX } from "preact";

import { Box } from "../components/Box";
import { PermissionAlert } from "../components/PermissionAlert";
import { useSentContextData } from "../hooks/useSentContextData";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { MonacoWrapper } from "./MonacoWrapper";
import { sampleText } from "../helpers/sampleData";
import { SnippetTable } from "./SnippetTable";

import { SnippetOutput } from "./SnippetOutput";
import { createId } from "../helpers/idHelpers";
import { Button } from "./Button";

interface RunState {
  runId: string;
  script: string;
  inputText: string;
}

export const SnippetsAndOptions: FunctionComponent<{
  title: string;
  mockInput: boolean;
}> = ({ title, mockInput }) => {
  const [inputText, setInputText] = useState("");
  const [runState, setRunState] = useState<RunState | null>(null);
  const contextState = useSentContextData();

  const rerun = useCallback(
    () =>
      setRunState((runState) => runState && { ...runState, runId: createId() }),
    []
  );

  const rawInputText = useMemo(() => {
    if (mockInput) return sampleText;
    const res = contextState.result;
    if (!res) return "";
    return (
      res.manualSelectionText || res.selectionText || res.linkUrl || "No input"
    );
  }, [mockInput, contextState.result]);

  useEffect(() => {
    setInputText(rawInputText);
  }, [rawInputText]);

  const shouldShowEditor = mockInput || !contextState.isLoading;

  return (
    <div className="snippets-and-options">
      <Box as="header">
        <Box as="h1" className="h1">
          {title}
        </Box>
      </Box>
      <div className="content-grid">
        <Panel title="Input">
          {shouldShowEditor ? (
            <div className="input-text-editor">
              <Box mb={1}>
                <PermissionAlert />
              </Box>
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

        <Panel title="Snippet" action={<Button>+ Add Snippet</Button>}>
          <div>
            <SnippetTable
              onRunSnippet={(script) =>
                setRunState({ inputText, script, runId: createId() })
              }
            />
          </div>
        </Panel>

        <Panel
          title="Output"
          action={runState && <Button onClick={rerun}>Rerun</Button>}
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

const Panel: FunctionComponent<{
  title: string;
  action?: JSX.Element | null;
}> = ({ title, action, children }) => (
  <section className="panel">
    <Box as="header" mb={0.5}>
      <Box as="h2" className="h2" mr="auto">
        {title}
      </Box>
      {action}
    </Box>
    {children}
  </section>
);
