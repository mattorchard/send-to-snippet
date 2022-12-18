import { h, FunctionComponent } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { memo } from "preact/compat";
import { Button } from "./Button";
import { MonacoWrapper } from "./MonacoWrapper";
import { Box } from "./Box";

export const DataOutput: FunctionComponent<{ data: unknown }> = memo(
  ({ data }) => {
    const contentRef = useRef<HTMLDivElement>(undefined!);

    const isString = typeof data === "string";
    const hasToString =
      data?.toString &&
      ![Object.prototype.toString, Array.prototype.toString].includes(
        data.toString
      );

    const stringData = useMemo(() => {
      if (isString) return data;
      if (hasToString) return data.toString();
      return JSON.stringify(data, null, 2);
    }, [isString, hasToString, data]);

    const language = isString || hasToString ? null : "json";

    return (
      <div className="data-output">
        <Box justifyContent="flex-end">
          <Button onClick={() => navigator.clipboard.writeText(stringData)}>
            Copy Text
          </Button>
          <Button onClick={() => contentRef.current.requestFullscreen()}>
            Full Screen
          </Button>
        </Box>
        <div className="data-output__content" ref={contentRef}>
          <MonacoWrapper
            isReadOnly
            language={language}
            initialValue={stringData}
          />
        </div>
      </div>
    );
  }
);
