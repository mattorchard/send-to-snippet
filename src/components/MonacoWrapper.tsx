import { h } from "preact";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import * as monaco from "monaco-editor";
import type { editor } from "monaco-editor";
import { memo } from "preact/compat";
import { initMonaco } from "../helpers/monacoSetup";
initMonaco();

interface MonacoWrapperProps {
  language: "typescript" | "json" | null;
  initialValue: string;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  isReadOnly?: boolean;
  autoFocus?: boolean;
}

export const MonacoWrapper = memo(
  ({
    initialValue,
    language,
    onInput,
    onChange,
    isReadOnly = false,
    autoFocus = false,
  }: MonacoWrapperProps) => {
    const containerRef = useRef<HTMLDivElement>(undefined!);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    useLayoutEffect(() => {
      const editor = monaco.editor.create(containerRef.current, {
        value: initialValue,
        language: language ?? undefined,
        readOnly: isReadOnly,
        theme: "vs-dark",
        folding: true,
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
      if (autoFocus) {
        editorRef.current?.focus();
      }
    }, [autoFocus]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !onInput) return () => {};

      const disposer = editor.onDidChangeModelContent(() =>
        onInput(editor.getValue())
      );
      return () => disposer.dispose();
    }, [onInput]);

    useEffect(() => {
      editorRef.current?.setValue(initialValue);
    }, [initialValue]);

    return (
      <div
        ref={containerRef}
        className="monaco-wrapper tile"
        onBlur={() => {
          onChange?.(editorRef.current?.getValue() ?? "");
        }}
      />
    );
  }
);
