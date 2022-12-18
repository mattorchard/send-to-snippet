import { h, ComponentProps, FunctionComponent } from "preact";

interface ButtonProps extends ComponentProps<"button"> {
  intent?: "warning";
}

export const Button: FunctionComponent<ButtonProps> = ({
  intent,
  className = "",
  type = "button",
  ...props
}) => (
  <button {...props} type={type} className={`btn btn--${intent} ${className}`}>
    {props.children}
  </button>
);
