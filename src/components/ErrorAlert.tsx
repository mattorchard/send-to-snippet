import { h, FunctionComponent, Fragment } from "preact";
import { Alert } from "./Alert";

export const ErrorAlert: FunctionComponent<{ error: Error }> = ({ error }) => {
  const stackCount = error.stack?.split("\n").length ?? 0;
  return (
    <Alert
      intent="error"
      title={error.name}
      body={
        <Fragment>
          <p>{error.message}</p>
          <code style={{ height: `${Math.min(stackCount, 10)}rem` }}>
            <pre>{error.stack}</pre>
          </code>
        </Fragment>
      }
    />
  );
};
