import { h, FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import { Overlapper } from "./Overlapper";

const wait = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

type CopyPasteState = "idle" | "copied" | "error";

export const CopyTextButton: FunctionComponent<{ textToCopy: string }> = ({
  textToCopy,
}) => {
  const [state, setState] = useState<CopyPasteState>("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setState("copied");
    } catch (error) {
      setState("error");
      console.error("Unable to copy text", error);
      window.alert("Unable to copy paste, sorry!");
    }
    await wait(2_000);
    setState("idle");
  };

  return (
    <Button onClick={handleCopy} disabled={state !== "idle"}>
      <Overlapper
        sections={[
          { content: "Copy Text", isActive: state === "idle" },
          { content: "Copied!", isActive: state === "copied" },
          { content: "Error!", isActive: state === "error" },
        ]}
      />
    </Button>
  );
};
