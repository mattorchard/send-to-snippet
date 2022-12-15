import { ComponentProps, FunctionComponent, h } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";

type BaseTextAreaProps = ComponentProps<'textarea'>;

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = '0px';
  textarea.style.height = `${textarea.scrollHeight}px`;
};


export const AutosizedTextarea: FunctionComponent<BaseTextAreaProps> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(undefined!);
  useLayoutEffect(() => {
    resizeTextarea(ref.current)
  }, [])
  return <textarea {...props} ref={ref} onInput={event => {
    resizeTextarea(ref.current)
    props.onInput?.call(undefined as never, event)
  }} />
}