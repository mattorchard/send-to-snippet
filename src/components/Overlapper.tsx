import { h, FunctionComponent, Fragment, JSX } from "preact";
import { bem } from "../helpers/StyleHelper";

export const Overlapper: FunctionComponent<{
  active: string;
  options: Record<string, JSX.Element | string>;
}> = ({ active, options }) => (
  <div className="overlapper">
    {Object.entries(options).map(([key, value]) => (
      <span
        key={key}
        className={bem("overlapper__option", { active: key === active })}
      >
        {value}
      </span>
    ))}
  </div>
);
