import { h, FunctionComponent, Fragment } from "preact";
import { LinkHrefs } from "../helpers/LinkHrefs";
import { useSandboxReply } from "../hooks/useSandboxReply";
import { Box } from "./Box";
import { Button } from "./Button";
import { DataOutput } from "./DataOutput";
import { Disclosure } from "./Disclosure";
import { ErrorAlert } from "./ErrorAlert";
import { RelativeDateTime } from "./RelativeDateTime";

export const SnippetOutput: FunctionComponent<{
  script: string;
  inputText: string;
}> = ({ script, inputText }) => {
  const { ref, state, isLoading } = useSandboxReply();
  const handleLoad = () => {
    ref.current.contentWindow!.postMessage({ script, inputText }, "*");
  };

  const showTextOutput = state.hasResolved && state.result;

  return (
    <div className="snippet-output">
      {state.hasError && (
        <Fragment>
          {state.error ? (
            <ErrorAlert error={state.error} />
          ) : (
            <p>An unknown error occurred</p>
          )}
        </Fragment>
      )}

      <Disclosure
        summary={<DisHeader>Document</DisHeader>}
        defaultIsOpen={state.hasMutated}
      >
        <Box justifyContent="flex-end">
          <Button onClick={() => ref.current.requestFullscreen()}>
            Full Screen
          </Button>
        </Box>
        <iframe
          ref={ref}
          src={LinkHrefs.sandbox}
          onLoad={handleLoad}
          className="snippet-output__iframe"
          loading="eager"
        />
      </Disclosure>

      <Disclosure
        summary={<DisHeader>Result</DisHeader>}
        defaultIsOpen={!!showTextOutput}
        className="results-disclosure"
      >
        {showTextOutput ? <DataOutput data={state.result} /> : <p>No Output</p>}
      </Disclosure>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>
          Last run <RelativeDateTime /> ago
        </p>
      )}
    </div>
  );
};

const DisHeader: FunctionComponent = ({ children }) => (
  <Box as="h3" className="h3" inline ml={0.25} pb={0.25}>
    {children}
  </Box>
);
