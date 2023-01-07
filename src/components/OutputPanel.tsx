import { h, FunctionComponent, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useSandbox } from "../hooks/useSandbox";
import { ValueOf } from "../types/UtilityTypes";
import { Accordion } from "./Accordion";
import { Box } from "./Box";
import { Button } from "./Button";
import { DataOutput } from "./DataOutput";
import { ErrorAlert } from "./ErrorAlert";
import { MainPanel } from "./MainPanel";
import { Overlapper } from "./Overlapper";
import { RelativeDateTime } from "./RelativeDateTime";
import { Spinner } from "./Spinner";

interface OutputPanelProps {
  script: string;
  inputText: string;
  runAt: Date;
  onRerun: () => void;
}

const sectionIds = {
  IFRAME: "IFRAME",
  RESULT: "RESULT",
} as const;

type SectionId = ValueOf<typeof sectionIds>;

export const OutputPanel: FunctionComponent<OutputPanelProps> = ({
  script,
  inputText,
  runAt,
  onRerun,
}) => {
  const {
    renderSandbox,
    isLoading,
    result,
    error,
    hasResolved,
    hasError,
    hasMutated,
  } = useSandbox({
    script,
    inputText,
    key: runAt.getTime().toString(),
  });
  const [expandedSectionId, setExpandedSectionId] = useState<SectionId | null>(
    null
  );

  useEffect(() => {
    if (isLoading) return;
    if (result) {
      setExpandedSectionId(sectionIds.RESULT);
    } else if (hasMutated) {
      setExpandedSectionId(sectionIds.IFRAME);
    }
  }, [isLoading, hasError, hasResolved, hasMutated]);

  return (
    <MainPanel
      title="Output"
      action={
        <Button onClick={onRerun} disabled={isLoading}>
          <Overlapper
            sections={[
              { content: "Rerun", isActive: !isLoading },
              { content: <Spinner />, isActive: isLoading },
            ]}
          />
        </Button>
      }
      content={
        <div className="output-panel__content-container">
          <div className="output-panel__alert-container scrollable">
            {error && (
              <Box mb={1}>
                <ErrorAlert error={error} />
              </Box>
            )}
          </div>
          <Accordion
            headingLevel={3}
            expandedId={expandedSectionId}
            onChange={setExpandedSectionId}
            sectionClassName="tile"
            sections={[
              {
                id: sectionIds.RESULT,
                header: "Result",
                content: <DataOutput data={result} />,
              },
              {
                id: sectionIds.IFRAME,
                header: "Iframe",
                content: (
                  <div className="output-panel__sandbox-container">
                    {renderSandbox()}
                  </div>
                ),
              },
            ]}
          />
        </div>
      }
      footer={
        isLoading ? (
          <Spinner />
        ) : (
          <span>
            Last run <RelativeDateTime date={runAt} /> ago
          </span>
        )
      }
    />
  );
};

export const EmptyOutputPanel = () => (
  <MainPanel
    title="Output"
    content={
      <Box
        className="tile non-ideal-state"
        p={0.75}
        flexDirection="column"
        gap={0.75}
      >
        <h3 className="h3">View the output</h3>
        <p>Results will appear here after you run a snippet.</p>
      </Box>
    }
    footer={null}
  />
);
