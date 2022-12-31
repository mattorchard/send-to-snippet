import { render, h } from "preact";
import "preact/devtools";
import { Main } from "../components/Main";

const Options = () => <Main />;

render(<Options />, document.getElementById("root")!);
