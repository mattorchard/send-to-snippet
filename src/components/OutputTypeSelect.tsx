import { h, FunctionComponent } from "preact";
import { SnippetOutputType, SnippetOutputTypeData } from "../types/Domain";

export const OutputTypeSelect: FunctionComponent<{
  value: SnippetOutputType;
  onChange: (value: SnippetOutputType) => void;
}> = ({ value, onChange }) => (
  <select
    name="output-type"
    aria-label="Output type"
    className="output-type-select button interactive"
    value={value}
    onChange={(e) => onChange(e.currentTarget.value as SnippetOutputType)}
  >
    {SnippetOutputTypeData.map(({ value, label, description }) => (
      <option key={value} value={value} title={description}>
        {label}
      </option>
    ))}
  </select>
);
