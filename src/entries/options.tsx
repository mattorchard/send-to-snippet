import { render, h } from "preact";
import "preact/devtools";
import { Main } from "../components/Main";

const Options = () => <Main title="S2S — Options" shouldMockData />;

render(<Options />, document.getElementById("root")!);
