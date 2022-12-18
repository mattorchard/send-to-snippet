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

const formatRelativeTime = (delta: number) => {
  if (delta < 10_000) return "a few seconds";
  const h = Math.floor(delta / HOUR);
  const m = Math.floor((delta % HOUR) / MIN);
  const s = Math.floor((delta % MIN) / SEC);
  const chunks = [`${s}s`];
  if (m || h) chunks.unshift(`${m}m`);
  if (h) chunks.unshift(`${h}h`);
  return chunks.join("");
};
