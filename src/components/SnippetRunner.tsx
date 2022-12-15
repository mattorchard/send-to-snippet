import { h, FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { LinkHrefs } from "../helpers/LinkHrefs";
import { useSandboxIframe } from "../hooks/useSandboxIframe";
import { Snippet } from "../types/Domain";
import { Box } from "./Box";
import { Button } from "./Button";
import { TextOutput } from "./TextOutput";

export const SnippetRunner: FunctionComponent<{
  snippet: Snippet;
  inputText: string;
}> = ({ snippet, inputText }) => {
  const { src, ref, response, runScript } = useSandboxIframe();
  const isIframeVisible = snippet.outputType === "document";
  const isAutoRun = snippet.outputType !== "effect";

  useEffect(() => {
    if (!isAutoRun) return;
    runScript(snippet.script, inputText);
  }, [isAutoRun, snippet.script, inputText]);

  const responseString = useMemo(
    () =>
      typeof response === "string"
        ? response
        : JSON.stringify(response, null, 2),
    [response]
  );

  return (
    <section className="snippet-runner">
      <Box as="header">
        <Button onClick={() => runScript(snippet.script, inputText)}>
          {snippet.outputType === "effect" ? "Run" : "Rerun"}
        </Button>
        {snippet.outputType === "text" && (
          <Button onClick={() => navigator.clipboard.writeText(responseString)}>
            Copy text
          </Button>
        )}
        {snippet.outputType === "document" && (
          <Button onClick={() => ref.current.requestFullscreen()}>
            Fullscreen
          </Button>
        )}
      </Box>
      {snippet.outputType === "text" && <TextOutput text={responseString} />}
      <div>
        <iframe
          ref={ref}
          src={src}
          hidden={!isIframeVisible}
          className="sandbox-iframe"
        />
      </div>
    </section>
  );
};
