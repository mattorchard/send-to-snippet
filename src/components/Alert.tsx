import { FunctionComponent, h, JSX } from "preact";
import { bem } from "../helpers/StyleHelper";

export const Alert: FunctionComponent<{
  intent: "warning" | "error" | "success";
  title: string;
  body: JSX.Element;
  action?: JSX.Element;
}> = ({ intent, title, body, action }) => (
  <div className={bem("alert", [intent], "tile")}>
    <h4 className="h4 alert__heading">{title}</h4>
    <div className="alert__content">{body}</div>
    {action && <div className="alert__action">{action}</div>}
  </div>
);
