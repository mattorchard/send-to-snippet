import { h, FunctionComponent } from "preact";
import "../styles/Reset.css";
import "../styles/Tokens.css";
import "../styles/Utilities.css";
import "../styles/Framework.css";
import "../styles/Main.css";
import { Heading } from "./Heading";
import { Box } from "./Box";
import { useSnippetStore } from "../hooks/useSnippetStore";
import { SnippetPanel } from "./SnippetPanel";
import { useSelectedEntity } from "../hooks/useSelectedEntity";
import { EditSnippetModal } from "./EditSnippetModal";
import { InputPanel } from "./InputPanel";
import { useState } from "preact/hooks";
import { EmptyOutputPanel, OutputPanel } from "./OutputPanel";
import { Snippet } from "../types/Domain";

export const Main: FunctionComponent = () => {
  const { snippets, upsertSnippet, createSnippet, deleteSnippet } =
    useSnippetStore();
  const [editingSnippet, setEditingSnippetId] = useSelectedEntity(snippets);
  const [inputText, setInputText] = useState("");

  const [runState, setRunState] = useState<RunState | null>(null);

  const runSnippet = (snipIdToRun: string) => {
    const snippet = snippets?.find((snip) => snip.id === snipIdToRun);
    if (!snippet) {
      console.debug("Can't find snippet to run");
      return;
    }
    return setRunState({
      runAt: new Date(),
      snippet,
      inputText,
    });
  };

  return (
    <div className="main">
      <Box as="header">
        <Heading level={1}>S2S — Options</Heading>
      </Box>
      <main className="main__content">
        <InputPanel shouldMockData onChange={setInputText} />

        <SnippetPanel
          snippets={snippets}
          onAdd={createSnippet}
          onDelete={deleteSnippet}
          onEdit={setEditingSnippetId}
          onRun={runSnippet}
        />

        {runState ? (
          <OutputPanel
            runAt={runState.runAt}
            script={runState.snippet.script}
            inputText={runState.inputText}
            onRerun={() => runSnippet(runState.snippet.id)}
          />
        ) : (
          <EmptyOutputPanel />
        )}
      </main>
      {editingSnippet && (
        <EditSnippetModal
          snippet={editingSnippet}
          onSave={upsertSnippet}
          onClose={() => setEditingSnippetId(null)}
        />
      )}
    </div>
  );
};

interface RunState {
  runAt: Date;
  snippet: Snippet;
  inputText: string;
}
