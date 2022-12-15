import { h, FunctionComponent } from "preact";
import { memo } from "preact/compat";

export const DateTime: FunctionComponent<{ date: Date }> = memo(({ date }) =>
  <time
    dateTime={date.toISOString()}
    title={date.toLocaleDateString('en-CA')}>
    {date.toDateString()}
  </time>
);
