import { FunctionComponent, h, JSX } from "preact";
import { Box } from "./Box";

export const Alert: FunctionComponent<{
  intent: "success" | "warning" | "error";
  title: string;
  body: JSX.Element;
  action?: JSX.Element;
}> = ({ intent, title, body, action }) => (
  <Box
    className={`alert alert--${intent}`}
    flexDirection="column"
    gap={0.25}
    pl={1}
  >
    <h4 className="h4">{title}</h4>
    <div>{body}</div>
    {action && <div>{action}</div>}
  </Box>
);
