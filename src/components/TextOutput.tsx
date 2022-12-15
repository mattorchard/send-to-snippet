import { h, FunctionComponent } from "preact";

export const TextOutput: FunctionComponent<{ text: string }> = ({ text }) => (
  <output className="text-output">
    <code>
      <pre>{text}</pre>
    </code>
  </output>
);
