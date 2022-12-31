import { render, h } from "preact";
import "preact/devtools";
import { Main } from "../components/Main";

const Snippets = () => <Main />;
render(<Snippets />, document.getElementById("root")!);
