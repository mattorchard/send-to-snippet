import { h, FunctionComponent } from "preact";
import { memo } from "preact/compat";

const nbsp = " ";

const formatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const DateTime: FunctionComponent<{ date: Date }> = memo(({ date }) => {
  const dateTimeString = formatter.format(date).replaceAll(" ", nbsp);
  return <time dateTime={date.toISOString()}>{dateTimeString}</time>;
});
