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
  <button
    {...props}
    type={type}
    className={`button button--${intent} interactive ${className}`}
  >
    {props.children}
  </button>
);
