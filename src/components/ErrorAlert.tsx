import { h, FunctionComponent, Fragment } from "preact";
import { Alert } from "./Alert";

export const ErrorAlert: FunctionComponent<{ error: Error }> = ({ error }) => (
  <Alert
    intent="error"
    title={error.name}
    body={
      <Fragment>
        <p>{error.message}</p>
        <code>
          <pre>{error.stack}</pre>
        </code>
      </Fragment>
    }
  />
);
