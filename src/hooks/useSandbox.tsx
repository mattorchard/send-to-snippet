import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { LinkHrefs } from "../helpers/LinkHrefs";
import { useSandboxReply } from "./useSandboxReply";

export const useSandbox = ({
  script,
  inputText,
  key,
}: {
  script: string;
  inputText: string;
  key: string;
}) => {
  const { ref, state, isLoading } = useSandboxReply(key);
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const handleLoad = () => {
    setHtmlLoaded(true);
    ref.current.contentWindow!.postMessage(
      { script, inputText, runId: key },
      "*"
    );
  };
  useEffect(() => {
    setHtmlLoaded(false);
  }, [key]);

  const renderSandbox = () => (
    <iframe
      ref={ref}
      key={key}
      src={LinkHrefs.sandbox}
      onLoad={handleLoad}
      hidden={!htmlLoaded}
      loading="eager"
      className="sandbox-iframe"
    />
  );

  return {
    ...state,
    isLoading,
    renderSandbox,
  };
};
