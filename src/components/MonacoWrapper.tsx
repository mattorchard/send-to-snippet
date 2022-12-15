import { h } from "preact";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import type { editor } from "monaco-editor";
import { memo } from "preact/compat";

interface MonacoWrapperProps {
  initialValue: string;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  language: "javascript" | null;
  rows: number;
}

export const MonacoWrapper = memo(
  ({ initialValue, language, rows, onInput, onChange }: MonacoWrapperProps) => {
    const containerRef = useRef<HTMLDivElement>(undefined!);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    useLayoutEffect(() => {
      console.debug("Initializing editor with value", { initialValue });
      const editor = monaco.editor.create(containerRef.current, {
        value: initialValue,
        language: language ?? undefined,
        theme: "vs-dark",
        minimap: { enabled: false },
        automaticLayout: true,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
      });
      editorRef.current = editor;
      return () => editor.dispose();
    }, []);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !onInput) return () => {};

      const disposer = editor.onDidChangeModelContent(() =>
        onInput(editor.getValue())
      );
      return () => disposer.dispose();
    }, [onInput]);

    return (
      <div
        ref={containerRef}
        className="monaco-wrapper"
        style={{ height: `${rows}rem` }}
        onBlur={() => {
          onChange?.(editorRef.current?.getValue() ?? "");
        }}
      />
    );
  }
);

const tsWorker = new Worker(
  "node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js",
  { type: "module" }
);
const textWorker = new Worker(
  "node_modules/monaco-editor/esm/vs/editor/editor.worker.js",
  { type: "module" }
);

self.MonacoEnvironment = {
  getWorker: (_, label) => {
    switch (label) {
      case "javascript":
        return tsWorker;
      default:
        return textWorker;
    }
  },
};
