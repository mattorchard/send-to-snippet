import { render, h } from "preact";
import "preact/devtools";
import { Main } from "../components/Main";

const Options = () => <Main title="Send 2 Snippet" shouldMockData />;

render(<Options />, document.getElementById("root")!);
