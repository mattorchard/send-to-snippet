import { h } from "preact";
import {
  Ref,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "preact/hooks";
import * as monaco from "monaco-editor";
import type { editor } from "monaco-editor";
import { forwardRef, memo } from "preact/compat";
import { initMonaco } from "../helpers/monacoSetup";
import { useLiveCallback } from "../hooks/useLiveCallback";
initMonaco();

interface MonacoWrapperProps {
  language: "typescript" | "json" | null;
  initialValue: string;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onEscape?: () => void;
}

export interface MonacoWrapperRef {
  getValue: () => string | null;
}

export const MonacoWrapper = memo(
  forwardRef(
    (
      {
        initialValue,
        language,
        isReadOnly = false,
        autoFocus = false,
        onInput,
        onChange,
        onEscape,
      }: MonacoWrapperProps,
      ref: Ref<MonacoWrapperRef>
    ) => {
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

      const onEscapeLive = useLiveCallback(onEscape ?? (() => {}));

      useLayoutEffect(() => {
        editorRef.current?.addCommand(
          monaco.KeyCode.Escape,
          onEscapeLive,
          "!findWidgetVisible && !inReferenceSearchEditor && !editorHasSelection && !suggestWidgetVisible"
        );
      }, [onEscape]);

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

      useImperativeHandle(
        ref,
        () => ({ getValue: () => editorRef.current?.getValue() ?? null }),
        []
      );

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
  )
);
