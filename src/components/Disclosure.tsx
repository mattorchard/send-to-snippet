import { h, FunctionComponent, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

export const Disclosure: FunctionComponent<{
  summary: JSX.Element | string;
  className?: string;
  defaultIsOpen?: boolean;
}> = ({ summary, children, className = "", defaultIsOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  // Props can force open
  useEffect(() => {
    if (defaultIsOpen) setIsOpen(defaultIsOpen);
  }, [defaultIsOpen]);

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className={`disclosure ${className}`}
    >
      <summary className="disclosure__summary">{summary}</summary>
      <div className="disclosure__content">{children}</div>
    </details>
  );
};
