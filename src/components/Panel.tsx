import { FunctionComponent, h, JSX } from "preact";
import { Box } from "../components/Box";

export const Panel: FunctionComponent<{
  title: string;
  action?: JSX.Element | null;
}> = ({ title, action, children }) => (
  <section className="panel">
    <Box as="header" mb={0.5}>
      <Box as="h2" className="h2" mr="auto">
        {title}
      </Box>
      {action}
    </Box>
    {children}
  </section>
);
