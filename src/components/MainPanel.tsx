import { h, FunctionComponent, Ref } from "preact";
import { Heading } from "./Heading";
import { Box } from "./Box";
import { ScrollShadows } from "./ScrollShadows";
import { Renderable } from "../types/UtilityTypes";
import { forwardRef } from "preact/compat";

interface MainPanelProps {
  title: Renderable;
  action?: Renderable;
  content: Renderable;
  footer?: Renderable;
  ref?: Ref<HTMLElement>;
}

export const MainPanel: FunctionComponent<MainPanelProps> = forwardRef(
  ({ title, action, content, footer }: MainPanelProps, ref) => (
    <section className="main__panel glass" ref={ref}>
      <Box as="header" className="main__panel__header">
        <Heading level={2}>{title}</Heading>
        {action}
      </Box>
      <ScrollShadows className="main__panel__content">{content}</ScrollShadows>
      <footer className="main__panel__footer">{footer}</footer>
    </section>
  ),
);
