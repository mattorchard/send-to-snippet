import { FunctionComponent, h } from "preact";

export const SearchInput: FunctionComponent<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <input
      className="search-input"
      type="search"
      aria-label="Search"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};
