import { h, FunctionComponent, Fragment, JSX } from "preact";

export const Overlapper: FunctionComponent<{
  active: string;
  options: Record<string, JSX.Element | string>;
}> = ({ active, options }) => (
  <div className="overlapper">
    {Object.entries(options).map(([key, value]) => (
      <span
        key={key}
        className={`overlapper__option ${
          key === active && "overlapper__option--active"
        }`}
      >
        {value}
      </span>
    ))}
  </div>
);
