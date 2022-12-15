import { render, h } from "preact";
import "preact/devtools";
import "../styles/Base.css";
import { SnippetsAndOptions } from "../components/SnippetsAndOptions";

const Snippets = () => (
  <SnippetsAndOptions title="Send 2 Snippets" mockInput={false} />
);
render(<Snippets />, document.getElementById("root")!);
