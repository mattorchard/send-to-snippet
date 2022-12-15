import { render, h } from "preact";
import "preact/devtools";
import { SnippetsAndOptions } from "../components/SnippetsAndOptions";
import "../styles/Base.css";

const Options = () => <SnippetsAndOptions title="S2S — Options" mockInput />;

render(<Options />, document.getElementById("root")!);
