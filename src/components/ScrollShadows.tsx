import { h, FunctionComponent } from "preact";
import { useCallback, useEffect, useLayoutEffect, useRef } from "preact/hooks";

const mutateDataProperty = (
  element: HTMLElement,
  key: string,
  value: string
) => {
  if (element.dataset[key] !== value) element.dataset[key] = value;
};

const updateScrollPosition = (element: HTMLElement) => {
  const isAtScrollTop = element.scrollTop === 0;
  const isAtScrollBottom =
    element.scrollTop + element.clientHeight === element.scrollHeight;

  mutateDataProperty(element, "isAtScrollTop", isAtScrollTop.toString());
  mutateDataProperty(element, "isAtScrollBottom", isAtScrollBottom.toString());
};

export const ScrollShadows: FunctionComponent<{ className: string }> = ({
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(undefined!);

  useLayoutEffect(() => {
    updateScrollPosition(ref.current);
    const resizeObserver = new ResizeObserver(() =>
      updateScrollPosition(ref.current)
    );
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  });

  const handleScroll = useCallback((event: Event) => {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    updateScrollPosition(element);
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} scroll-shadows scrollable`}
      onScroll={handleScroll}
    >
      {children}
    </div>
  );
};
