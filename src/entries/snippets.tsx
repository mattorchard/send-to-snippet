import { render, h } from "preact";
import "preact/devtools";
import { Main } from "../components/Main";

const Snippets = () => <Main title="Send 2 Snippet" shouldMockData={false} />;
render(<Snippets />, document.getElementById("root")!);
