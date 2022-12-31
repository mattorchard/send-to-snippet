import { h, FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { sampleText } from "../helpers/sampleData";
import { useSavedContextMenuInfo } from "../hooks/useSavedContextMenuInfo";
import { MainPanel } from "./MainPanel";
import { MonacoWrapper } from "./MonacoWrapper";
import { Skeleton } from "./Skeleton";

export const InputPanel: FunctionComponent<{
  shouldMockData: boolean;
  onChange: (value: string) => void;
}> = ({ shouldMockData, onChange }) => {
  const contextState = useSavedContextMenuInfo();

  const rawInputText = useMemo(() => {
    if (shouldMockData) return sampleText;
    const contextInfo = contextState.contextMenuInfo;
    if (!contextInfo) return "No input";
    return (
      contextInfo.manualSelectionText ||
      contextInfo.selectionText ||
      contextInfo.linkUrl ||
      "No input"
    );
  }, [shouldMockData, contextState]);

  useEffect(() => {
    onChange(rawInputText);
  }, [rawInputText]);

  const isLoading = !shouldMockData && contextState.isLoading;

  return (
    <MainPanel
      title="Input"
      content={
        isLoading ? (
          <Skeleton height={7} />
        ) : (
          <MonacoWrapper
            language={null}
            initialValue={rawInputText}
            onChange={onChange}
          />
        )
      }
      footer={
        // Todo: Make details visible in modal
        <span className="ellipses">
          From: {contextState.contextMenuInfo?.srcUrl ?? "Unknown"}
        </span>
      }
    />
  );
};
