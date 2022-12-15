import { FunctionComponent, h } from "preact";

import { Box } from "../components/Box";
import { SnippetOptionList } from "../components/SnippetOptionList";
import { PermissionAlert } from "../components/PermissionAlert";
import { useSentContextData } from "../hooks/useSentContextData";
import { useEffect, useMemo, useState } from "preact/hooks";
import { MonacoWrapper } from "./MonacoWrapper";
import { sampleText } from "../helpers/sampleData";

export const SnippetsAndOptions: FunctionComponent<{
  title: string;
  mockInput: boolean;
}> = ({ title, mockInput }) => {
  const [inputText, setInputText] = useState("");
  const contextState = useSentContextData();

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
    <Box
      className="snippets-and-options"
      flexDirection="column"
      pt={1}
      pb={4}
      gap={5}
    >
      <Box as="h1" className="h1">
        {title}
      </Box>
      <PermissionAlert />
      <Box as="section" gap={1.5} flexDirection="column">
        <Box as="h2" className="h2">
          Input
        </Box>
        {shouldShowEditor ? (
          <div className="input-text-editor">
            <MonacoWrapper
              language={null}
              initialValue={rawInputText}
              onChange={setInputText}
              rows={25}
            />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
      <SnippetOptionList inputText={inputText} />
    </Box>
  );
};
