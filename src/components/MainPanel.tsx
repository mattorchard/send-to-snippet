import { h, FunctionComponent } from "preact";
import { Heading } from "./Heading";
import { Box } from "./Box";
import { ScrollShadows } from "./ScrollShadows";
import { Renderable } from "../types/UtilityTypes";

export const MainPanel: FunctionComponent<{
  title: Renderable;
  action?: Renderable;
  content: Renderable;
  footer: Renderable;
}> = ({ title, action, content, footer }) => (
  <section className="main__panel glass">
    <Box
      as="header"
      className="main__panel__header"
      justifyContent="space-between"
    >
      <Heading level={2}>{title}</Heading>
      {action}
    </Box>
    <ScrollShadows className="main__panel__content">{content}</ScrollShadows>
    <footer className="main__panel__footer">{footer}</footer>
  </section>
);
