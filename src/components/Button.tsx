import { h, ComponentProps, FunctionComponent } from "preact";
import { bem } from "../helpers/StyleHelper";

interface ButtonProps extends ComponentProps<"button"> {
  intent?: "warning";
}

export const Button: FunctionComponent<ButtonProps> = ({
  intent,
  className = "",
  type = "button",
  ...props
}) => (
  <button
    {...props}
    type={type}
    className={`interactive ${className} ${bem("btn", [intent])}`}
  >
    {props.children}
  </button>
);
