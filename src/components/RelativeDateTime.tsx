import { FunctionComponent, h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

export const RelativeDateTime: FunctionComponent<{ date?: Date }> = ({
  date: inputDate,
}) => {
  const [mountDate] = useState(() => new Date());
  const [, setUpdate] = useState(0);
  const eventDate = useMemo(
    () => inputDate ?? mountDate,
    [inputDate, mountDate]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdate((s) => s + 1);
    }, 10_000);
    return () => clearInterval(intervalId);
  }, []);

  const delta = Date.now() - eventDate.getTime();

  return (
    <time
      dateTime={eventDate.toISOString()}
      title={eventDate.toLocaleDateString("en-CA")}
    >
      {formatRelativeTime(delta)}
    </time>
  );
};

const SEC = 1_000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const timeUnits = [
  [DAY, "d"],
  [HOUR, "h"],
  [MIN, "m"],
  [SEC, "s"],
] as const;

const formatRelativeTime = (delta: number) => {
  for (const [interval, unit] of timeUnits) {
    if (delta > 2 * interval) {
      const count = Math.floor(delta / interval);
      return `${count}${unit}`;
    }
  }
  return `1s`;
};
