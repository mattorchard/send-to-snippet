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
import { useCallback, useEffect, useState } from "preact/hooks";
import { EmptyOutputPanel, OutputPanel } from "./OutputPanel";
import { Snippet } from "../types/Domain";
import { PermissionAlert } from "./PermissionAlert";
import { BackgroundPicture } from "./BackgroundPicture";
import { Logger } from "../helpers/Logger";

export const Main: FunctionComponent<{
  title: string;
  shouldMockData: boolean;
}> = ({ title, shouldMockData }) => {
  const [inputText, setInputText] = useState("");

  const { snippets, upsertSnippet, createSnippet, deleteSnippet } =
    useSnippetStore();

  const [editingSnippet, setEditingSnippetId] = useSelectedEntity(snippets);
  const handleCloseModal = useCallback(() => setEditingSnippetId(null), []);

  const [runState, setRunState] = useState<RunState | null>(null);

  const runSnippet = (snipIdToRun: string) => {
    const snippet = snippets?.find((snip) => snip.id === snipIdToRun);
    if (!snippet) {
      logger.warn("Can't find snippet to run", snipIdToRun);
      return;
    }
    return setRunState({
      runAt: new Date(),
      snippet,
      inputText,
    });
  };

  // Rerun modified snippets
  useEffect(() => {
    if (!runState) return;
    const liveSnippet = snippets?.find(
      (snip) => snip.id === runState.snippet.id
    );
    if (!liveSnippet) return;
    if (liveSnippet.updatedAt < runState.runAt) return;

    runSnippet(liveSnippet.id);
  }, [snippets]);

  return (
    <div className="main--s2s">
      <Box as="header" justifyContent="space-between">
        <Heading level={1} className="hero__heading glass">
          {title}
        </Heading>
        <PermissionAlert />
      </Box>
      <main className="main__content">
        <InputPanel shouldMockData={shouldMockData} onChange={setInputText} />

        <SnippetPanel
          snippets={snippets}
          runningSnippetId={runState?.snippet.id ?? null}
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
          onClose={handleCloseModal}
        />
      )}
      <BackgroundPicture />
    </div>
  );
};

const logger = new Logger("Main");

interface RunState {
  runAt: Date;
  snippet: Snippet;
  inputText: string;
}
