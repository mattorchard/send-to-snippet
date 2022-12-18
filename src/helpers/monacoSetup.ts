import * as monaco from "monaco-editor";

const tsWorker = new Worker(
  "node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js",
  { type: "module" }
);

const jsonWorker = new Worker(
  "node_modules/monaco-editor/esm/vs/language/json/json.worker.js",
  { type: "module" }
);
const textWorker = new Worker(
  "node_modules/monaco-editor/esm/vs/editor/editor.worker.js",
  { type: "module" }
);

const SANDBOX_EXTRA_LIB = "const input: string;";

export const initMonaco = () => {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [
      // Allow return outside of function body
      1108,
    ],
  });

  monaco.languages.typescript.typescriptDefaults.addExtraLib(SANDBOX_EXTRA_LIB);

  self.MonacoEnvironment = {
    getWorker: (_, label) => {
      switch (label) {
        case "typescript":
          return tsWorker;
        case "json":
          return jsonWorker;
        default:
          return textWorker;
      }
    },
  };
};
